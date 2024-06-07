import React, { useState } from 'react';
import "../styles/EditProfile.css";
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
import { styled } from '@mui/material/styles';
import {
  Visibility,
  VisibilityOff,
  AddPhotoAlternate,
  Save,
} from '@mui/icons-material';
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
function EditProfile() {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    password: '',
    profilePicture: null,
    school: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'profilePicture') {
      setFormData(prevState => ({
        ...prevState,
        profilePicture: files[0]
      }));
    } 
    // else if (name === 'school'){
    //   setFormData(prevState => ({
    //     ...prevState,
    //     school: value
    //   }));
    // } 
    else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const username = localStorage.getItem('username'); 
    const formDataToSend = new FormData();
    formDataToSend.append('username', username);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('bio', formData.bio);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('school', formData.school);

    if (formData.profilePicture) {
      formDataToSend.append('profilePicture', formData.profilePicture);
    }
  
    try {
      const response = await fetch('http://localhost:5050/user/editprofile', {
        method: 'POST',
        body: formDataToSend
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('profilePicture', data.profilePicture || null);
        localStorage.setItem('profile', data.name);
        localStorage.setItem('school', data.school);
        localStorage.setItem('bio', data.bio);
        localStorage.setItem('password', data.password);

        // Dispatch custom event
        const event = new Event('localStorageUpdated');
        window.dispatchEvent(event);
  
        alert('Profile updated successfully!');
      } else {
        // alert("entered else");
        const errorText = await response.text();
        console.error('Failed to update profile:', errorText);
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

      
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  return (

    <div style={{height:"80vh", alignItems: "center", display: "flex"}}>
    <Paper sx={{ borderRadius:10, width:400, height:550, margin:"auto", mt:2 }}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        height="530px"
      >
        <Grid item>
          <h1>Edit Profile</h1>
        </Grid>
        <Grid item>
        <TextField
          sx={{ m: 1, width: '29ch' }}
          label="Name"
          type='text'
          name='name'
          value={formData.name} 
          onChange={handleChange}
        />
        </Grid>
        <Grid item>
        <TextField
          sx={{ m: 1, width: '29ch' }}
          id="outlined-multiline-flexible"
          label="Bio"
          type='text'
          name='bio'
          multiline
          value={formData.bio} 
          onChange={handleChange}
          maxRows={2}
        />
        </Grid>
        <Grid item>
        <FormControl sx={{ m: 1, width: '29ch' }} variant="outlined">
        <InputLabel htmlFor="password">Password</InputLabel>
        <OutlinedInput
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
        />
      </FormControl >
      </Grid>
      <Grid item>
      <FormControl  sx={{ m: 1, width: '29ch' }} variant="outlined">
        <InputLabel id="school">School</InputLabel>
        <Select
          type='school'
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
      <Button
              component="label"
              variant={formData.profilePicture ? "outlined" : "contained"}
              startIcon={<AddPhotoAlternate />}
              sx={{ m: 1, width: '33ch' }}
            >
              {formData.profilePicture ? 'File Uploaded' : 'Upload Profile Picture'}
              <VisuallyHiddenInput type="file" name="profilePicture" accept="image/*" onChange={handleChange} />
            </Button>
      </Grid>
      <Grid item mt={2}>
      <Button variant="contained" onClick={handleSubmit} endIcon={<Save/>}>
          Save Changes
        </Button>
      </Grid>
        </Grid>
    </Paper>
    </div>
  );
}

export default EditProfile;
