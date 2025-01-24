import {InMemoryCheckInsRepository} from '@/repositories/in-memory/check-ins.repository'
import {it, expect, describe, beforeEach, vi, afterEach} from 'vitest'
import {Decimal} from '@prisma/client/runtime/library'
import {MaxDistanceError} from './errors/max-distance-error'
import {MaxNumberOfCheckInsError} from './errors/max-number-of-check-ins-error'
import {ValidateCheckInUseCase} from './validate-check-in'
import {ResourceNotFoundError} from './errors/resource-not-found.error'
import {LateCheckInValidationError} from './errors/late-check-in-validation.error'

// Unit Testing

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()

    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
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

  it('should be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2025, 0, 24, 13, 40, 0))

    const createdCheckIn = await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    // vi.setSystemTime(new Date(2025, 0, 24, 14, 55, 0))
    const TWENTY_ONE_MINUTES_IN_MS = 1000 * 60 * 21
    vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MS)

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
