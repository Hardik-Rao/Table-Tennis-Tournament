import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'; // Import styled-components
import LoginForm from './LoginForm';

const FormWrapper = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  text-align: center;
  color: #2c3e50; /* Dark bluish color */
`;

const InputLabel = styled.label`
  font-size: 14px;
  margin-bottom: 8px;
  display: block;
  color: #34495e; /* Slightly lighter bluish color */
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #ecf0f1; /* Light grayish-blue */
  color: #34495e;

  &:focus {
    border-color: #2980b9; /* Bluish border on focus */
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #2980b9; /* Bluish color */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #3498db; /* Slightly lighter bluish color on hover */
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const SuccessMessage = styled.p`
  color: green;
  text-align: center;
`;

const AlreadyRegisteredText = styled.p`
  text-align: center;
  font-size: 14px;
  color: #34495e;
`;

const RegistrationForm = ({ setIsRegistered }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isRegistered, setIsRegisteredState] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const adminDetails = {
      username,
      password,
      email,
      adminKey,
      role: 'admin',
    };

    try {
      const checkResponse = await fetch(
        `http://localhost:5000/api/admins/check?email=${email}`,
        { method: 'GET' }
      );
      const checkData = await checkResponse.json();

      if (checkResponse.ok && checkData.isRegistered) {
        setErrorMessage('Admin is already registered. Redirecting to login...');
        setTimeout(() => setIsRegisteredState(true), 3000);
        return;
      }

      const response = await fetch('http://localhost:5000/api/admins/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminDetails),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setIsRegistered(true);
        setTimeout(() => navigate('/home'), 3000);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage('An error occurred during registration. Please try again.');
    }
  };

  const handleAlreadyRegistered = () => {
    setIsRegisteredState(true);
  };

  if (isRegistered) {
    return <LoginForm />;
  }

  return (
    <FormWrapper>
      <FormTitle>Admin Registration</FormTitle>

      <form onSubmit={handleSubmit}>
        <InputLabel>Username:</InputLabel>
        <InputField
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <InputLabel>Email:</InputLabel>
        <InputField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <InputLabel>Password:</InputLabel>
        <InputField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <InputLabel>Admin Key:</InputLabel>
        <InputField
          type="password"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          required
        />

        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

        <Button type="submit">Register</Button>
      </form>

      <AlreadyRegisteredText>
        Already have an account?{' '}
        <button type="button" onClick={handleAlreadyRegistered}>
          Login here
        </button>
      </AlreadyRegisteredText>
    </FormWrapper>
  );
};

export default RegistrationForm;
