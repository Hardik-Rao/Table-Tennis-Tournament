import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const RegisterPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
`;

const RegisterFormContainer = styled.form`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
  box-sizing: border-box;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #ecf0f1;
  font-size: 14px;
  color: #34495e;
  box-sizing: border-box;

  &:focus {
    border-color: #2980b9;
    outline: none;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-weight: bold;
  text-align: center;
  font-size: 14px;
`;

const SuccessMessage = styled.p`
  color: #5cb85c;
  font-weight: bold;
  text-align: center;
  font-size: 14px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #2980b9;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 14px;
  box-sizing: border-box;

  &:hover {
    background-color: #3498db;
  }
`;

const Add = () => {
  const [formData, setFormData] = useState({
    name: '',
    institute: '',
    age: '',
    rank: 0,
    points: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); // Hook to navigate between routes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    try {
      const response = await fetch(`${apiBaseUrl}/api/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Registration failed');

      const result = await response.json();
      if (result.message === 'Player added successfully') {
        setSuccess('Player registered successfully!');
        setError('');
        navigate('/home'); // Redirect to /home after successful registration
      } else {
        setError('Registration failed. Please try again.');
        setSuccess('');
      }
    } catch (error) {
      setError('An error occurred: ' + error.message);
      setSuccess('');
    }
  };

  return (
    <RegisterPage>
      <RegisterFormContainer onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', fontSize: '18px' }}>Register for the Table Tennis Tournament</h2>

        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="institute">Institute (Optional)</Label>
          <Input
            type="text"
            id="institute"
            name="institute"
            value={formData.institute}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="age">Age</Label>
          <Input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="rank">Rank</Label>
          <Input
            type="number"
            id="rank"
            name="rank"
            value={formData.rank}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="points">Points</Label>
          <Input
            type="number"
            id="points"
            name="points"
            value={formData.points}
            onChange={handleChange}
          />
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <SubmitButton type="submit">Register</SubmitButton>
      </RegisterFormContainer>
    </RegisterPage>
  );
};

export default Add;
