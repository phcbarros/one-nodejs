import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {PrismaService} from '@/infra/database/prisma/prisma.service'
import {
  ENCRYPTER,
  Encrypter,
} from '@/domain/forum/application/cryptography/encrypter'
import {BcryptHasher} from '@/infra/cryptography/bcrypt-hasher'
import {HASHER_COMPARER} from '@/domain/forum/application/cryptography/hash-comparer'
import {z} from 'zod'
import {ZodValidationPipe} from '../pipes/zod-validation.pipe'
import {AuthenticateStudentUseCase} from '@/domain/forum/application/use-cases/authenticate-student'
import {WrongCredentialsError} from '@/domain/forum/application/use-cases/errors/wrong-credentials-error'

const authenticateBodySchema = z.object({
  email: z.string(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const {email, password} = body

    const result = await this.authenticateStudent.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const accessToken = result.value.accessToken

    return {
      access_token: accessToken,
    }
  }
}
