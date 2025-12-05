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
import { useParams } from 'react-router-dom';

function LogFeedback() {
  // Obtain lessonId from route params
  const params = useParams<{ lessonId: string }>();
  const lessonId = params.lessonId ? parseInt(params.lessonId, 10) : null;

  // TODO: Obtain userId from session
  const currentUserId = 2; // Fetch from mockData

  const lesson = data.lessons.find((lesson) => lesson.id === lessonId);
  const existingFeedback = data.feedbacks.find(
    (feedback) =>
      feedback.lessonId === lessonId && feedback.studentId === currentUserId
  );
  const lessonCourse = data.courses.find(
    (course) => course.id === lesson?.courseId
  );
  const professorName = data.users.find(
    (prof) => prof.id === lessonCourse?.professorId
  )?.name;

  // States
  const [rating, setRating] = useState(existingFeedback?.rating || 0);
  const [contentQuality, setContentQuality] = useState('');
  const [pacing, setPacing] = useState('');
  const [comment, setComment] = useState(existingFeedback?.comment || '');
  const [error, setError] = useState('');

  // Handle invalid lessonId
  if (!lessonId || isNaN(lessonId)) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Invalid lesson ID provided</Alert>
      </Container>
    );
  }

  // Handle lesson not found
  if (!lesson)
    return (
      <Container className="mt-4">
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
    if (!contentQuality) {
      setError('Please select a content quality rating');
      return;
    }
    if (!pacing) {
      setError('Please select a pacing rating');
      return;
    }
    if (comment.trim().split(' ').length < 5) {
      setError(
        'Please provide a comment of at least 5 words. Feedback helps improve future lessons.'
      );
      return;
    }

    // TODO: Update saved data
    const feedbackData = {
      rating,
      contentQuality,
      pacing,
      comment,
    };
    console.log('Submitting feedback:', feedbackData); // Log it for now
  };

  return (
    <>
      <Row style={{ minHeight: '100vh' }} className="g-0">
        <Col xxl={2} md={3} className="qu-blue-bg text-white p-4 border-end">
          <div style={{ maxWidth: '200px' }}>
            <h5 className="mb-3 qu-yellow">{lesson.title}</h5>
            <hr className="opacity-25" />
            <p className="opacity-75 mb-4">{lesson.description}</p>
            <h6 className="opacity-85 mb-3">
              Lesson: <span className="opacity-75">{lesson.courseId}</span>
            </h6>
            <h6 className="opacity-85 mb-3">
              Week: <span className="opacity-75">{lesson.week}</span>
            </h6>
            <h6 className="opacity-85 mb-0">Instructor</h6>
            <small className="opacity-75">{professorName}</small>
          </div>
        </Col>
        <Col className="p-4 d-flex justify-content-center">
          <Card
            style={{ width: '100%', maxWidth: '600px' }}
            className="shadow-sm mb-auto"
          >
            <Card.Header className="qu-blue-bg text-white">
              <h5 className="m-0">
                {existingFeedback ? 'Edit Feedback' : 'Log Feedback'}
              </h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={onSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form.Group className="mb-3">
                  <Form.Label className="qu-blue fw-bold mb-0">
                    Overall Rating
                  </Form.Label>
                  <Form.Text className="text-muted d-block pb-2">
                    How would you rate this lesson overall?
                  </Form.Text>
                  <div style={{ maxWidth: 300 }}>
                    <Rating
                      value={rating}
                      onChange={setRating}
                      isRequired
                      style={{ maxWidth: 200 }}
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="qu-blue fw-bold mb-0">
                    Content Quality
                  </Form.Label>
                  <Form.Text className="text-muted d-block pb-2">
                    Was the lesson content clear and well-organized?
                  </Form.Text>
                  <div className="d-flex gap-3 small">
                    <div>
                      <input
                        type="radio"
                        name="content"
                        id="contentGood"
                        value="good"
                        checked={contentQuality === 'good'}
                        onChange={(e) => setContentQuality(e.target.value)}
                      />
                      <label htmlFor="contentGood" className="ms-2">
                        Excellent
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="content"
                        id="contentAvg"
                        value="average"
                        checked={contentQuality === 'average'}
                        onChange={(e) => setContentQuality(e.target.value)}
                      />
                      <label htmlFor="contentAvg" className="ms-2">
                        Good
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="content"
                        id="contentPoor"
                        value="poor"
                        checked={contentQuality === 'poor'}
                        onChange={(e) => setContentQuality(e.target.value)}
                      />
                      <label htmlFor="contentPoor" className="ms-2">
                        Needs Improvement
                      </label>
                    </div>
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="qu-blue fw-bold mb-0">
                    Pacing
                  </Form.Label>
                  <Form.Text className="text-muted d-block pb-2">
                    Was the lesson pace appropriate?
                  </Form.Text>
                  <div className="d-flex gap-3 small">
                    <div>
                      <input
                        type="radio"
                        name="pacing"
                        id="pacingGood"
                        value="good"
                        checked={pacing === 'good'}
                        onChange={(e) => setPacing(e.target.value)}
                      />
                      <label htmlFor="pacingGood" className="ms-2">
                        Just Right
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="pacing"
                        id="pacingSlow"
                        value="slow"
                        checked={pacing === 'slow'}
                        onChange={(e) => setPacing(e.target.value)}
                      />
                      <label htmlFor="pacingSlow" className="ms-2">
                        Too Slow
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="pacing"
                        id="pacingFast"
                        value="fast"
                        checked={pacing === 'fast'}
                        onChange={(e) => setPacing(e.target.value)}
                      />
                      <label htmlFor="pacingFast" className="ms-2">
                        Too Fast
                      </label>
                    </div>
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="qu-blue fw-bold mb-0">
                    Detailed Feedback
                  </Form.Label>
                  <Form.Text className="text-muted d-block pb-2">
                    What did you like about the lesson? What could be improved?
                  </Form.Text>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Share your thoughts to help improve future lessons..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border-2"
                  />
                </Form.Group>
                <div className="d-flex gap-2 justify-content-center">
                  <Button
                    className="qu-blue-bg border-0"
                    type="submit"
                    size="lg"
                  >
                    Submit Feedback
                  </Button>
                  {/* TODO: Cancel button navigate back to */}
                  <Button variant="outline-secondary" size="lg">
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
