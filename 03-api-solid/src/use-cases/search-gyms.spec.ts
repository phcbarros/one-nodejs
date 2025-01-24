import {it, expect, describe, beforeEach} from 'vitest'
import {InMemoryGymsRepository} from '@/repositories/in-memory/gyms.repository'
import {Decimal} from '@prisma/client/runtime/library'
import {SearchGymsUseCase} from './search-gyms'

// Unit Testing

let gymsRepository: InMemoryGymsRepository

let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
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
      query: 'JavaScript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({title: 'JavaScript Gym'})])
  })

  it('should be able to fetch paginated gyms check-in history', async () => {
    Array.from({length: 22}).forEach(async (_, index) => {
      await gymsRepository.create({
        id: `gym-${index + 1}}`,
        title: `JavaScript Gym ${index + 1}`,
        description: '',
        phone: '',
        latitude: new Decimal(-27.2092052),
        longitude: new Decimal(-49.6401091),
      })
    })

    const {gyms} = await sut.execute({
      query: 'JavaScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({title: 'JavaScript Gym 21'}),
      expect.objectContaining({title: 'JavaScript Gym 22'}),
    ])
  })
})
