import {PaginationParams} from '@/core/repositories/pagination-params'
import {AnswerCommentsRepository} from '@/domain/forum/application/repositories/answer-comments-repository'
import {AnswerComment} from '@/domain/forum/enterprise/entities/answer-comment'
import {Injectable} from '@nestjs/common'
import {PrismaService} from '../prisma.service'
import {PrismaAnswerCommentMapper} from '../mappers/prisma-answer-comment.mapper'

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComments = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    })

    if (!answerComments) {
      return null
    }

    return PrismaAnswerCommentMapper.toDomain(answerComments)
  }

  async findManyByAnswerId(
    answerId: string,
    {page}: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answerComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    if (!answerComments) {
      return []
    }

    return answerComments.map(PrismaAnswerCommentMapper.toDomain)
  }

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment)

    await this.prisma.comment.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: answerComment.id.toString(),
      },
    })
  }
}
