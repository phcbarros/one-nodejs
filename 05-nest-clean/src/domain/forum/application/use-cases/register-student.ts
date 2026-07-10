import {Student} from '@/domain/forum/enterprise/entities/student'
import {
  STUDENTS_REPOSITORY,
  StudentsRepository,
} from '@/domain/forum/application/repositories/students-repository'
import {Either, left, right} from '@/core/either'
import {
  HASHER_GENERATOR,
  HashGenerator,
} from '@/domain/forum/application/cryptography/hash-generator'
import {Inject, Injectable} from '@nestjs/common'
import {StudentAlreadyExistsError} from './errors/student-already-exists-error'

interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student
  }
>

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    @Inject(STUDENTS_REPOSITORY)
    private studentsRepository: StudentsRepository,
    @Inject(HASHER_GENERATOR)
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const userWithSameEmail = await this.studentsRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new StudentAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const student = Student.create({
      email,
      name,
      password: hashedPassword,
    })

    await this.studentsRepository.create(student)

    return right({
      student,
    })
  }
}
