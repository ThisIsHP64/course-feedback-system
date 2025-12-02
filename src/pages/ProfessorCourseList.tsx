import { Container, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import data from '../mockData.json';

function ProfessorCourseList() {
  return (
    <>
      <Container fluid>
        <Row className="m-4 align-items-center">
          <Col>
            <h3 className="m-0 qu-blue text-decoration-underline">
              Courses Taught
            </h3>
          </Col>
          <Col className="d-flex justify-content-end align-items-end">
            <p className="small m-0">Fall 2025</p>
          </Col>
        </Row>
        <Row className="gy-4 mx-4">
          {data.courses.slice(0, 2).map((course) => (
            <Col md={4} key={course.id}>
              <Link
                to={`/professor/course/${course.id}`}
                style={{ textDecoration: 'none', cursor: 'pointer' }}
              >
                <Card className="rounded-5 overflow-hidden">
                  <Card.Img
                    variant="top"
                    src={`https://picsum.photos/512/512?random=${course.id}`}
                    style={{ objectFit: 'cover', height: '200px' }}
                  />
                  <Card.Body className="qu-blue-bg">
                    <Card.Title className="qu-yellow">
                      {course.code} - {course.name}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default ProfessorCourseList;
