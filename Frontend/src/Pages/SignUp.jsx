import React, { useState } from 'react';
//import "../styles/Login.css"

export default function SignUp() {    
    const handleSubmission = (event) => {
      event.preventDefault(); 
      const username = event.target.username.value;
      const password = event.target.password.value;
      console.log("Created an Account");
      console.log("Username: " + username);
      console.log("Password: " + username);
      //try: 
      //catch: 

    };
  return(
    <div className='container'>
    <div className='header'>
      <h1>Signup</h1>
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
          type='text'
          id='password'
          placeholder='Enter your password'
          required
        />
        <button type='submit'>Signup</button>
      </form>
    </div>
  </div>
);
}