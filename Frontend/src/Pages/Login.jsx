import React, { useState } from 'react';
import "../styles/Login.css"

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleSubmittion = (event) => {
    if(username === 'guest1' && password === 'abc'){
      console.log('Logged In!')
    } else{
      console.log('Failed to Log in')
    }
  }
  return(
    <div className='container'>
    <div className='header'>
      <h1>Login</h1>
    </div>
    <div className='input'>
      <form onSubmit={handleSubmittion}>
        <label htmlFor='Username'>Username:</label>
        <input
          type='text'
          id='username'
          value={username}
          onChange={handleUsernameChange}
          placeholder='Enter your Username'
          required
        />
        <label htmlFor='password'>Password:</label>
        <input
          type='text'
          id='password'
          value={password}
          onChange={handlePasswordChange}
          placeholder='Enter your password'
          required
        />
        <button type='submit'>Login</button>
      </form>
    </div>
  </div>
);
}