/**
 * FeedbackCard.tsx
 * Card component to display lesson feedback and star rating
 */

import { Card, Badge, Row, Col, Stack } from 'react-bootstrap';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

type CardProps = {
  comment: string;
  rating: number;
  contentQuality: string;
  pacing: string;
  date: Date;
};

function FeedbackCard({
  comment,
  rating,
  contentQuality,
  pacing,
  date,
}: CardProps) {
  const getQualityVariant = (quality: string) => {
    const variants: { [key: string]: string } = {
      good: 'primary',
      average: 'warning',
      poor: 'danger',
    };
    return variants[quality] || 'secondary';
  };

  const getPacingVariant = (pace: string) => {
    const variants: { [key: string]: string } = {
      good: 'primary',
      slow: 'warning',
      fast: 'danger',
    };
    return variants[pace] || 'secondary';
  };

  return (
    <Card className="mb-3 shadow-sm p-0">
      <Card.Body>
        <Card.Title className="qu-blue mb-3">Student Feedback</Card.Title>

        <Stack gap={3}>
          <Row className="g-4">
            <Col xs="auto">
              <Stack gap={1}>
                <small className="text-muted">
                  <strong>Content Quality</strong>
                </small>
                <Badge bg={getQualityVariant(contentQuality)}>
                  {contentQuality.charAt(0).toUpperCase() +
                    contentQuality.slice(1)}
                </Badge>
              </Stack>
            </Col>
            <Col xs="auto">
              <Stack gap={1}>
                <small className="text-muted">
                  <strong>Pacing</strong>
                </small>
                <Badge bg={getPacingVariant(pacing)}>
                  {pacing.charAt(0).toUpperCase() + pacing.slice(1)}
                </Badge>
              </Stack>
            </Col>
          </Row>
          <Stack gap={2}>
            <div>
              <small className="text-muted d-block mb-2">
                <strong>Overall Rating</strong>
              </small>
              <div style={{ maxWidth: 160 }}>
                <Rating value={rating} readOnly />
              </div>
            </div>
          </Stack>
          <Stack gap={2}>
            <small className="text-muted">
              <strong>Comments</strong>
            </small>
            <Card.Text className="text-dark">{comment}</Card.Text>
          </Stack>
        </Stack>
      </Card.Body>
      <Card.Footer className="text-muted small">
        {new Date(date).toLocaleDateString()}
      </Card.Footer>
    </Card>
  );
}

export default FeedbackCard;
