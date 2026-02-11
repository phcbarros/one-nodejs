import {UniqueEntityID} from '@/core/entities/unique-entity-id'
import {Answer} from '@/domain/forum/enterprise/entities/answer'
import {AnswersRepository} from '@/domain/forum/application/repositories/answers-repository'

interface AnswerQuestionUserCaseRequest {
  questionId: string
  instructorId: string
  content: string
}

interface AnswerQuestionUseCaseResponse {
  answer: Answer
}

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

    return {answer}
  }
}
