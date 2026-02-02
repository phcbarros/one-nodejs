import {test, expect} from 'vitest'
import {AnswerQuestion} from './answer-question'

test('create an answer', () => {
  const answerQuestion = new AnswerQuestion()
  const answer = answerQuestion.execute({
    instructorId: 'instructor-1',
    questionId: 'question-1',
    content: 'This is an answer',
  })

  expect(answer.content).toEqual('This is an answer')
})
