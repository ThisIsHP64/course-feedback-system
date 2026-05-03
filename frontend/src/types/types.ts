export interface User {
  _id: string;
  name: string;
  role: 'student' | 'professor';
}

export interface Course {
  _id: string;
  code: string;
  name: string;
  professorId: any;
  description: string;
  semester: string;
  avgGrade?: number;
}

export interface Lesson {
  _id: string;
  courseId: string;
  title: string;
  date: string;
  description: string;
}

export interface Feedback {
  _id: string;
  lessonId: string;
  studentId: string;
  rating: number;
  contentQuality: string;
  pacing: string;
  comment: string;
  createdAt: string;
}
