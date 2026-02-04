import {test, expect} from 'vitest'
import {AnswerQuestionUseCase} from './answer-question'
import {AnswerRepository} from '../repositories/answers-repository'
import {Answer} from '../entities/answer'

const fakeAnswerRepository: AnswerRepository = {
  create: function (answer: Answer): Promise<void> {
    return
  },
}

test('create an answer', async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeAnswerRepository)
  const answer = await answerQuestion.execute({
    instructorId: 'instructor-1',
    questionId: 'question-1',
    content: 'This is an answer',
  })

  expect(answer.content).toEqual('This is an answer')
})
