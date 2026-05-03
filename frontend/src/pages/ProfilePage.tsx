import { useEffect, useState } from 'react';
import { Button, Col, Container, Row, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import profilePic from '../assets/Boomer2.png';

function ProfilePage() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);

  const userStr = localStorage.getItem('auth_user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const fetchProfileAndCourses = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('auth_token');
        const headers = { Authorization: `Bearer ${token}` };

        const [profileRes, coursesRes] = await Promise.all([
          axios.get(`/api/users/${user.id}`, { headers }),
          axios.get('/api/courses', { headers }),
        ]);

        setProfileData(profileRes.data);
        setCourses(coursesRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfileAndCourses();
  }, [user]);

  if (!user || !profileData) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Row style={{ minHeight: '100vh' }}>
        <Col md={3} className="p-4 border-end border-dark">
          <div>
            <img src={profilePic} alt="Profile" className="rounded-circle w-100 mb-3" />
            <h5 className="mb-2">{profileData.name}</h5>
            <p className="text-muted small mb-3">
              {user.role === 'professor' ? 'Professor' : 'Student'}
            </p>
            <small className="text-secondary d-block mb-2">
              <strong>Bio</strong>
            </small>
            <p className="small text-muted mb-4">{profileData.bio}</p>

            <div className="d-grid">
              <Button
                className="qu-blue-bg btn-no-border text-white"
                onClick={() => navigate('/edit-profile')}
              >
                Edit
              </Button>
            </div>
          </div>
        </Col>

        <Col className="p-4 d-flex justify-content-center">
          <Container style={{ maxWidth: '700px' }}>
            <div className="mb-5">
              <h5 className="mb-3">Courses</h5>
              <ListGroup>
                {courses.map((course) => (
                  <ListGroup.Item key={course._id} className="p-3">
                    <div>
                      <h6 className="text-primary fw-bold m-0">
                        {course.code} - {course.name}
                      </h6>
                      <small className="text-muted">{course.semester}</small>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Container>
        </Col>
      </Row>
    </>
  );
}

export default ProfilePage;
