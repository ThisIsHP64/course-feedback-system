import { useEffect, useState } from 'react';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import FeedbackCard from '../components/FeedbackCard';

function ViewFeedback() {
  const { lessonId } = useParams();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [lesson, setLesson] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const userStr = localStorage.getItem('auth_user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const headers = { Authorization: `Bearer ${token}` };

        const [lessonRes, feedbackRes] = await Promise.all([
          axios.get(`/api/lessons/${lessonId}`, { headers }),
          axios.get(`/api/feedbacks?lessonId=${lessonId}`, { headers }),
        ]);

        setLesson(lessonRes.data);
        setFeedbacks(feedbackRes.data);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };

    if (lessonId && user?.role === 'professor') {
      fetchData();
    } else if (user?.role !== 'professor') {
      setError('Unauthorized');
    }
  }, [lessonId, user]);

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

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
            <h5 className="mb-3 qu-yellow">
              {lesson.courseId.code} - {lesson.courseId.name}
            </h5>
            <hr className="opacity-25" />
            <h6 className="opacity-85 mb-3">{lesson.title}</h6>
            <small className="opacity-75">{lesson.description}</small>
          </div>
        </Col>
        <Col className="p-4 justify-content-center">
          <Container style={{ maxWidth: '700px' }}>
            {feedbacks.length === 0 ? (
              <Alert variant="info">No feedback submitted yet for this lesson.</Alert>
            ) : (
              feedbacks.map((feedback) => (
                <Row key={feedback._id}>
                  <FeedbackCard
                    comment={feedback.comment}
                    rating={feedback.rating}
                    contentQuality={feedback.contentQuality}
                    pacing={feedback.pacing}
                    date={new Date(feedback.createdAt)}
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
