/**
 * LogFeedback.tsx
 * Page component that allows student users to enter/edit feedback for lessons
 * they have attended.
 */

import { useState } from 'react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from 'react-bootstrap';

// Mock data
import data from '../mockData.json';

function LogFeedback() {
  // TODO: Obtain lessonID from route
  // TODO: Obtain userId from session
  const lessonID = 1;
  const currentUserId = 2;

  // Fetch from mockData
  const lesson = data.lessons.find((lesson) => lesson.id === lessonID);
  const existingFeedback = data.feedbacks.find(
    (feedback) =>
      feedback.lessonId === lessonID && feedback.studentId === currentUserId
  );
  const lessonCourse = data.courses.find(
    (course) => course.id === lesson?.courseId
  );
  const professor = data.users.find(
    (prof) => prof.id === lessonCourse?.professorId
  )?.name;

  // States
  const [rating, setRating] = useState(existingFeedback?.rating || 0);
  const [comment, setComment] = useState(existingFeedback?.comment || '');
  const [error, setError] = useState('');

  // Handle lesson not found
  //TODO: back navigation
  if (!lesson)
    return (
      <Container>
        <Alert variant="danger">Lesson not found</Alert>
      </Container>
    );

  // Handle submission and validation
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please provide a star rating');
      return;
    }
    if (comment.trim().split(' ').length < 5) {
      setError(
        'Please provide a comment of at least 5 words. Feedback helps improve future lessons.'
      );
      return;
    }

    // TODO: Update saved data
    console.log(`Updating feedback: ${comment}`); // Log it for now
  };

  return (
    <>
      <Row style={{ minHeight: '100vh' }}>
        <Col md={3} className="p-4 border-end border-dark">
          <div style={{ width: '250px' }}>
            <h5 className="mb-3">{lesson.title}</h5>
            <p className="text-muted small">{lesson.description}</p>
            <small className="text-secondary">
              <strong>Professor</strong>
              <p>{professor}</p>
            </small>
            <small className="text-secondary">
              <strong>Week {lesson.week}</strong>
              <p>{new Date(lesson.date).toLocaleDateString()}</p>
            </small>
          </div>
        </Col>
        <Col className="p-4 d-flex justify-content-center">
          <Card
            style={{ width: '100%', maxWidth: '600px' }}
            className="shadow-sm mb-auto"
          >
            <Card.Header className="bg-primary text-white">
              <h5>{existingFeedback ? 'Edit Feedback' : 'Log Feedback'}</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={onSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form.Group className="mb-4">
                  <Form.Label>Rating</Form.Label>
                  <Form.Text className="text-muted d-block">
                    Rate this lesson 1-5 stars.
                  </Form.Text>
                  <div style={{ maxWidth: 300 }}>
                    <Rating value={rating} onChange={setRating} isRequired />
                  </div>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Feedback</Form.Label>
                  <Form.Text className="text-muted d-block">
                    Explain your thoughts on the lesson
                  </Form.Text>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="How did you like the lesson? How would you improve it?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </Form.Group>
                <div className="d-flex gap-2 justify-content-center">
                  <Button variant="primary" type="submit" size="lg">
                    Submit
                  </Button>
                  {/* TODO: Cancel button navigate back */}
                  <Button variant="secondary" size="lg">
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default LogFeedback;
