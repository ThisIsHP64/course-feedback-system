/**
 * LessonList.tsx
 * Page component that displays lesson information. Some page features will be
 * conditionally rendered depending whether the user is a student or a professor.
 */

import '@smastrom/react-rating/style.css';
import { Alert, Col, Container, Row } from 'react-bootstrap';

// Mock data
import data from '../mockData.json';
import type { Lesson } from '../types/types';
import WeekLessonsCard from '../components/WeekLessonsCard';

function LessonList() {
  // TODO: Obtain userId from session
  // TODO: Obtain course from route
  const currentUserId = 2;
  const courseId = 1;

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

  // Get the grouped lessons and the weeks available
  const lessonsByWeek = groupLessonsByWeek(data.lessons);
  const weeks = Object.keys(lessonsByWeek);

  return (
    <>
      <Row style={{ minHeight: '100vh' }}>
        <Col md={3} className="p-4 border-end border-dark">
          <div style={{ width: '250px' }}>
            <h5 className="mb-2">Course Information</h5>
            <p className="text-muted small">
              {course.code} - {course.name}
            </p>
            <small className="text-secondary">
              <strong>Professor</strong>
              <p>{professorName}</p>
            </small>
            <small className="text-secondary">
              <strong>Taken</strong>
              <p>{course.semester}</p>
            </small>
          </div>
        </Col>
        <Col className="p-4 d-flex justify-content-center">
          <Container style={{ maxWidth: '700px' }}>
            {weeks.map((weekNum) => (
              <Row>
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
