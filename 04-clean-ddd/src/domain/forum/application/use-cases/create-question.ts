import {Question} from '@/domain/forum/enterprise/entities/question'
import {QuestionsRepository} from '@/domain/forum/application/repositories/questions-repository'
import {UniqueEntityID} from '@/core/entities/unique-entity-id'
import {Either, right} from '@/core/either'

interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question
  }
>

export class CreateQuestionUseCase {
  constructor(private answerRepository: QuestionsRepository) {}

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

    return right({
      question,
    })
  }
}
