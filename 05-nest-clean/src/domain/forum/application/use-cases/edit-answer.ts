import {AnswersRepository} from '@/domain/forum/application/repositories/answers-repository'
import {Answer} from '@/domain/forum/enterprise/entities/answer'
import {ResourceNotFoundError} from '@/core/errors/errors/resource-not-found-error'
import {NotAllowedError} from '@/core/errors/errors/not-allowed-error'
import {Either, left, right} from '@/core/either'
import {AnswerAttachmentsRepository} from '../repositories/answer-attachments-repository'
import {AnswerAttachmentList} from '../../enterprise/entities/answer-attachment-list'
import {AnswerAttachment} from '../../enterprise/entities/answer-attachment'
import {UniqueEntityID} from '@/core/entities/unique-entity-id'

interface EditAnswerUseCaseRequest {
  answerId: string
  authorId: string
  content: string
  attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    answerId,
    authorId,
    content,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    // obtém os anexo atuais da resposta
    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

    // criar uma watched list com os anexos
    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    )

    // criar uma lista com os novos anexos
    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        answerId: answer.id,
        attachmentId: new UniqueEntityID(attachmentId),
      })
    })

    // atualiza os anexos
    answerAttachmentList.update(answerAttachments)

    answer.content = content
    answer.attachments = answerAttachmentList

    await this.answersRepository.save(answer)

    return right({
      answer,
    })
  }
}
