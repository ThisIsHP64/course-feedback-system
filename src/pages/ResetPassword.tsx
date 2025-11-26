import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { Image } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ResetPassword() {
  return (
    <>
      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
        fluid
      >
        <h2 className="qu-blue mb-3">Reset Password</h2>
        <Form>
          <Form.Group controlId="email" className="mb-3">
            <Form.Control type="email" placeholder="Quinnipiac email" />
          </Form.Group>
          <Form.Group controlId="newPassword" className="mb-3">
            <Form.Control type="password" placeholder="New password" />
          </Form.Group>
          <Form.Group controlId="confirmPassword" className="mb-3">
            <Form.Control type="password" placeholder="Confirm new password" />
          </Form.Group>
        </Form>
        <Button
          variant="primary"
          size="lg"
          className="qu-blue-bg btn-no-border"
          onClick={() => console.log('Primary')}
        >
          Submit
        </Button>
      </Container>
    </>
  );
}

export default ResetPassword;
