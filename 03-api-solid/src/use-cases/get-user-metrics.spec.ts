import {InMemoryCheckInsRepository} from '@/repositories/in-memory/check-ins.repository'
import {it, expect, describe, beforeEach} from 'vitest'
import {GetUserMetricsUseCase} from './get-user-metrics'

// Unit Testing

let checkInsRepository: InMemoryCheckInsRepository

let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()

    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: `gym-01}`,
    })

    await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: `gym-02`,
    })

    const {checkInsCount} = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toBe(2)
  })
})
