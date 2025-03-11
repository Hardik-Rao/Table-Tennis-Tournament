import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f9; /* Light gray background */
`;

const LoginFormContainer = styled.form`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #34495e; /* Slightly lighter bluish color */
`;

const Input = styled.input`
  width: 100%; /* Make input take full width of the form */
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #ecf0f1; /* Light grayish-blue */
  font-size: 16px;
  color: #34495e;
  box-sizing: border-box; /* Ensures padding is included in width */

  &:focus {
    border-color: #2980b9; /* Bluish border on focus */
    outline: none;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c; /* Red color for error messages */
  font-weight: bold;
  text-align: center;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #2980b9; /* Bluish color */
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 16px; /* Match the font size of input fields */
  box-sizing: border-box; /* Ensures padding is included in width */

  &:hover {
    background-color: #3498db; /* Slightly lighter bluish color on hover */
  }
`;

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/admins/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.role === 'guest') {
         
          navigate('/homeGuest');
        } else {
          setErrorMessage('Access denied: User is not a guest');
        }
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <LoginPage>
      <LoginFormContainer onSubmit={handleLogin}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Login</h2>

        <FormGroup>
          <Label>Username:</Label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Password:</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>

        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

        <SubmitButton type="submit">Login</SubmitButton>
      </LoginFormContainer>
    </LoginPage>
  );
};

export default LoginForm;
