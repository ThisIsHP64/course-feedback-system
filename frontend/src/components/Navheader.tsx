import { Navbar, Container, Nav, NavDropdown, Badge } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo2 from '../assets/feedbackLogo2.png';

function Navheader() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === '/login' || location.pathname === '/reset-password') return null;

  const userStr = localStorage.getItem('auth_user');
  const currentUser = userStr ? JSON.parse(userStr) : null;

  if (!currentUser) {
    return null;
  }

  const homePath = currentUser.role === 'professor' ? '/professor/courses' : '/courses';

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    navigate('/login');
  };

  return (
    <Navbar variant="dark" expand="lg" className="qu-blue-bg">
      <Container fluid>
        <Navbar.Brand className="pb-0" as={Link} to={homePath}>
          <img src={logo2} alt="Logo" height={48} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={homePath}>
              Courses
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <NavDropdown
              title={<Person size={24} className="text-white" />}
              id="basic-nav-dropdown"
              align="end"
            >
              <NavDropdown.Header className="text-center pb-0 mb-1">
                {currentUser.name}
              </NavDropdown.Header>
              <div className="d-flex justify-content-center w-100 mb-2">
                <Badge bg="dark" text="light" className="mx-auto">
                  {currentUser.role}
                </Badge>
              </div>
              <NavDropdown.Item as={Link} to="/profile">
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navheader;
