import {AnswerQuestionUseCase} from './answer-question'
import {AnswerRepository} from '@/domain/forum/application/repositories/answers-repository'

const fakeAnswerRepository: AnswerRepository = {
  create: function (): Promise<void> {
    return Promise.resolve()
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
