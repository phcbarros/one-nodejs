import {Question} from '@/domain/forum/enterprise/entities/question'

export interface QuestionsRepository {
  fetchBySlug(slug: string): Promise<Question | null>
  create(question: Question): Promise<void>
}
