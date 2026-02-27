import {Either, left, right} from '@/core/either'
import {QuestionsRepository} from '@/domain/forum/application/repositories/questions-repository'
import {Question} from '@/domain/forum/enterprise/entities/question'
import {ResourceNotFoundError} from './errors/resource-not-found-error'
import {NotAllowedError} from './errors/not-allowed-error'
import {QuestionAttachmentsRepository} from '../repositories/question-attachments-repository'
import {QuestionAttachment} from '../../enterprise/entities/question-attachment'
import {UniqueEntityID} from '@/core/entities/unique-entity-id'
import {QuestionAttachmentList} from '../../enterprise/entities/question-attachment-list'

interface EditQuestionUseCaseRequest {
  questionId: string
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionsAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    questionId,
    authorId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    // obtém os anexo atuais da pergunta
    const currentQuestionAttachments =
      await this.questionsAttachmentsRepository.findManyByQuestionId(questionId)

    // criar uma watched list com os anexos
    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    )

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      })
    })

    // atualiza os anexos
    questionAttachmentList.update(questionAttachments)

    question.title = title
    question.content = content
    question.attachments = questionAttachmentList

    await this.questionsRepository.save(question)

    return right({
      question,
    })
  }
}
