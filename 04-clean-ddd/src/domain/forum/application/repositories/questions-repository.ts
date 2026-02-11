import {Question} from '@/domain/forum/enterprise/entities/question'

export interface QuestionsRepository {
  fetchBySlug(slug: string): Promise<Question | null>
  findById(id: string): Promise<Question | null>
  save(question: Question): Promise<void>
  create(question: Question): Promise<void>
  delete(question: Question): Promise<void>
}
