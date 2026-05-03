import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<any>(null);
  const [existingFeedbackId, setExistingFeedbackId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userStr = localStorage.getItem('auth_user');
  const user = userStr ? JSON.parse(userStr) : null;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormInputs>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const headers = { Authorization: `Bearer ${token}` };

        const lessonRes = await axios.get(`/api/lessons/${lessonId}`, { headers });
        setLesson(lessonRes.data);

        const feedbackRes = await axios.get(
          `/api/feedbacks?lessonId=${lessonId}&studentId=${user.id}`,
          { headers },
        );

        if (feedbackRes.data && feedbackRes.data.length > 0) {
          const feedback = feedbackRes.data[0];
          setExistingFeedbackId(feedback._id);
          reset({
            rating: feedback.rating,
            contentQuality: feedback.contentQuality,
            pacing: feedback.pacing,
            comment: feedback.comment,
          });
        }
      } catch (err) {
        setError('Failed to load lesson or feedback data');
      }
    };

    // FIX: Depend on user?.id instead of the entire user object
    if (lessonId && user?.id) {
      fetchData();
    }
  }, [lessonId, user?.id, reset]);

  if (!lessonId) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Invalid lesson ID provided</Alert>
      </Container>
    );
  }

  const onSubmit = async (formData: FeedbackFormInputs) => {
    try {
      const token = localStorage.getItem('auth_token');
      const payload = { ...formData, lessonId };
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (existingFeedbackId) {
        await axios.put(`/api/feedbacks/${existingFeedbackId}`, payload, config);
      } else {
        await axios.post('/api/feedbacks', payload, config);
      }
      navigate('/courses');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    }
  };

  if (!lesson) {
    return (
      <Container>
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <>
      <Row style={{ minHeight: '100vh' }} className="g-0">
        <Col xxl={2} md={3} className="qu-blue-bg text-white p-4 border-end">
          <div style={{ maxWidth: '200px' }}>
            <h5 className="mb-3 qu-yellow">{lesson.title}</h5>
            <hr className="opacity-25" />
            <p className="opacity-75 mb-4">{lesson.description}</p>
          </div>
        </Col>
        <Col className="p-4 d-flex justify-content-center">
          <Card style={{ width: '100%', maxWidth: '600px' }} className="shadow-sm mb-auto">
            <Card.Header className="qu-blue-bg text-white">
              <h5 className="m-0">{existingFeedbackId ? 'Edit Feedback' : 'Log Feedback'}</h5>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
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
                  <Form.Control
                    as="textarea"
                    rows={4}
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
                  <Button
                    variant="outline-secondary"
                    size="lg"
                    onClick={() => navigate('/courses')}
                  >
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
