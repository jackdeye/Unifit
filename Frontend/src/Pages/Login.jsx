import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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


export default function Login({ onLogin }) {    

  var username = "";
  var password = "";

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleSubmission = async (event) => {
    console.log("we are getting run");
    console.log(username);
    console.log(password);
    event.preventDefault(); 
    const formDataToSend = new FormData();
    formDataToSend.append('username', username);
    formDataToSend.append('password', password);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', username);
      formDataToSend.append('password', password);

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
        localStorage.setItem('purchasedPosts', JSON.stringify(data.user.purchasedPosts || []));
        localStorage.setItem('pendingPosts', JSON.stringify(data.user.pendingPosts || []));
        localStorage.setItem('pendingRequests', JSON.stringify(data.user.pendingRequests || []));
        // console.log("local storage purchasedPosts: ", localStorage.getItem('purchasedPosts'));
        onLogin(
          data.user.name, 
          data.token, 
          data.user.profilePicture,
          data.user.purchasedPosts
        );
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
    <div style={{height:"80vh", alignItems: "center", display: "flex"}}>
    <Paper sx={{ borderRadius:10, width:400, height:400, margin:"auto" }}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        height="400px"
      >
        <Grid item>
          <h1>Login To <span style={{color:"#367765"}}>UNIFIT</span></h1>
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
