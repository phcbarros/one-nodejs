import {AnswersRepository} from '@/domain/forum/application/repositories/answers-repository'

export interface DeleteAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

export interface DeleteAnswerUseCaseResponse {}

export class DeleteAnswerUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found')
    }

    if (answer.authorId.toString() !== authorId) {
      throw new Error('Not allowed')
    }

    await this.answerRepository.delete(answer)

    return {}
  }
}
