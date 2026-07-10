import {InMemoryStudentsRepository} from '@/test/repositories/in-memory-students-repository'
import {RegisterStudentUseCase} from './register-student'
import {FakeHasher} from '@/test/cryptography/fake-hasher'
import {makeStudent} from '@/test/factories/make-student'

let sut: RegisterStudentUseCase
let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  test('should be able to register a new student', async () => {
    const newStudent = makeStudent({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const result = await sut.execute(newStudent)

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    })
  })

  test('should hash student password upon registration', async () => {
    const newStudent = makeStudent({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const result = await sut.execute(newStudent)
    const hashedPassword = await fakeHasher.hash(newStudent.password)

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentsRepository.items[0].password).toBe(hashedPassword)
  })
})
