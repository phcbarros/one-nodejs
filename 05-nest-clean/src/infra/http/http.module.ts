import {Module} from '@nestjs/common'
import {CryptographyModule} from '../cryptography/cryptography.module'
import {DatabaseModule} from '../database/database.module'
import {AuthenticateController} from './controllers/authenticate.controller'
import {CreateAccountController} from './controllers/create-account.controller'
import {CreateQuestionController} from './controllers/create-question.controller'
import {FetchRecentQuestionsController} from './controllers/fetch-recent-questions.controller'
import {NestCreateQuestionUseCase} from '../use-case/nest-create-question-use-case'
import {AuthenticateStudentUseCase} from '@/domain/forum/application/use-cases/authenticate-student'
import {FetchRecentQuestionsUseCase} from '@/domain/forum/application/use-cases/fetch-recent-questions'
import {RegisterStudentUseCase} from '@/domain/forum/application/use-cases/register-student'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
    NestCreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    AuthenticateStudentUseCase,
    RegisterStudentUseCase,
  ],
})
export class HttpModule {}
