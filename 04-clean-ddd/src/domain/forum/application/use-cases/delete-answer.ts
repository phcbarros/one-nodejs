import {AnswersRepository} from '@/domain/forum/application/repositories/answers-repository'
import {ResourceNotFoundError} from './errors/resource-not-found-error'
import {NotAllowedError} from './errors/not-allowed-error'
import {Either, left, right} from '@/core/either'

export interface DeleteAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

export type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteAnswerUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.answerRepository.delete(answer)

    return right({})
  }
}
