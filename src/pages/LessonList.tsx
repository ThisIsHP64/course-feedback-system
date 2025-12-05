/**
 * LessonList.tsx
 * Page component that displays lesson information. Some page features will be
 * conditionally rendered depending whether the user is a student or a professor.
 */

import '@smastrom/react-rating/style.css';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

// Mock data
import data from '../mockData.json';
import type { Lesson } from '../types/types';
import WeekLessonsCard from '../components/WeekLessonsCard';

function LessonList() {
  // Obtain courseId from route params
  const params = useParams();
  const courseId = Number(params.courseId) || 1;

  // TODO: Obtain userId from session
  const currentUserId = 2;

  // Fetch from mockData
  const user = data.users.find((user) => user.id === currentUserId);
  if (!user) {
    return (
      <Container>
        <Alert variant="danger">No user</Alert>
      </Container>
    );
  }
  const course = data.courses.find((course) => course.id === courseId);
  if (!course) {
    return (
      <Container>
        <Alert variant="danger">No course</Alert>
      </Container>
    );
  }
  const professorName = data.users.find(
    (prof) => prof.id === course.professorId
  )?.name;

  // Function to separate the lessons in the course by week
  const groupLessonsByWeek = (lessons: Lesson[]) => {
    const groups: { [key: number]: Lesson[] } = {};

    lessons.forEach((lesson) => {
      if (!groups[lesson.week]) {
        groups[lesson.week] = [];
      }
      groups[lesson.week].push(lesson);
    });
    return groups;
  };

  // Filter lessons for the selected course, group them, and get available weeks
  const lessonsForCourse = data.lessons.filter((l) => l.courseId === courseId);
  const lessonsByWeek = groupLessonsByWeek(lessonsForCourse);
  const weeks = Object.keys(lessonsByWeek);

  return (
    <>
      <Row style={{ minHeight: '100vh' }} className="g-0">
        <Col xxl={2} md={3} className="qu-blue-bg text-white p-4 border-end">
          <div style={{ maxWidth: '200px' }}>
            <h5 className="mb-3 qu-yellow">
              {course.code} - {course.name}
            </h5>
            <hr className="opacity-25" />
            <p className="opacity-75 mb-4">{course.description}</p>
            <h6 className="opacity-85 mb-0">Average Grade</h6>
            <small className="opacity-75">{course.avgGrade}/100</small>
            <h6 className="opacity-85 mb-0 mt-3">Instructor</h6>
            <small className="opacity-75">{professorName}</small>
            <h6 className="opacity-85 mb-0 mt-3">Taken</h6>
            <small className="opacity-75">{course.semester}</small>
          </div>
        </Col>
        <Col className="p-4 d-flex justify-content-center">
          <Container style={{ maxWidth: '700px' }}>
            {weeks.map((weekNum) => (
              <Row key={weekNum}>
                <WeekLessonsCard
                  weekNumber={Number(weekNum)}
                  weekStart={new Date()}
                  weekEnd={new Date()}
                  lessons={lessonsByWeek[Number(weekNum)]}
                />
              </Row>
            ))}
          </Container>
        </Col>
      </Row>
    </>
  );
}

export default LessonList;
