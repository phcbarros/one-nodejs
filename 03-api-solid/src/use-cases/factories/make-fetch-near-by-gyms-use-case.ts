import {FetchNearbyGymsUseCase} from '../fetch-near-by-gyms'
import {PrismaGymsRepository} from '@/repositories/prisma/gyms.repository'

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new FetchNearbyGymsUseCase(gymsRepository)

  return useCase
}
