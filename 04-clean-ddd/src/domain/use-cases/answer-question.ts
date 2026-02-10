import {UniqueEntityID} from '@/core/entities/unique-entity-id'
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
    const answer = Answer.create({
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })

    await this.answerRepository.create(answer)

    return answer
  }
}
