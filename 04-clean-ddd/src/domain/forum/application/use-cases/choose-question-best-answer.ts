import {Question} from '@/domain/forum/enterprise/entities/question'
import {AnswersRepository} from '../repositories/answers-repository'
import {QuestionsRepository} from '../repositories/questions-repository'
import {Either, left, right} from '@/core/either'
import {ResourceNotFoundError} from './errors/resource-not-found-error'
import {NotAllowedError} from './errors/not-allowed-error'

export interface ChooseQuestionBestAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

export type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private questionsRepository: QuestionsRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    // o author da resposta que decide qual foi a melhor resposta
    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    question.bestAnswerId = answer.id

    await this.questionsRepository.save(question)

    return right({
      question,
    })
  }
}
