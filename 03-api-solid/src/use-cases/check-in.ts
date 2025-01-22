import {GymsRepository} from '@/repositories/gyms.repository'
import {PrismaCheckInsRepository} from '@/repositories/prisma/check-ins.repository'
import {CheckIn} from '@prisma/client'
import {ResourceNotFoundError} from './errors/resource-not-found.error'

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
    private readonly checkInsRepository: PrismaCheckInsRepository,
    private readonly gymsRepository: GymsRepository,
  ) {}

  public async execute({
    userId,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDate) {
      throw new Error()
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
