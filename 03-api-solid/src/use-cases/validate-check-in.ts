import {CheckIn} from '@prisma/client'
import {ResourceNotFoundError} from './errors/resource-not-found.error'
import {CheckInsRepository} from '@/repositories/check-ins.repository'
import dayjs from 'dayjs'
import {LateCheckInValidationError} from './errors/late-check-in-validation.error'

// tipagens de entrada e saída

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private readonly checkInsRepository: CheckInsRepository) {}

  public async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    // obter a diferença entre duas data, agora e a data do check-in
    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at, // sempre passar o passado como 2 parâmetro assim o valor sempre vem positivo
      'minutes',
    )

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
