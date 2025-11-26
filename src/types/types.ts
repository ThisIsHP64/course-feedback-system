// Users
export interface User {
  id: number;
  name: string;
  role: 'student' | 'professor';
}

// Course Info
export interface Course {
  id: number;
  code: string;
  name: string;
  professorId: string;
  description: string;
  semester: string;
}

// Lesson Info
export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  date: string;
  description: string;
  week: number;
}

// Feedback
export interface Feedback {
  id: number;
  lessonId: number;
  studentId: number;
  rating: number;
  comment: string;
  submittedAt: string;
}
