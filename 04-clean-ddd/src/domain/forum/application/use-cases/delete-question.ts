import {Either, left, right} from '@/core/either'
import {QuestionsRepository} from '@/domain/forum/application/repositories/questions-repository'
import {ResourceNotFoundError} from './errors/resource-not-found-error'
import {NotAllowedError} from './errors/not-allowed-error'

interface DeleteQuestionUseCaseRequest {
  questionId: string
  authorId: string
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      left(new ResourceNotFoundError())
    }

    if (question?.authorId.toString() !== authorId) {
      left(new NotAllowedError())
    }

    await this.questionsRepository.delete(question!)

    return right({})
  }
}
