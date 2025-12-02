import { Button, Col, Container, Row, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import data from '../mockData.json';
import profilePic from '../assets/Boomer2.png';

function ProfilePage() {
  const navigate = useNavigate();
  const userId = 5;

  const user = data.users.find((u) => u.id === userId);
  if (!user) {
    return <p>User not found</p>;
  }

  const profileData = {
    designation: 'Junior',
    bio: 'Software Engineering student at Quinnipiac University.',
    feedbackSubmitted: 12,
  };

  const currentCourses = data.courses.slice(0, 2);
  const completedCourses = data.courses.slice(2, 4);

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
            <p className="text-muted small mb-3">{profileData.designation}</p>
            <small className="text-secondary d-block mb-2">
              <strong>Feedback Submitted:</strong>
            </small>
            <p className="m-0 mb-3">{profileData.feedbackSubmitted}</p>
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
            {/* Current Courses */}
            <div className="mb-5">
              <h5 className="mb-3">Current Courses</h5>
              <ListGroup>
                {currentCourses.map((course) => (
                  <ListGroup.Item key={course.id} className="p-3">
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

            {/* Completed Courses */}
            <div>
              <h5 className="mb-3">Completed Courses</h5>
              <ListGroup>
                {completedCourses.map((course) => (
                  <ListGroup.Item key={course.id} className="p-3">
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
