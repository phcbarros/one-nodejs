import {PaginationParams} from '@/core/repositories/pagination-params'
import {AnswerCommentsRepository} from '@/domain/forum/application/repositories/answer-comments-repository'
import {AnswerComment} from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public items: AnswerComment[] = []

  async findById(id: string): Promise<AnswerComment | null> {
    const commentAnswer = this.items.find((item) => item.id.toString() === id)

    if (!commentAnswer) {
      return null
    }

    return commentAnswer
  }

  async findManyByAnswerId(questionId: string, {page}: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answerComments
  }

  async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment)
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    )

    this.items.splice(itemIndex, 1)
  }
}
