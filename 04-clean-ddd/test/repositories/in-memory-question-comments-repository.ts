import {PaginationParams} from '@/core/repositories/pagination-params'
import {QuestionCommentsRepository} from '@/domain/forum/application/repositories/question-comments-repository'
import {QuestionComment} from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionsCommentsRepository implements QuestionCommentsRepository {
  public items: QuestionComment[] = []

  async findById(id: string): Promise<QuestionComment | null> {
    const commentQuestion = this.items.find((item) => item.id.toString() === id)

    if (!commentQuestion) {
      return null
    }

    return commentQuestion
  }

  async findManyByQuestionId(questionId: string, {page}: PaginationParams) {
    const questionComments = this.items
      .filter((answer) => answer.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }

  async create(questionComment: QuestionComment): Promise<void> {
    this.items.push(questionComment)
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    )

    this.items.splice(itemIndex, 1)
  }
}
