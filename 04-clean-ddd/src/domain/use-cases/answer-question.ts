import {Answer} from '../entities/answer'

interface AnswerQuestionUserCaseRequest {
  questionId: string
  instructorId: string
  content: string
}

export class AnswerQuestion {
  execute({instructorId, questionId, content}: AnswerQuestionUserCaseRequest) {
    const answer = new Answer({
      authorId: instructorId,
      questionId: questionId,
      content: content,
    })

    return answer
  }
}
