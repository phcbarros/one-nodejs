import {UserAlreadyExistsError} from '@/use-cases/errors/user-already-exists.error'
import {UsersRepository} from '@/repositories/users.repository'
import {hash} from 'bcryptjs'
import {User} from '@prisma/client'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

// Dependency inversion principle

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const passwordHash = await hash(password, 6)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })

    return {user}
  }
}
