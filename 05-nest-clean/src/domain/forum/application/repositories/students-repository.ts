import {Student} from '@/domain/forum/enterprise/entities/student'

export const STUDENTS_REPOSITORY = Symbol('STUDENTS_REPOSITORY')

export interface StudentsRepository {
  findByEmail(email: string): Promise<Student | null>
  create(student: Student): Promise<void>
}
