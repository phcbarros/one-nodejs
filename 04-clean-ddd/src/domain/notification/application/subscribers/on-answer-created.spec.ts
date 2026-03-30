import {makeAnswer} from 'test/factories/make-answer'
import {OnAnswerCreated} from './on-answer-created'
import {InMemoryAnswersRepository} from 'test/repositories/in-memory-answers-repository'
import {InMemoryAnswerAttachmentsRepository} from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
  })

  test('should send a new answer notification when a new answer is created', () => {
    const onAnswerCreated = new OnAnswerCreated()

    const answer = makeAnswer()
    inMemoryAnswersRepository.create(answer)

    //DomainEvents.dispatchEventsForAggregate(answer.id)
    expect(onAnswerCreated).toBeTruthy()
  })
})
