import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/Login.css"
//import router from '../../../Backend/routes/userRoute.js';
import "../styles/PostPage.css"

export default function Login({login}) {    
    const handleSubmission = (event) => {
      event.preventDefault(); // Prevent form submission (optional)
      // Replace this with your actual form input handling
      const username = event.target.username.value;
      const password = event.target.password.value;

      if (username === "guest1" && password === "abc") {
        console.log("Logged In!");
      } else {
        console.log("Failed to Log in");
      }
    };
  return(
    <div className='container'>
    <div className='header'>
      <h1>Login</h1>
    </div>
    <div className='input'>
      <form onSubmit={handleSubmission}>
        <label htmlFor='Username'>Username:</label>
        <input
          type='text'
          id='username'
          placeholder='Enter your Username'
          required
        />
        <label htmlFor='password'>Password:</label>
        <input
          type='password'
          id='password'
          placeholder='Enter your password'
          required
        />
        <button type='submit'>Login</button>
      </form>
    </div>
    <div><Link to="/signup">SignUp</Link></div>
  </div>
);
}
