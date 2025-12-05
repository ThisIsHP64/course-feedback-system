/**
 * Navbar.tsx
 * Global Navbar component
 */

import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Alert,
  Badge,
} from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';
import { Link, useLocation } from 'react-router-dom';
import logo2 from '../assets/feedbackLogo2.png';

// Mock data
import data from '../mockData.json';

function Navheader() {
  const location = useLocation();
  // Hide navbar on the login route
  if (location.pathname === '/login') return null;

  // Use mock user id 5 for testing so Profile and Nav match
  const userId = 5;
  const currentUser = data.users.find((user) => user.id == userId);
  if (!currentUser) {
    return (
      <Container>
        <Alert variant="danger">No user</Alert>
      </Container>
    );
  }

  return (
    <Navbar variant="dark" expand="lg" className="qu-blue-bg">
      <Container fluid>
        <Navbar.Brand className="pb-0" as={Link} to="/">
          <img src={logo2} alt="Logo" height={48} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={'/courses'}>
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
              <NavDropdown.Item as={Link} to="/login">
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navheader;
