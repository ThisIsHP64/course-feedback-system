import { useState, useEffect } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import type { Course } from '../types/types';

function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await axios.get('/api/courses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <Container fluid>
      <Row className="m-4 align-items-center">
        <Col>
          <h3 className="m-0 qu-blue text-decoration-underline">Current Courses</h3>
        </Col>
        <Col className="d-flex justify-content-end align-items-end">
          <p className="small m-0">Fall 2025</p>
        </Col>
      </Row>
      <Row className="gy-4 mx-4">
        {courses.map((course) => (
          <Col md={4} key={course._id}>
            <Link
              to={`/course/${course._id}`}
              style={{ textDecoration: 'none', cursor: 'pointer' }}
            >
              <Card className="rounded-5 overflow-hidden">
                <Card.Img
                  variant="top"
                  src={`https://picsum.photos/512/512?random=${course._id}`}
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
  );
}

export default CourseList;
