import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import '../style/login.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    institute: '', // Changed "team" to "institute"
    age: '',
    rank: 0, // Default rank
    points: 0 // Default points
  });

  const [image, setImage] = useState(null); // State for the uploaded image
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Add state for success message
  const navigate = useNavigate(); // useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('institute', formData.institute);
      formDataToSend.append('age', formData.age);
      formDataToSend.append('rank', formData.rank);
      formDataToSend.append('points', formData.points);
      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await fetch('http://localhost:5000/api/players', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const result = await response.json();
      if (result.message === 'Player added successfully') {
        setSuccess('Player registered successfully!'); // Set success message
        setError(''); // Clear error message
        // Optionally redirect after showing success
        // setTimeout(() => navigate('/'), 2000); // Navigate after 2 seconds
      } else {
        setError('Registration failed. Please try again.');
        setSuccess(''); // Clear success message
      }
    } catch (error) {
      setError('An error occurred: ' + error.message);
      setSuccess(''); // Clear success message
    }
  };

  return (
    <div className="login-page">
      <h2>Register for the Table Tennis Tournament</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="institute">Institute (Optional)</label> {/* Updated Label */}
          <input
            type="text"
            id="institute"
            name="institute"
            value={formData.institute}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="rank">Rank</label>
          <input
            type="number"
            id="rank"
            name="rank"
            value={formData.rank}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="points">Points</label>
          <input
            type="number"
            id="points"
            name="points"
            value={formData.points}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Upload Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>} {/* Display success message */}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default LoginPage;
