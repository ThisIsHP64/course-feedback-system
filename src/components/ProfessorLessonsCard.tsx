import { Button, Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { Lesson } from '../types/types';

type CardProps = {
  weekNumber: number;
  weekStart: Date;
  weekEnd: Date;
  lessons: Lesson[];
};

function ProfessorLessonsCard({
  weekNumber,
  weekStart,
  weekEnd,
  lessons,
}: CardProps) {
  const navigate = useNavigate();
  return (
    <Card className="mb-3 shadow-sm p-0">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h3 className="m-0">Week {weekNumber} </h3>
        <span className="text-muted">
          {weekStart.toLocaleDateString()} - {weekEnd.toLocaleDateString()}
        </span>
      </Card.Header>
      <ListGroup variant="flush">
        {lessons.map((lesson) => (
          <ListGroup.Item key={lesson.id} className="p-3">
            <div className="d-flex justify-content-between">
              <h6 className="text-primary fw-bold align-self-center m-0">
                {lesson.title}
              </h6>
              <Button
                className="btn btn-outline-secondary btn-sm"
                variant="outline-secondary"
                onClick={() => navigate(`/lesson/${lesson.id}/view`)}
              >
                View
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}

export default ProfessorLessonsCard;
