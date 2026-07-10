import {InMemoryStudentsRepository} from '@/test/repositories/in-memory-students-repository'
import {AuthenticateStudentUseCase} from './authenticate-student'
import {FakeHasher} from '@/test/cryptography/fake-hasher'
import {makeStudent} from '@/test/factories/make-student'
import {FakeEncrypter} from '@/test/cryptography/faker-encrypter'

let sut: AuthenticateStudentUseCase
let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

describe('Authenticate Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  test('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    await inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
