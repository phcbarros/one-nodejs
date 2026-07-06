import {WorkerRegister} from './worker-register'

describe('WorkerRegister', () => {
  let workerRegister: WorkerRegister

  beforeEach(() => {
    workerRegister = new WorkerRegister()
  })

  it('sandbox', () => {
    expect(workerRegister.add('worker-1', 100, 'manager')).toBe(true)
    expect(workerRegister.add('worker-1', 100, 'senior')).toBe(false)
    expect(workerRegister.register('worker-1', 10)).toBe('registered')
    expect(workerRegister.register('worker-1', 25)).toBe('registered')
    expect(workerRegister.register('worker-2', 25)).toBe('invalid_request')
    expect(workerRegister.get('worker-1')).toBe(15)

    expect(workerRegister.register('worker-1', 10)).toBe('registered')
    expect(workerRegister.register('worker-1', 25)).toBe('registered')
    expect(workerRegister.get('worker-1')).toBe(30)
    expect(workerRegister.register('worker-1', 10)).toBe('registered')
    expect(workerRegister.get('worker-1')).toBe(30)

    expect(workerRegister.get('worker-2')).toBe(null)
  })
})
