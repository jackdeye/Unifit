import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/Login.css"
import "../styles/PostPage.css"

export default function Login() {     
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

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
      formDataToSend.append('username', formData.username);
      formDataToSend.append('password', formData.password);

      const response = await fetch('http://localhost:5050/user/signin', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend 
      });

      console.log(response);
      if (response.ok) {
        alert('User has logged in successfully!');
        login();
      } else {
        const errorText = await response.text();
        console.error('Error 3: ', errorText);
        throw new Error('Failed to login user: ');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to login user.');
    }
  };
  return(
    <div className='container'>
    <div className='header'>
      <h1>Login</h1>
    </div>
    <div className='input'>
      <form onSubmit={handleSubmission}>
        <label htmlFor='username'>Username:</label>
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
        <button type='submit'>Login</button>
      </form>
    </div>
    <div><Link to="/signup">SignUp</Link></div>
  </div>
);
}
