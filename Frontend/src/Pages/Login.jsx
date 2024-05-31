import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Login.css"

export default function Login({ onLogin }) {    

  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.username);
    formDataToSend.append('password', formData.password);

    try {
      const response = await fetch('http://localhost:5050/user/signin', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend
      });

      if (response.ok) {
        const data = await response.json();
        console.log("data: ", data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('profile', data.user.name);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('profilePicture', data.user.profilePicture);
        console.log('login pfp: ', data.user.profilePicture);
        onLogin(data.user.name, data.token, data.user.profilePicture);
        alert('User logged in!');
        console.log("Logged In!");
        navigate('/homepage');
      } else {
        const errorText = await response.json();
        console.error('Login Error: ', errorText);
        alert('Failed to log in: ' + errorText.message);
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Failed to log in.');
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
    <div>
      <h6>Don't Have An Account? </h6>
      <Link to="/signup">Sign Up</Link>
    </div>
  </div>
);
}
