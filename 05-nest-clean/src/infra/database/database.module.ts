import {Module} from '@nestjs/common'
import {PrismaService} from './prisma/prisma.service'
import {PrismaAnswerAttachmentsRepository} from './prisma/repositories/prisma-answer-attachments.repository'
import {PrismaAnswersRepository} from './prisma/repositories/prisma-answers.repository'
import {PrismaQuestionAttachmentsRepository} from './prisma/repositories/prisma-question-attachments.repository'
import {PrismaQuestionCommentsRepository} from './prisma/repositories/prisma-question-comments.repository'
import {PrismaQuestionsRepository} from './prisma/repositories/prisma-questions.repository'

@Module({
  providers: [
    PrismaService,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionsRepository,
  ],
  exports: [
    PrismaService,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionsRepository,
  ],
})
export class DatabaseModule {}
