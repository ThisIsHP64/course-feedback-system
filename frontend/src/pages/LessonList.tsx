import { useEffect, useState } from 'react';
import '@smastrom/react-rating/style.css';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import type { Course, Lesson } from '../types/types';
import WeekLessonsCard from '../components/WeekLessonsCard';

function LessonList() {
  const { courseId } = useParams();
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
    <Row style={{ minHeight: '100vh' }} className="g-0">
      <Col xxl={2} md={3} className="qu-blue-bg text-white p-4 border-end">
        <div style={{ maxWidth: '200px' }}>
          <h5 className="mb-3 qu-yellow">
            {course.code} - {course.name}
          </h5>
          <hr className="opacity-25" />
          <p className="opacity-75 mb-4">{course.description}</p>
          <h6 className="opacity-85 mb-0 mt-3">Instructor</h6>
          <small className="opacity-75">{professorName}</small>
          <h6 className="opacity-85 mb-0 mt-3">Taken</h6>
          <small className="opacity-75">{course.semester}</small>
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
                <WeekLessonsCard
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

export default LessonList;
