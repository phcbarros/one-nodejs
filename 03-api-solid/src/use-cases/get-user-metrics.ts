import {CheckInsRepository} from '@/repositories/check-ins.repository'
import {PrismaCheckInsRepository} from '@/repositories/prisma/check-ins.repository'

// tipagens de entrada e saída

interface GetUserMetricsUseCaseRequest {
  userId: string
}

interface GetUserMetricsCheckCaseResponse {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private readonly checkInsRepository: CheckInsRepository) {}

  public async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsCheckCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
