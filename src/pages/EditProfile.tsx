import { useState } from 'react';
import { Button, Col, Container, Row, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import data from '../mockData.json';
import profilePic from '../assets/EditProfilePicture.png';

function EditProfile() {
  const navigate = useNavigate();
  const userId = 5;

  const user = data.users.find((u) => u.id === userId);
  if (!user) {
    return <p>User not found</p>;
  }

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(
    'Software Engineering student at Quinnipiac University.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // There is no backend for this project so this does not actually save anything
    console.log('Saving profile changes:', { name, bio });
    alert('Profile updated successfully!');
    navigate('/profile');
  };

  return (
    <>
      <Row style={{ minHeight: '100vh' }}>
        <Col md={3} className="p-4 border-end border-dark">
          <div>
            <img
              src={profilePic}
              alt="Profile"
              className="rounded-circle w-100 mb-3"
            />
            <h5 className="mb-2">{user.name}</h5>
            <p className="text-muted small mb-3">Junior</p>
            <small className="text-secondary d-block mb-2">
              <strong>Feedback Submitted:</strong>
            </small>
            <p className="m-0 mb-3">12</p>
            <small className="text-secondary d-block mb-2">
              <strong>Bio</strong>
            </small>
            <p className="small text-muted mb-4">{bio}</p>

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
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Name</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>
                  <strong>Bio</strong>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Enter your bio"
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button
                  className="qu-blue-bg btn-no-border text-white"
                  type="submit"
                >
                  Submit
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate('/profile')}
                >
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
