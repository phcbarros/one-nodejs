import {InMemoryCheckInsRepository} from '@/repositories/in-memory/check-ins.repository'
import {it, expect, describe, beforeEach, vi, afterEach} from 'vitest'
import {Decimal} from '@prisma/client/runtime/library'
import {MaxDistanceError} from './errors/max-distance-error'
import {MaxNumberOfCheckInsError} from './errors/max-number-of-check-ins-error'
import {ValidateCheckInUseCase} from './validate-check-in'
import {ResourceNotFoundError} from './errors/resource-not-found.error'

// Unit Testing

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()

    sut = new ValidateCheckInUseCase(checkInsRepository)

    // vi.useFakeTimers()
  })

  afterEach(() => {
    // vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    const {checkIn} = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date)) // qualquer data
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
