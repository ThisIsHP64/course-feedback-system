/**
 * ViewFeedback.tsx
 * Page component that allows professor users to view a list of feedback for a
 * specific lesson.
 */

import { Alert, Col, Container, Row } from 'react-bootstrap';

// Mock data
import data from '../mockData.json';
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
      <Container className="mt-4">
        <Alert variant="danger">Bad user</Alert>
      </Container>
    );
  }
  const lesson = data.lessons.find((lesson) => lesson.id === lessonID);
  if (!lesson) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">No lesson</Alert>
      </Container>
    );
  }
  const lessonCourse = data.courses.find(
    (course) => course.id === lesson?.courseId
  );
  if (!lessonCourse) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">No lesson course</Alert>
      </Container>
    );
  }
  const feedbacks = data.feedbacks.filter(
    (feedback) => feedback.lessonId === lesson.id
  );

  return (
    <>
      <Row style={{ minHeight: '100vh' }} className="g-0">
        <Col xxl={2} md={3} className="qu-blue-bg text-white p-4 border-end">
          <div style={{ maxWidth: '200px' }}>
            <h5 className="mb-3 qu-yellow">
              {lessonCourse.code} - {lessonCourse.name}
            </h5>
            <hr className="opacity-25" />
            <h6 className="opacity-85 mb-3">
              Lesson {lesson.id} - {lesson.title}
            </h6>
            <small className="opacity-75">{lesson.description}</small>
          </div>
        </Col>
        <Col className="p-4 justify-content-center">
          <Container style={{ maxWidth: '700px' }}>
            {feedbacks.length === 0 ? (
              <Alert variant="info">
                No feedback submitted yet for this lesson.
              </Alert>
            ) : (
              feedbacks.map((feedback) => (
                <Row key={feedback.id}>
                  <FeedbackCard
                    comment={feedback.comment}
                    rating={feedback.rating}
                    contentQuality={feedback.contentQuality}
                    pacing={feedback.pacing}
                    date={new Date(feedback.submittedAt)}
                  />
                </Row>
              ))
            )}
          </Container>
        </Col>
      </Row>
    </>
  );
}

export default ViewFeedback;
