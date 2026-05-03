import { useState } from 'react';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const resetSchema = z
  .object({
    email: z
      .string()
      .email('Invalid email address')
      .endsWith('@qu.edu', 'Must be a Quinnipiac email'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetFormInputs = z.infer<typeof resetSchema>;

function ResetPassword() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormInputs>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormInputs) => {
    try {
      setError(null);
      await axios.put('/api/auth/reset-password', {
        email: data.email,
        newPassword: data.newPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    }
  };

  return (
    <>
      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
        fluid
      >
        <h2 className="qu-blue mb-3">Reset Password</h2>
        {error && (
          <Alert variant="danger" style={{ maxWidth: '400px', width: '100%' }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" style={{ maxWidth: '400px', width: '100%' }}>
            Password reset successfully! Redirecting to login...
          </Alert>
        )}
        <Form onSubmit={handleSubmit(onSubmit)} className="w-100" style={{ maxWidth: '400px' }}>
          <Form.Group controlId="email" className="mb-3">
            <Form.Control
              type="email"
              placeholder="Quinnipiac email"
              isInvalid={!!errors.email}
              {...register('email')}
            />
            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="newPassword" className="mb-3">
            <Form.Control
              type="password"
              placeholder="New password"
              isInvalid={!!errors.newPassword}
              {...register('newPassword')}
            />
            <Form.Control.Feedback type="invalid">
              {errors.newPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="confirmPassword" className="mb-3">
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              isInvalid={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-grid gap-2">
            <Button type="submit" variant="primary" size="lg" className="qu-blue-bg btn-no-border">
              Submit
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate('/login')}>
              Cancel
            </Button>
          </div>
        </Form>
      </Container>
    </>
  );
}

export default ResetPassword;
