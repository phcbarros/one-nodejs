import {UniqueEntityID} from '@/core/entities/unique-entity-id'
import {Answer} from '@/domain/forum/enterprise/entities/answer'
import {AnswersRepository} from '@/domain/forum/application/repositories/answers-repository'
import {Either, right} from '@/core/either'

interface AnswerQuestionUserCaseRequest {
  questionId: string
  instructorId: string
  content: string
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer
  }
>

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
  }: AnswerQuestionUserCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })

    await this.answerRepository.create(answer)

    return right({answer})
  }
}
