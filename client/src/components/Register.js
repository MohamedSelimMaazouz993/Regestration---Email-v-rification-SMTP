import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import './home.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const Navigate = useNavigate();

  useEffect(() => {
    if (showWelcomeMessage) {
      const timer = setTimeout(() => {
        Navigate('/home');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showWelcomeMessage, Navigate]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send a POST request to the backend endpoint
    axios
      .post('/register', { name, email })
      .then((response) => {
        console.log(response.data);
        // Show verification code input
        setShowVerification(true);
      })
      .catch((error) => {
        console.log(error.response.data);
        // Show error message
      });
  };

  const handleVerify = (e) => {
    e.preventDefault();

    // Send a POST request to the backend endpoint for verification
    axios
      .post('/verify', { email, verificationCode })
      .then((response) => {
        console.log(response.data);
        // Show welcome message
        setShowWelcomeMessage(true);
      })
      .catch((error) => {
        console.log(error.response.data);
        // Show error message
      });
  };

  return (
    <div className='home'>
      <div className='content'>
        <Container
          className='d-flex justify-content-center align-items-center'
          style={{ height: '50vh' }}
        >
          <Form>
            <Row>
              <Col>
                <h1>Register</h1>
                {!showVerification && !showWelcomeMessage && (
                  <>
                    <Form.Group controlId='formName'>
                      <Form.Label>Name </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Enter your name'
                        value={name}
                        onChange={handleNameChange}
                      />
                    </Form.Group>
                    <br />
                    <Form.Group controlId='formEmail'>
                      <Form.Label>Email </Form.Label>
                      <Form.Control
                        type='email'
                        placeholder='Enter your email'
                        value={email}
                        onChange={handleEmailChange}
                      />
                    </Form.Group>
                    <br />
                    <Button variant="outline-primary" onClick={handleSubmit}>
                      Register
                    </Button>
                  </>
                )}
                {showVerification && !showWelcomeMessage && (
                  <>
                    <Form.Group controlId='formVerificationCode'>
                      <Form.Label>Verification Code</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Enter the verification code'
                        value={verificationCode}
                        onChange={handleVerificationCodeChange}
                      />
                    </Form.Group>
                    <br />
                    <Button
                      variant='primary'
                      type='submit'
                      onClick={handleVerify}
                    >
                      Verify
                    </Button>
                  </>
                )}
                {showWelcomeMessage && (
                  <div>
                    <p>Welcome to our website!</p>
                    <p>Redirecting To The Home Page ...</p>
                  </div>
                )}
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    </div>
  );
};

export default Register;
