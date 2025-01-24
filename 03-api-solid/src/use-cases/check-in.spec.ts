import {InMemoryCheckInsRepository} from '@/repositories/in-memory/check-ins.repository'
import {it, expect, describe, beforeEach, vi, afterEach} from 'vitest'
import {CheckInUseCase} from './check-in'
import {InMemoryGymsRepository} from '@/repositories/in-memory/gyms.repository'
import {Decimal} from '@prisma/client/runtime/library'
import {MaxDistanceError} from './errors/max-distance-error'
import {MaxNumberOfCheckInsError} from './errors/max-number-of-check-ins-error'

// Unit Testing

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()

    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.6401091),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const {checkIn} = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(checkIn.id).toEqual(expect.any(String)) // qualquer string
  })

  it('should not able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 22, 8, 0, 0)) // 22/01/2024 08:00:00
    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2024, 0, 22, 8, 0, 0)) // 22/01/2024 08:00:00
    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    vi.setSystemTime(new Date(2024, 0, 23, 8, 0, 0)) // 23/01/2024 08:00:00
    const {checkIn} = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(checkIn.id).toEqual(expect.any(String)) // qualquer string
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-23.5667456),
      longitude: new Decimal(-46.3208448),
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-02',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })

  it('should be able to check in on near gym', async () => {
    const {checkIn} = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(checkIn.id).toEqual(expect.any(String)) // qualquer string
  })
})
