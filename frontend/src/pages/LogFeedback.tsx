/**
 * LogFeedback.tsx
 * Page component that allows student users to enter/edit feedback for lessons
 * they have attended.
 */

import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams } from 'react-router-dom';

// Mock data
import data from '../mockData.json';

const feedbackSchema = z.object({
  rating: z.number().min(1, 'Please provide a star rating').max(5),
  contentQuality: z.enum(['good', 'average', 'poor'], {
    message: 'Please select a content quality rating',
  }),
  pacing: z.enum(['good', 'slow', 'fast'], { message: 'Please select a pacing rating' }),
  comment: z.string().refine((val) => val.trim().split(/\s+/).length >= 5, {
    message: 'Please provide a comment of at least 5 words. Feedback helps improve future lessons.',
  }),
});

type FeedbackFormInputs = z.infer<typeof feedbackSchema>;

function LogFeedback() {
  const params = useParams<{ lessonId: string }>();
  const lessonId = params.lessonId ? parseInt(params.lessonId, 10) : null;

  const currentUserId = 2;

  const lesson = data.lessons.find((lesson) => lesson.id === lessonId);
  const existingFeedback = data.feedbacks.find(
    (feedback) => feedback.lessonId === lessonId && feedback.studentId === currentUserId,
  );
  const lessonCourse = data.courses.find((course) => course.id === lesson?.courseId);
  const professorName = data.users.find((prof) => prof.id === lessonCourse?.professorId)?.name;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FeedbackFormInputs>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: existingFeedback?.rating || 0,
      comment: existingFeedback?.comment || '',
    },
  });

  if (!lessonId || isNaN(lessonId)) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Invalid lesson ID provided</Alert>
      </Container>
    );
  }

  if (!lesson) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Lesson not found</Alert>
      </Container>
    );
  }

  const onSubmit = (formData: FeedbackFormInputs) => {
    console.log('Submitting feedback:', formData);
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
          <Card style={{ width: '100%', maxWidth: '600px' }} className="shadow-sm mb-auto">
            <Card.Header className="qu-blue-bg text-white">
              <h5 className="m-0">{existingFeedback ? 'Edit Feedback' : 'Log Feedback'}</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label className="qu-blue fw-bold mb-0">Overall Rating</Form.Label>
                  <Form.Text className="text-muted d-block pb-2">
                    How would you rate this lesson overall?
                  </Form.Text>
                  <div style={{ maxWidth: 300 }}>
                    <Controller
                      name="rating"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Rating value={value} onChange={onChange} style={{ maxWidth: 200 }} />
                      )}
                    />
                  </div>
                  {errors.rating && (
                    <div className="text-danger small mt-1">{errors.rating.message}</div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="qu-blue fw-bold mb-0">Content Quality</Form.Label>
                  <Form.Text className="text-muted d-block pb-2">
                    Was the lesson content clear and well-organized?
                  </Form.Text>
                  <div className="d-flex gap-3 small">
                    <div>
                      <input
                        type="radio"
                        id="contentGood"
                        value="good"
                        {...register('contentQuality')}
                      />
                      <label htmlFor="contentGood" className="ms-2">
                        Excellent
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="contentAvg"
                        value="average"
                        {...register('contentQuality')}
                      />
                      <label htmlFor="contentAvg" className="ms-2">
                        Good
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="contentPoor"
                        value="poor"
                        {...register('contentQuality')}
                      />
                      <label htmlFor="contentPoor" className="ms-2">
                        Needs Improvement
                      </label>
                    </div>
                  </div>
                  {errors.contentQuality && (
                    <div className="text-danger small mt-1">{errors.contentQuality.message}</div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="qu-blue fw-bold mb-0">Pacing</Form.Label>
                  <Form.Text className="text-muted d-block pb-2">
                    Was the lesson pace appropriate?
                  </Form.Text>
                  <div className="d-flex gap-3 small">
                    <div>
                      <input type="radio" id="pacingGood" value="good" {...register('pacing')} />
                      <label htmlFor="pacingGood" className="ms-2">
                        Just Right
                      </label>
                    </div>
                    <div>
                      <input type="radio" id="pacingSlow" value="slow" {...register('pacing')} />
                      <label htmlFor="pacingSlow" className="ms-2">
                        Too Slow
                      </label>
                    </div>
                    <div>
                      <input type="radio" id="pacingFast" value="fast" {...register('pacing')} />
                      <label htmlFor="pacingFast" className="ms-2">
                        Too Fast
                      </label>
                    </div>
                  </div>
                  {errors.pacing && (
                    <div className="text-danger small mt-1">{errors.pacing.message}</div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="qu-blue fw-bold mb-0">Detailed Feedback</Form.Label>
                  <Form.Text className="text-muted d-block pb-2">
                    What did you like about the lesson? What could be improved?
                  </Form.Text>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Share your thoughts to help improve future lessons..."
                    className="border-2"
                    isInvalid={!!errors.comment}
                    {...register('comment')}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.comment?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex gap-2 justify-content-center">
                  <Button className="qu-blue-bg border-0" type="submit" size="lg">
                    Submit Feedback
                  </Button>
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
