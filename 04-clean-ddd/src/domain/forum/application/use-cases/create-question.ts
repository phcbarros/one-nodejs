import {Question} from '@/domain/forum/enterprise/entities/question'
import {QuestionRepository} from '@/domain/forum/application/repositories/questions-repository'
import {UniqueEntityID} from '@/core/entities/unique-entity-id'

interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
}

interface CreateQuestionUseCaseResponse {
  question: Question
}

export class CreateQuestionUseCase {
  constructor(private answerRepository: QuestionRepository) {}

  async execute({
    authorId,
    title,
    content,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content,
    })

    await this.answerRepository.create(question)

    return {
      question,
    }
  }
}
