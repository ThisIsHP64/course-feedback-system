import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { Image } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import data from '../mockData.json';

function CourseList() {
  const courses = data.courses.map(function (course) {
    return course.code.concat(' - ').concat(course.name);
  });
  return (
    <>
      <Container fluid>
        <Row className="m-4 align-items-center">
          <Col>
            <h3 className="m-0 qu-blue text-decoration-underline">
              Current Courses
            </h3>
          </Col>
          <Col className="d-flex justify-content-end align-items-end">
            <p className="small m-0">Fall 2025</p>
          </Col>
        </Row>
        <Row className="gy-4 mx-4">
          {courses.map((course) => (
            <Col md={4} key={course}>
              <Link
                to={''}
                style={{ textDecoration: 'none', cursor: 'pointer' }}
              >
                <Card className="rounded-5 overflow-hidden">
                  <Card.Img
                    variant="top"
                    src={`https://picsum.photos/512/512?random=${course}`}
                    style={{ objectFit: 'cover', height: '200px' }}
                  />
                  <Card.Body className="qu-blue-bg">
                    <Card.Title className="qu-yellow">{course}</Card.Title>
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

export default CourseList;
