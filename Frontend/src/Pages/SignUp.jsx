import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Select,
  MenuItem,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

export default function SignUp({ onSignup }) {    

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    school: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); 

    
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };
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

    <div style={{height:"80vh", alignItems: "center", display: "flex"}}>
    <Paper sx={{ borderRadius:10, width:400, height:550, margin:"auto", mt:2 }}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        height="500px"
      >
        <Grid item>
          <h1>Sign up for <span style={{color:"#367765"}}>UNIFIT</span></h1>
        </Grid>
        <Grid item>
        <TextField
          sx={{ m: 1, width: '25ch' }}
          label="First Name"
          type='firstName'
          id='firstName'
          name='firstName'
          value={formData.firstName} 
          onChange={handleChange}
          required
        />
        </Grid>
        <Grid item>
        <TextField
          sx={{ m: 1, width: '25ch' }}
          label="Last Name"
          type='lastName'
          id='lastName'
          name='lastName'
          value={formData.lastName} 
          onChange={handleChange}
          required
        />
        </Grid>
        <Grid item>
        <TextField
          sx={{ m: 1, width: '25ch' }}
          id="username"
          label="Username"
          type='text'
          name='username' 
          value={formData.username}
          onChange={handleChange}
          required
        />
        </Grid>
        <Grid item>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
        <InputLabel htmlFor="password">Password</InputLabel>
        <OutlinedInput
          id='password'
          name='password'
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
          value={formData.password} 
          onChange={handleChange}
          required
        />
      </FormControl >
      </Grid>
      <Grid item>
      <FormControl  sx={{ m: 1, width: '25ch' }} variant="outlined">
        <InputLabel id="school">School</InputLabel>
        <Select
          labelId="school"
          type='school'
          id='school'
          name='school'
          value={formData.school}
          label="School"
          onChange={handleChange}
        >
          <MenuItem value={"UCLA"}>UCLA</MenuItem>
          <MenuItem value={'University of Maryland'}>University of Maryland, College Park</MenuItem>
          <MenuItem value={'oocla'}>oocla</MenuItem>
          <MenuItem value={'UC Berkeley'}>UC Berkeley</MenuItem>
          <MenuItem value={'Florida State University, School of Circustry'}>Florida State University, School of Circustry</MenuItem>
          <MenuItem value={'University of Spoiled Children'}>University of Spoiled Children</MenuItem>
          <MenuItem value={'Stanford University'}>Stanford University</MenuItem>
          <MenuItem value={'Some school in the midwest (love u eggert)'}>Some school in the midwest (love u eggert)</MenuItem>
        </Select>
      </FormControl>
      </Grid>
        <Grid item>
          
      <ButtonGroup size="large" aria-label="Basic button group">
        <Button href='/login' variant='outlined'>Login</Button>
        <Button variant='contained' onClick={handleSubmission}>Sign Up</Button>
        
      </ButtonGroup>
    </Grid>
  </Grid>
    </Paper>
    </div>
);
}