import {Body, Controller, Post, UseGuards} from '@nestjs/common'
import {JwtAuthGuard} from '@/infra/auth/jwt.auth.guard'
import {CurrentUser} from '@/infra/auth/current-user.decorator'
import {UserPayload} from '@/infra/auth/jwt.strategy'
import {z} from 'zod'
import {ZodValidationPipe} from '@/infra/http/pipes/zod-validation.pipe'
import {NestCreateQuestionUseCase} from '@/infra/use-case/nest-create-question-use-case'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private createQuestion: NestCreateQuestionUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const {title, content} = body
    const {sub: userId} = user

    await this.createQuestion.execute({
      authorId: userId,
      title,
      content,
      attachmentsIds: [],
    })
  }
}
