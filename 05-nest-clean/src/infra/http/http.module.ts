import {Module} from '@nestjs/common'
import {AuthenticateController} from './controllers/authenticate.controller'
import {CreateAccountController} from './controllers/create-account.controller'
import {CreateQuestionController} from './controllers/create-question.controller'
import {FetchRecentQuestionsController} from './controllers/fetch-recent-questions.controller'
import {DatabaseModule} from '../database/database.module'
import {NestCreateQuestionUseCase} from '../use-case/nest-create-question-use-case'
import {FetchRecentQuestionsUseCase} from '@/domain/forum/application/use-cases/fetch-recent-questions'
import {CryptographyModule} from '../cryptography/cryptography.module'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [NestCreateQuestionUseCase, FetchRecentQuestionsUseCase],
})
export class HttpModuleModule {}
