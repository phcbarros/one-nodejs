import {Question} from '@/domain/forum/enterprise/entities/question'
import {QuestionRepository} from '@/domain/forum/application/repositories/questions-repository'
import {CreateQuestionUseCase} from './create-question'

const fakeQuestionRepository: QuestionRepository = {
  create: function (): Promise<void> {
    return Promise.resolve()
  },
}

test('create an question', async () => {
  const createQuestion = new CreateQuestionUseCase(fakeQuestionRepository)
  const {question} = await createQuestion.execute({
    authorId: 'author-1',
    title: 'Title',
    content: 'content',
  })

  expect(question.id).toBeTruthy()
})
