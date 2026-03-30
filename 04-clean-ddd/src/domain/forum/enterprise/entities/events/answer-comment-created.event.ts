import {UniqueEntityID} from '@/core/entities/unique-entity-id'
import {DomainEvent} from '@/core/events/domain-event'
import {Answer} from '../answer'
import {AnswerComment} from '../answer-comment'

export class AnswerCommentCreatedEvent implements DomainEvent {
  ocurredAt: Date
  public answerComment: AnswerComment

  constructor(answerComment: AnswerComment) {
    this.answerComment = answerComment
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.answerComment.id
  }
}
