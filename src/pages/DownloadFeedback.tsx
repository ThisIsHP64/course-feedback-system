import { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import data from '../mockData.json';

function DownloadFeedback() {
  const params = useParams();
  const courseId = Number(params.courseId) || 1;
  const [fileType, setFileType] = useState<'csv' | 'pdf' | 'json'>('csv');

  const course = data.courses.find((c) => c.id === courseId);
  const professorName = data.users.find(
    (u) => u.id === course?.professorId
  )?.name;

  if (!course) {
    return (
      <Container>
        <p>Course not found</p>
      </Container>
    );
  }

  const onDownload = () => {
    console.log(`Downloading ${course.code} feedback as ${fileType}`);
    alert(`Downloading ${course.code} feedback as ${fileType.toUpperCase()}`);
  };

  return (
    <Row style={{ minHeight: '100vh' }}>
      <Col md={3} className="p-4 border-end border-dark">
        <div style={{ maxWidth: '260px' }}>
          <h5 className="mb-2">Course Information</h5>
          <p className="text-muted small">
            {course.code} - {course.name}
          </p>
          <small className="text-secondary">
            <strong>Average Grade</strong>
            <p>{course.avgGrade}/100</p>
          </small>
          <small className="text-secondary">
            <strong>Professor</strong>
            <p>{professorName}</p>
          </small>
          <small className="text-secondary">
            <strong>Taken</strong>
            <p>{course.semester}</p>
          </small>
        </div>
      </Col>
      <Col className="p-4 d-flex justify-content-center">
        <Container style={{ maxWidth: '700px' }}>
          <h4 className="mb-3">Download Feedback</h4>
          <Form>
            <Form.Check
              type="radio"
              id="type-csv"
              name="fileType"
              label="CSV"
              checked={fileType === 'csv'}
              onChange={() => setFileType('csv')}
              className="mb-2"
            />
            <Form.Check
              type="radio"
              id="type-pdf"
              name="fileType"
              label="PDF"
              checked={fileType === 'pdf'}
              onChange={() => setFileType('pdf')}
              className="mb-2"
            />
            <Form.Check
              type="radio"
              id="type-json"
              name="fileType"
              label="JSON"
              checked={fileType === 'json'}
              onChange={() => setFileType('json')}
              className="mb-4"
            />

            <div className="d-grid">
              <Button
                className="qu-blue-bg btn-no-border text-white"
                size="lg"
                onClick={onDownload}
              >
                Download
              </Button>
            </div>
          </Form>
        </Container>
      </Col>
    </Row>
  );
}

export default DownloadFeedback;
