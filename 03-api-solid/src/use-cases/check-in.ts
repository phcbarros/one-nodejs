import {GymsRepository} from '@/repositories/gyms.repository'
import {PrismaCheckInsRepository} from '@/repositories/prisma/check-ins.repository'
import {CheckIn} from '@prisma/client'
import {ResourceNotFoundError} from './errors/resource-not-found.error'
import {getDistanceBetweenCoordinates} from '@/utils/get-distance-between-coordinates'
import {MaxDistanceError} from './errors/max-distance-error'
import {MaxNumberOfCheckInsError} from './errors/max-number-of-check-ins-error'
import {CheckInsRepository} from '@/repositories/check-ins.repository'

// tipagens de entrada e saída

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private readonly checkInsRepository: CheckInsRepository,
    private readonly gymsRepository: GymsRepository,
  ) {}

  public async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distanceBetweenUserAndGym = getDistanceBetweenCoordinates(
      {latitude: userLatitude, longitude: userLongitude},
      {latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber()},
    )

    const MAX_DISTANCE = 0.1

    if (distanceBetweenUserAndGym > MAX_DISTANCE) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsError()
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }
}
