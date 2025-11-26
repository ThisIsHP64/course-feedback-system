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
import { Link } from 'react-router-dom';
import logo2 from '../assets/feedbackLogo2.png';

// Mock data
import data from '../mockData.json';

function Navheader() {
  //TODO: Get user from session
  const userId = 2;
  const currentUser = data.users.find((user) => user.id == userId);
  if (!currentUser) {
    return (
      <Container>
        <Alert variant="danger">No user</Alert>
      </Container>
    );
  }

  return (
    <Navbar
      variant="dark"
      expand="lg"
      className="qu-blue-bg shadow-sm"
      sticky="top"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <img src={logo2} alt="Logo" height={30} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/**TODO: Link these to places */}
            <Nav.Link as={Link} to={'/'}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to={'/'}>
              Home2
            </Nav.Link>
            <Nav.Link as={Link} to={'/'}>
              Home3
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
              {/**TODO: Link these to places */}
              <NavDropdown.Item as={Link} to="/">
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/">
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
