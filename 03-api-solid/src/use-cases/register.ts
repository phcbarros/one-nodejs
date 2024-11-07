import {UsersRepository} from '@/repositories/users.repository'
import {hash} from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

// Dependency inversion principle

export class RegisterUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({name, email, password}: RegisterUseCaseRequest) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new Error('User already exists.')
    }

    const passwordHash = await hash(password, 6)

    await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })
  }
}
