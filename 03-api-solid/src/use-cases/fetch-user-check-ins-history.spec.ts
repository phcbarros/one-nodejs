import {InMemoryCheckInsRepository} from '@/repositories/in-memory/check-ins.repository'
import {it, expect, describe, beforeEach} from 'vitest'
import {FetchUserCheckInsHistoryUseCase} from './fetch-user-check-ins-history'

// Unit Testing

let checkInsRepository: InMemoryCheckInsRepository

let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch Check-In History Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()

    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  })

  it('should be able to fetch user check-in history', async () => {
    await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-02',
    })

    const {checkIns} = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({gym_id: 'gym-01'}),
      expect.objectContaining({gym_id: 'gym-02'}),
    ])
  })

  it('should be able to fetch paginated user check-in history', async () => {
    Array.from({length: 22}).forEach(async (_, index) => {
      await checkInsRepository.create({
        user_id: 'user-01',
        gym_id: `gym-${index + 1}`,
      })
    })

    const {checkIns} = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({gym_id: 'gym-21'}),
      expect.objectContaining({gym_id: 'gym-22'}),
    ])
  })
})
