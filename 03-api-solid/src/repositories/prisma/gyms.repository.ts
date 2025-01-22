import {prisma} from '@/lib/prisma'
import {Gym} from '@prisma/client'
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
}
