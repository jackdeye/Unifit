import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function SignUp({ onSignup }) {    

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    school: '',
  });

  const navigate = useNavigate(); 

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmission = async (event) => {
    event.preventDefault(); 

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('username', formData.username);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('school', formData.school);

      const response = await fetch('http://localhost:5050/user/signup', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend
      });
      if (response.ok) {
        const data = await response.json();
        onSignup(data.user.name, data.token);
        alert('User created and logged in successfully!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('profile', data.user.name);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('profilePicture', null);
        localStorage.setItem('school', data.user.school);
        localStorage.setItem('bio', null);
        navigate('/homepage'); // Redirect to homepage after signup
      } else {
        const data = await response.json(); // Parse the error response as JSON
        throw new Error(data.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.message) {
        alert('Failed to create user: ' + error.message);
      } else {
        alert('Failed to create user.');
      }
    }    
  };

  return(
    <div className='container'>
    <div className='header'>
      <h1>Signup</h1>
    </div>
    <div className='input'>
      <form onSubmit={handleSubmission}>
        <label htmlFor='firstName'>First Name:</label>
          <input
              type='firstName'
              id='firstName'
              name='firstName'
              placeholder='First Name'
              value={formData.firstName} 
              onChange={handleChange}
              required
        />
        <label htmlFor='lastName'>Last Name:</label> 
          <input
              type='lastName'
              id='lastName'
              name='lastName'
              placeholder='Last Name'
              value={formData.lastName} 
              onChange={handleChange}
              required
          />
        <label htmlFor='Username'>Username:</label>
        <input
            type='text'
            id='username'
            name='username' 
            placeholder='Enter your Username'
            value={formData.username}
            onChange={handleChange}
            required
        />
        <label htmlFor='password'>Password:</label>
        <input
            type='password'
            id='password'
            name='password'
            placeholder='Enter your password'
            value={formData.password} 
            onChange={handleChange}
            required
        />
        <label htmlFor='school'>School:</label>
        <div></div>
        <select
          //type='school'
          id='school'
          name='school'
          value={formData.school}
          onChange={handleChange}
          >
            <option value=''>Select a school</option>
            <option value='UCLA'>UCLA</option>
            <option value='University of Maryland'>University of Maryland, College Park</option>
            <option value='oocla'>oocla</option>
            <option value='UC Berkeley'>UC Berkeley</option>
            <option value='Florida State University, School of Circustry'>Florida State University, School of Circustry</option>
            <option value='University of Spoiled Children'>University of Spoiled Children</option>
            <option value='Stanford University'>Stanford University</option>
            <option value='Some school in the midwest (love u eggert)'>Some school in the midwest (love u eggert)</option>
        </select>
        <div></div>
        
        <button type='submit'>Signup</button>
      </form>
    </div>
  </div>
);
}
