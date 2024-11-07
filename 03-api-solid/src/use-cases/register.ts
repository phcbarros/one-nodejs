import {prisma} from '@/lib/prisma'
import {PrismaUsersRepository} from '@/repositories/prisma-users.repository'
import {hash} from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export async function registerUseCase({
  name,
  email,
  password,
}: RegisterUseCaseRequest) {
  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    throw new Error('User already exists.')
  }

  const passwordHash = await hash(password, 6)
  const prismaUserRepository = new PrismaUsersRepository()

  await prismaUserRepository.create({
    name,
    email,
    password_hash: passwordHash,
  })
}
