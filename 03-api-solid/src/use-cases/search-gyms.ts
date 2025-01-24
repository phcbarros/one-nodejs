import {GymsRepository} from '@/repositories/gyms.repository'
import {Gym} from '@prisma/client'

interface SearchGymsUseCaseRequest {
  query: string
  page: number
}

// Dependency inversion principle

interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return {gyms}
  }
}
