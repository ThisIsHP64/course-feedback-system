/**
 * WeekLessonsCard.tsx
 * Used to group lessons by week, a card that displays
 * the week number and the lessons passed as props.
 */

import { Button, Card, ListGroup } from 'react-bootstrap';
import type { Lesson } from '../types/types';

type CardProps = {
  weekNumber: number;
  weekStart: Date;
  weekEnd: Date;
  lessons: Lesson[];
};

function WeekLessonsCard({
  weekNumber,
  weekStart,
  weekEnd,
  lessons,
}: CardProps) {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Header>
        <h3 className="mb-0">Week {weekNumber} </h3>
        <span className="text-muted">
          {weekStart.toLocaleDateString()} - {weekEnd.toLocaleDateString()}
        </span>
      </Card.Header>
      <ListGroup variant="flush">
        {lessons.map((lesson) => (
          <ListGroup.Item key={lesson.id} className="p-3">
            <div className="d-flex justify-content-between">
              <h6 className="text-primary fw-bold">{lesson.title}</h6>
              {/**TODO: Routing */}
              <Button className="btn btn-outline-secondary btn-sm"></Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}

export default WeekLessonsCard;
