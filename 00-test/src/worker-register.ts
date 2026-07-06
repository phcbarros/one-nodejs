import {WorkerRegisterInterface} from './worker-register-interface'

interface WorkerProps {
  workerId: string
  compensation: number
  role: string
}

interface WorkerRegisteredProps {
  workerId: string
  timestamp: number
  operation: 'enter' | 'exit'
}

export class WorkerRegister implements WorkerRegisterInterface {
  private workers: Map<string, WorkerProps> = new Map()
  private workersRegisteredTimeSheet: Map<string, WorkerRegisteredProps[]> =
    new Map()

  add(workerId: string, compensation: number, role: string): boolean {
    if (this.hasWorker(workerId)) {
      return false
    }

    this.workers.set(workerId, {
      workerId,
      compensation,
      role,
    })
    this.workersRegisteredTimeSheet.set(workerId, [])

    return true
  }
  register(workerId: string, timestamp: number): string {
    if (!this.hasWorker(workerId)) {
      return 'invalid_request'
    }

    const timeSheet = this.workersRegisteredTimeSheet.get(workerId)

    if (timeSheet?.length % 2 === 0) {
      timeSheet?.push({
        workerId,
        timestamp,
        operation: 'enter',
      })

      return 'registered'
    }

    timeSheet?.push({
      workerId,
      timestamp,
      operation: 'exit',
    })

    return 'registered'
  }
  get(workerId: string): number | null {
    if (!this.hasWorker(workerId)) {
      return null
    }

    const timeSheet = this.workersRegisteredTimeSheet.get(workerId)
    console.log('timeSheet', timeSheet)

    if (!timeSheet) {
      return null
    }

    let total = 0

    const enterTimeSheet = timeSheet.filter(
      (item) => item.operation === 'enter',
    )
    const exitTimeSheet = timeSheet.filter((item) => item.operation === 'exit')

    for (let i = 0; i < enterTimeSheet.length; i++) {
      const enter = enterTimeSheet[i]
      const exit = exitTimeSheet[i]

      if (!exit) {
        break
      }
      const difference = exit.timestamp - enter.timestamp
      total += difference
    }

    return total
  }

  private hasWorker(workerId: string): boolean {
    return this.workers.has(workerId)
  }
}
