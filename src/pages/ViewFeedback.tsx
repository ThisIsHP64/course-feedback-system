/**
 * ViewFeedback.tsx
 * Page component that allows professor users to view a list of feedback for a
 * specific lesson.
 */

import { Alert, Col, Container, Row } from 'react-bootstrap';

// Mock data
import data from '../mockData.json';
import type { Lesson } from '../types/types';
import WeekLessonsCard from '../components/WeekLessonsCard';
import FeedbackCard from '../components/FeedbackCard';

function ViewFeedback() {
  // TODO: Obtain userId from session
  // TODO: Obtain lesson from route
  const currentUserId = 1;
  const lessonID = 1;

  // Fetch from mockData
  const user = data.users.find((user) => user.id === currentUserId);
  if (!user || user.role != 'professor') {
    return (
      <Container>
        <Alert variant="danger">Bad user</Alert>
      </Container>
    );
  }
  const lesson = data.lessons.find((lesson) => lesson.id === lessonID);
  if (!lesson) {
    return (
      <Container>
        <Alert variant="danger">No lesson</Alert>
      </Container>
    );
  }
  const lessonCourse = data.courses.find(
    (course) => course.id === lesson?.courseId
  );
  if (!lessonCourse) {
    return (
      <Container>
        <Alert variant="danger">No lesson course</Alert>
      </Container>
    );
  }
  const feedbacks = data.feedbacks.filter(
    (feedback) => feedback.lessonId === lesson.id
  );

  return (
    <>
      <Row style={{ minHeight: '100vh' }}>
        <Col md={3} className="p-4 border-end border-dark">
          <div style={{ maxWidth: '200px' }}>
            <h5 className="mb-2">
              {lessonCourse.code} - {lessonCourse.name}
            </h5>
            <h6 className="text-muted">
              Lesson {lesson.week} - {lesson.title}
            </h6>
          </div>
        </Col>
        <Col className="p-4 d-flex justify-content-center">
          <Container style={{ maxWidth: '700px' }}>
            {feedbacks.map((feedback) => (
              <Row>
                <FeedbackCard
                  comment={feedback.comment}
                  rating={feedback.rating}
                  date={new Date(feedback.submittedAt)}
                />
              </Row>
            ))}
          </Container>
        </Col>
      </Row>
    </>
  );
}

export default ViewFeedback;
