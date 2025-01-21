import {it, expect, describe, beforeEach} from 'vitest'
import {InMemoryCheckInsRepository} from '@/repositories/in-memory/check-ins.repository'
import {CheckInUseCase} from './check-in'

// Unit Testing

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('CheckInUseCase', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)
  })

  it('should be able to check in', async () => {
    const {checkIn} = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    expect(checkIn.id).toEqual(expect.any(String)) // qualquer string
  })
})
