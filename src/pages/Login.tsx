import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { Image } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Login() {
  return (
    <>
      <Container
        fluid
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Image src={logo} style={{ width: "300px" }} fluid />
        <div className="d-flex align-items-center justify-content-center gap-4">
          <h3>Feedback App</h3>
          <i className="bi bi-chat-left-text" style={{ fontSize: "60px" }}></i>
        </div>

        <Card
          className="qu-blue-bg rounded-5 mb-4"
          style={{ minWidth: "400px", minHeight: "200px" }}
        >
          <Card.Body className="d-flex flex-column justify-content-center align-items-center">
            <Form>
              <Form.Group controlId="email" className="mb-3">
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>
              <Form.Group controlId="password" className="mb-3">
                <Form.Control type="password" placeholder="Enter password" />
              </Form.Group>
            </Form>
            <Row className="gx-2">
              <Col>
                <Button
                  className="qu-yellow-bg btn-no-border"
                  onClick={() => console.log("Primary")}
                  style={{ minWidth: "166px" }}
                >
                  <span className="qu-blue">Log In As Student</span>
                </Button>
              </Col>
              <Col>
                <Button
                  className="qu-yellow-bg btn-no-border"
                  onClick={() => console.log("Primary")}
                  style={{ minWidth: "166px" }}
                >
                  <span className="qu-blue">Log In As Professor</span>
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <p className="qu-blue">
          Forgot your password?{" "}
          <Link
            to=""
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Click here
          </Link>
        </p>
      </Container>
    </>
  );
}

export default Login;
