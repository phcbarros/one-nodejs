import {Module} from '@nestjs/common'
import {PrismaService} from './prisma/prisma.service'
import {PrismaAnswerAttachmentsRepository} from './prisma/repositories/prisma-answer-attachments.repository'
import {PrismaAnswersRepository} from './prisma/repositories/prisma-answers.repository'
import {PrismaQuestionAttachmentsRepository} from './prisma/repositories/prisma-question-attachments.repository'
import {PrismaQuestionCommentsRepository} from './prisma/repositories/prisma-question-comments.repository'
import {PrismaQuestionsRepository} from './prisma/repositories/prisma-questions.repository'
import {QuestionsRepository} from '@/domain/forum/application/repositories/questions-repository'
import {STUDENTS_REPOSITORY} from '@/domain/forum/application/repositories/students-repository'
import {PrismaStudentsRepository} from './prisma/repositories/prisma-students.repository'
import {EnvModule} from '../env/env.module'

@Module({
  imports: [EnvModule],
  providers: [
    PrismaService,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: STUDENTS_REPOSITORY,
      useClass: PrismaStudentsRepository,
    },
  ],
  exports: [
    PrismaService,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    QuestionsRepository,
    STUDENTS_REPOSITORY,
  ],
})
export class DatabaseModule {}
