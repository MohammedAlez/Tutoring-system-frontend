// Response structure for GET /api/shedules/teacher/me
export interface TeacherScheduleItem {
  id: string
  teachingAssignmentId: string
  dayOfWeek: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY"
  startTime: string // "HH:mm"
  endTime: string   // "HH:mm"
  room: string
  subject: {
    id: string
    name: string
  }
  class: {
    id: string
    name: string
  }
}

export interface TeacherSchedulesResponse {
  data: TeacherScheduleItem[]
}

// Response structure for GET /api/teachers/classes
export interface TeacherClassItem {
  id: string
  name: string
  description?: string
  studentsCount: number
  subjects: Array<{
    id: string
    name: string
    teachingAssignmentId: string
  }>
}

export interface TeacherClassesResponse {
  data: TeacherClassItem[]
}