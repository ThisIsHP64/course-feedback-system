import { useEffect, useState } from 'react';
import '@smastrom/react-rating/style.css';
import { Alert, Col, Container, Row, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { Course, Lesson } from '../types/types';
import ProfessorLessonsCard from '../components/ProfessorLessonsCard';

function ProfessorLessonList() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const headers = { Authorization: `Bearer ${token}` };

        const [courseRes, lessonsRes] = await Promise.all([
          axios.get(`/api/courses/${courseId}`, { headers }),
          axios.get(`/api/lessons?courseId=${courseId}`, { headers }),
        ]);

        setCourse(courseRes.data);
        setLessons(lessonsRes.data);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container className="mt-4">
        <p>Loading...</p>
      </Container>
    );
  }

  const professorName = course.professorId?.name || 'Instructor';

  const groupLessonsByWeek = (lessonsList: Lesson[]) => {
    const groups: { [key: number]: Lesson[] } = {};
    if (lessonsList.length === 0) return groups;

    const sortedLessons = [...lessonsList].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const startDate = new Date(sortedLessons[0].date);

    sortedLessons.forEach((lesson) => {
      const lessonDate = new Date(lesson.date);
      const diffInMs = lessonDate.getTime() - startDate.getTime();
      const weekNum = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7)) + 1;

      if (!groups[weekNum]) {
        groups[weekNum] = [];
      }
      groups[weekNum].push(lesson);
    });
    return groups;
  };

  const lessonsByWeek = groupLessonsByWeek(lessons);
  const weeks = Object.keys(lessonsByWeek)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <Row style={{ minHeight: '100vh' }}>
      <Col md={3} className="p-4 border-end border-dark">
        <div style={{ maxWidth: '200px' }}>
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
          <Button
            variant="outline-secondary"
            size="sm"
            className="mt-3"
            onClick={() => navigate(`/professor/course/${course._id}/download`)}
          >
            Download Feedback
          </Button>
        </div>
      </Col>
      <Col className="p-4 d-flex justify-content-center">
        <Container style={{ maxWidth: '700px' }}>
          {lessons.length === 0 && <Alert variant="info">No lessons found.</Alert>}
          {weeks.map((weekNum) => {
            const weekLessons = lessonsByWeek[weekNum];
            const weekStart = new Date(weekLessons[0].date);
            const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);

            return (
              <Row key={weekNum}>
                <ProfessorLessonsCard
                  weekNumber={weekNum}
                  weekStart={weekStart}
                  weekEnd={weekEnd}
                  lessons={weekLessons}
                />
              </Row>
            );
          })}
        </Container>
      </Col>
    </Row>
  );
}

export default ProfessorLessonList;
