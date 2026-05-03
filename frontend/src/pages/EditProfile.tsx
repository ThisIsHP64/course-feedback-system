import { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import profilePic from '../assets/EditProfilePicture.png';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string().max(300, 'Bio must be under 300 characters'),
});

type ProfileFormInputs = z.infer<typeof profileSchema>;

function EditProfile() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const userStr = localStorage.getItem('auth_user');
  const user = userStr ? JSON.parse(userStr) : null;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      bio: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) return;
        const token = localStorage.getItem('auth_token');
        const res = await axios.get(`/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        reset({
          name: res.data.name,
          bio: res.data.bio,
        });
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, [user?.id, reset]);

  if (!user) {
    return <p>User not found</p>;
  }

  const bioWatch = watch('bio');
  const nameWatch = watch('name');

  const onSubmit = async (data: ProfileFormInputs) => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await axios.put(`/api/users/${user.id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = { ...user, name: res.data.name };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));

      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (err) {
      setError('Failed to save profile updates');
    }
  };

  return (
    <>
      <Row style={{ minHeight: '100vh' }}>
        <Col md={3} className="p-4 border-end border-dark">
          <div>
            <img src={profilePic} alt="Profile" className="rounded-circle w-100 mb-3" />
            <h5 className="mb-2">{nameWatch || user.name}</h5>
            <p className="text-muted small mb-3">
              {user.role === 'professor' ? 'Professor' : 'Student'}
            </p>
            <small className="text-secondary d-block mb-2">
              <strong>Bio</strong>
            </small>
            <p className="small text-muted mb-4">{bioWatch}</p>

            <div className="d-grid">
              <Button
                className="qu-blue-bg btn-no-border text-white"
                onClick={() => navigate('/profile')}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Col>

        <Col className="p-4 d-flex justify-content-center">
          <Container style={{ maxWidth: '700px' }}>
            <h4 className="mb-4">Edit Profile</h4>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Name</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  isInvalid={!!errors.name}
                  {...register('name')}
                />
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>
                  <strong>Bio</strong>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Enter your bio"
                  isInvalid={!!errors.bio}
                  {...register('bio')}
                />
                <Form.Control.Feedback type="invalid">{errors.bio?.message}</Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button className="qu-blue-bg btn-no-border text-white" type="submit">
                  Submit
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate('/profile')}>
                  Cancel
                </Button>
              </div>
            </Form>
          </Container>
        </Col>
      </Row>
    </>
  );
}

export default EditProfile;
