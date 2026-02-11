import {Question} from '@/domain/forum/enterprise/entities/question'
import {AnswersRepository} from '../repositories/answers-repository'
import {QuestionsRepository} from '../repositories/questions-repository'

export interface ChooseQuestionBestAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

export interface ChooseQuestionBestAnswerUseCaseResponse {
  question: Question
}

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
      throw new Error('Answer not found')
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) {
      throw new Error('Question not found')
    }

    // o author da resposta que decide qual foi a melhor resposta
    if (question.authorId.toString() !== authorId) {
      throw new Error('Not allowed')
    }

    question.bestAnswerId = answer.id

    await this.questionsRepository.save(question)

    return {
      question,
    }
  }
}
