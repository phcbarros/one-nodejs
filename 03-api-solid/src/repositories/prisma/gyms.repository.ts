import {prisma} from '@/lib/prisma'
import {Gym, Prisma} from '@prisma/client'
import {GymsRepository} from '../gyms.repository'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    throw new Error('Method not implemented.')
  }
}
