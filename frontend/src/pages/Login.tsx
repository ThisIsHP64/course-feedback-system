import { useState, useEffect } from 'react';
import { Button, Form, Container, Image, Card, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import logo from '../assets/feedbackLogo.jpg';

const loginSchema = z.object({
  email: z.string().email().endsWith('@qu.edu'),
  password: z.string().min(1),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');

    if (token && userStr) {
      const user = JSON.parse(userStr);
      navigate(user.role === 'professor' ? '/professor/courses' : '/courses');
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setApiError(null);
    setIsLoading(true);
    try {
      const res = await axios.post('/api/auth/login', data);

      localStorage.setItem('auth_token', res.data.token);
      localStorage.setItem('auth_user', JSON.stringify(res.data.user));
      navigate(res.data.user.role === 'professor' ? '/professor/courses' : '/courses');
    } catch (error: any) {
      setApiError(error.response?.data?.message ?? 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: '100vh' }}
    >
      <Image src={logo} className="mb-4" style={{ height: '140px' }} fluid />

      <Card className="qu-blue-bg rounded-5 mb-4" style={{ minWidth: '400px', minHeight: '200px' }}>
        <Card.Body className="d-flex flex-column justify-content-center align-items-center">
          {apiError && (
            <Alert variant="danger" className="w-100 text-center py-2">
              {apiError}
            </Alert>
          )}
          <Form onSubmit={handleSubmit(onSubmit)} className="w-100">
            <Form.Group controlId="email" className="mb-3">
              <Form.Control
                type="email"
                placeholder="Enter email"
                isInvalid={!!errors.email}
                {...register('email')}
              />
              <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="password" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Enter password"
                isInvalid={!!errors.password}
                {...register('password')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Row className="gx-2 justify-content-center mt-4">
              <Col xs="auto">
                <Button
                  type="submit"
                  className="qu-yellow-bg btn-no-border"
                  disabled={!isValid || isLoading}
                  style={{ minWidth: '166px' }}
                >
                  <span className="qu-blue">{isLoading ? 'Logging in...' : 'Log In'}</span>
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <p className="qu-blue">
        Forgot your password?{' '}
        <Link to="/reset-password" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
          Click here
        </Link>
      </p>
    </Container>
  );
}

export default Login;
