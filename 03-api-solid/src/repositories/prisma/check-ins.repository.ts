import {Prisma, CheckIn} from '@prisma/client'
import {CheckInsRepository} from '../check-ins.repository'
import {prisma} from '@/lib/prisma'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    return await prisma.checkIn.create({
      data,
    })
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    return await prisma.checkIn.findFirstOrThrow({
      where: {
        user_id: userId,
        created_at: date,
      },
    })
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    throw new Error('Method not implemented.')
  }
}
