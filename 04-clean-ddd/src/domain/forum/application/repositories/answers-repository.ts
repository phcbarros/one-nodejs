import {Answer} from '@/domain/forum/enterprise/entities/answer'

export interface AnswerRepository {
  findById(id: string): Promise<Answer | null>
  create(answer: Answer): Promise<void>
  delete(question: Answer): Promise<void | null>
}
