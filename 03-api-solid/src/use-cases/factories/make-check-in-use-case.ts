import {PrismaCheckInsRepository} from '@/repositories/prisma/check-ins.repository'
import {CheckInUseCase} from '../check-in'
import {PrismaGymsRepository} from '@/repositories/prisma/gyms.repository'

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CheckInUseCase(checkInsRepository, gymsRepository)

  return useCase
}
