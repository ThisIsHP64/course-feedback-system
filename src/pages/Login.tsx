import { useState } from 'react';
import {
  Button,
  Form,
  Container,
  Image,
  Card,
  Row,
  Col,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/feedbackLogo.jpg';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const isValidEmail = email.endsWith('@qu.edu');

  return (
    <>
      <Container
        fluid
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <Image src={logo} className="mb-4" style={{ height: '140px' }} fluid />

        <Card
          className="qu-blue-bg rounded-5 mb-4"
          style={{ minWidth: '400px', minHeight: '200px' }}
        >
          <Card.Body className="d-flex flex-column justify-content-center align-items-center">
            <Form>
              <Form.Group controlId="email" className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="password" className="mb-3">
                <Form.Control type="password" placeholder="Enter password" />
              </Form.Group>
            </Form>

            <Row className="gx-2">
              <Col>
                <Button
                  className="qu-yellow-bg btn-no-border"
                  disabled={!isValidEmail}
                  onClick={() => navigate('/courses')}
                  style={{ minWidth: '166px' }}
                >
                  <span className="qu-blue">Log In As Student</span>
                </Button>
              </Col>
              <Col>
                <Button
                  className="qu-yellow-bg btn-no-border"
                  disabled={!isValidEmail}
                  onClick={() => navigate('/professor/courses')}
                  style={{ minWidth: '166px' }}
                >
                  <span className="qu-blue">Log In As Professor</span>
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <p className="qu-blue">
          Forgot your password?{' '}
          <Link
            to="/reset-password"
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            Click here
          </Link>
        </p>
      </Container>
    </>
  );
}

export default Login;
