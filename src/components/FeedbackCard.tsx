/**
 * FeedbackCard.tsx
 * Card component to display lesson feedback and star rating
 */

import { Card } from 'react-bootstrap';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

type CardProps = {
  comment: string;
  rating: number;
  date: Date;
};

function FeedbackCard({ comment, rating, date }: CardProps) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Feedback</Card.Title>
        <div className="mb-2">
          <Rating value={rating} readOnly />
        </div>
        <Card.Text>{comment}</Card.Text>
      </Card.Body>
      <Card.Footer>{new Date(date).toLocaleDateString()}</Card.Footer>
    </Card>
  );
}

export default FeedbackCard;
