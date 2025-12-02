import '@smastrom/react-rating/style.css';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

// Mock data
import data from '../mockData.json';
import type { Lesson } from '../types/types';
import ProfessorLessonsCard from '../components/ProfessorLessonsCard';

function ProfessorLessonList() {
  // TODO: Obtain userId from session
  // Obtain courseId from route params
  const currentUserId = 2;
  const params = useParams();
  const courseId = Number(params.courseId) || 1;
  const navigate = useNavigate();

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
      <Row style={{ minHeight: '100vh' }}>
        <Col md={3} className="p-4 border-end border-dark">
          <div style={{ maxWidth: '200px' }}>
            <h5 className="mb-2">Course Information</h5>
            <p className="text-muted small">
              {course.code} - {course.name}
            </p>
            <small className="text-secondary">
              <strong>Average Grade</strong>
              <p>{course.avgGrade}/100</p>
            </small>
            <small className="text-secondary">
              <strong>Professor</strong>
              <p>{professorName}</p>
            </small>
            <small className="text-secondary">
              <strong>Taken</strong>
              <p>{course.semester}</p>
            </small>
            <button
              className="btn btn-outline-secondary btn-sm mt-3"
              onClick={() =>
                navigate(`/professor/course/${course.id}/download`)
              }
            >
              Download Feedback
            </button>
          </div>
        </Col>
        <Col className="p-4 d-flex justify-content-center">
          <Container style={{ maxWidth: '700px' }}>
            {weeks.map((weekNum) => (
              <Row>
                <ProfessorLessonsCard
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

export default ProfessorLessonList;
