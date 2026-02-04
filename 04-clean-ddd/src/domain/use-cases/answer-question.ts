import {Answer} from '../entities/answer'
import {AnswerRepository} from '../repositories/answers-repository'

interface AnswerQuestionUserCaseRequest {
  questionId: string
  instructorId: string
  content: string
}

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
  }: AnswerQuestionUserCaseRequest) {
    const answer = new Answer({
      authorId: instructorId,
      questionId: questionId,
      content: content,
    })

    await this.answerRepository.create(answer)

    return answer
  }
}
