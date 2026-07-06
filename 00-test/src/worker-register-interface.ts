export interface WorkerRegisterInterface {
  add(workerId: string, compensation: number, role: string): boolean
  register(workerId: string, timestamp: number): string
  get(workerId: string): number | null
}
