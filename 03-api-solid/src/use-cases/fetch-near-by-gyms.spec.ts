import {it, expect, describe, beforeEach} from 'vitest'
import {InMemoryGymsRepository} from '@/repositories/in-memory/gyms.repository'
import {Decimal} from '@prisma/client/runtime/library'
import {FetchNearbyGymsUseCase} from './fetch-near-by-gyms'

// Unit Testing

let gymsRepository: InMemoryGymsRepository

let sut: FetchNearbyGymsUseCase

describe('Fetch nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to find nearby gyms', async () => {
    gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.6401091),
    })

    gymsRepository.create({
      id: 'gym-02',
      title: 'GO Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-29.2092052),
      longitude: new Decimal(-59.6401091),
    })

    const {gyms} = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({title: 'JavaScript Gym'})])
  })

  it('should be able to find nearby gyms', async () => {
    gymsRepository.create({
      id: 'gym-01',
      title: 'Near Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.6401091),
    })

    gymsRepository.create({
      id: 'gym-02',
      title: 'Far Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-29.2092052),
      longitude: new Decimal(-59.6401091),
    })

    const {gyms} = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({title: 'Near Gym'})])
  })
})
