import {Answer} from '../entities/answer'

interface AnswerQuestionUserCaseRequest {
  questionId: string
  instructorId: string
  content: string
}

export class AnswerQuestion {
  execute({instructorId, questionId, content}: AnswerQuestionUserCaseRequest) {
    const answer = new Answer(content)

    return answer
  }
}
