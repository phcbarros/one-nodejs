import {
  STUDENTS_REPOSITORY,
  StudentsRepository,
} from '@/domain/forum/application/repositories/students-repository'
import {Either, left, right} from '@/core/either'
import {
  HashComparer,
  HASHER_COMPARER,
} from '@/domain/forum/application/cryptography/hash-comparer'
import {Inject, Injectable} from '@nestjs/common'
import {
  ENCRYPTER,
  Encrypter,
} from '@/domain/forum/application/cryptography/encrypter'
import {WrongCredentialsError} from './errors/wrong-credentials-error'

interface AuthenticateStudentUseCaseRequest {
  email: string
  password: string
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    @Inject(STUDENTS_REPOSITORY)
    private studentsRepository: StudentsRepository,
    @Inject(HASHER_COMPARER)
    private hashComparer: HashComparer,
    @Inject(ENCRYPTER)
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email)

    if (!student) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      student.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
