import { useState } from 'react';
import { Button, Form, Container, Image, Card, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/feedbackLogo.jpg';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = email.endsWith('@qu.edu');

  async function handleLogin() {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json() as { message: string };
        setError(data.message ?? 'Login failed');
        return;
      }

      const data = await res.json() as {
        token: string;
        user: { id: string; name: string; role: 'student' | 'professor' };
      };
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      navigate(data.user.role === 'professor' ? '/professor/courses' : '/courses');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

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
            {error && (
              <Alert variant="danger" className="w-100 text-center py-2">
                {error}
              </Alert>
            )}
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
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            </Form>

            <Row className="gx-2">
              <Col>
                <Button
                  className="qu-yellow-bg btn-no-border"
                  disabled={!isValidEmail || isLoading}
                  onClick={handleLogin}
                  style={{ minWidth: '166px' }}
                >
                  <span className="qu-blue">{isLoading ? 'Logging in...' : 'Log In'}</span>
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <p className="qu-blue">
          Forgot your password?{' '}
          <Link to="/reset-password" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
            Click here
          </Link>
        </p>
      </Container>
    </>
  );
}

export default Login;
