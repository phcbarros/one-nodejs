import {PaginationParams} from '@/core/repositories/pagination-params'
import {StudentsRepository} from '@/domain/forum/application/repositories/students-repository'
import {Question} from '@/domain/forum/enterprise/entities/question'
import {Injectable} from '@nestjs/common'
import {PrismaService} from '../prisma.service'
import {PrismaQuestionMapper} from '../mappers/prisma-question.mapper'
import {Student} from '@/domain/forum/enterprise/entities/student'

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findByEmail(email: string): Promise<Student | null> {
    throw new Error('Method not implemented.')
  }

  async create(student: Student): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
