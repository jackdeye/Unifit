import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/Login.css"
import "../styles/PostPage.css"
import {
  Button,
  IconButton,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
  TextField,
  ButtonGroup,
  Paper,
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

export default function Login() {     

  var username = "";
  var password = "";

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleSubmission = async (event) => {
    console.log("we are getting run");
    console.log(username);
    console.log(password);
    event.preventDefault(); 

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', username);
      formDataToSend.append('password', password);

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
    <div style={{height:"80vh", alignItems: "center", display: "flex"}}>
    <Paper sx={{ width:400, height:400, margin:"auto" }}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
            <div className='header'>
              <h1>Login</h1>
            </div>
        </Grid>
        <Grid item>
        <TextField
          sx={{ m: 1, width: '25ch' }}
          id="outlined-required"
          label="Username"
          onChange={(e)=>username=e.target.value}
        />
        </Grid>
        <Grid item>
      <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
          onChange={(e)=>password=e.target.value}
        />
      </FormControl>
        </Grid>
        <Grid item>
      <ButtonGroup size="large" aria-label="Basic button group">
        <Button variant='contained' onClick={handleSubmission}>Login</Button>
        <Button href='/signup' variant='outlined'>Sign Up</Button>
      </ButtonGroup>
    </Grid>
  </Grid>
    </Paper>
    </div>
);
}
