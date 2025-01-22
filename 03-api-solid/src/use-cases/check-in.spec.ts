import {it, expect, describe, beforeEach, vi, afterEach} from 'vitest'
import {InMemoryCheckInsRepository} from '@/repositories/in-memory/check-ins.repository'
import {CheckInUseCase} from './check-in'

// Unit Testing

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('CheckInUseCase', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const {checkIn} = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    expect(checkIn.id).toEqual(expect.any(String)) // qualquer string
  })

  it('should not able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 22, 8, 0, 0)) // 22/01/2024 08:00:00
    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2024, 0, 22, 8, 0, 0)) // 22/01/2024 08:00:00
    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    vi.setSystemTime(new Date(2024, 0, 23, 8, 0, 0)) // 22/01/2024 08:00:00
    const {checkIn} = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    expect(checkIn.id).toEqual(expect.any(String)) // qualquer string
  })
})
