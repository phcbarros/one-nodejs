import {Student} from '@/domain/forum/enterprise/entities/student'

export const STUDENT_REPOSITORY = Symbol('STUDENT_REPOSITORY')

export interface StudentsRepository {
  findByEmail(email: string): Promise<Student | null>
  create(student: Student): Promise<void>
}
