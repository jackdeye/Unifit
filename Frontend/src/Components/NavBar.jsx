import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/NavBar.css"
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  Button,
  Divider,
  Tooltip,
} from '@mui/material';

export default function Navbar() {
    const pages = [
      //{name: 'Home', location: 'homepage'}, 
      {name: 'Profile', location: 'profile'},
      {name: 'Gallery', location: 'gallery'},
      {name: 'Favorites', location: 'favorites'},
      {name: 'Posts', location: 'postpage'},
    ];
	return (
      <AppBar position="static" sx={{borderRadius:5}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/homepage"
            sx={{
              mr: 2,
              display: { xs: 'flex' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            UNIFIT
          </Typography>
          <Divider/>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {pages.map((item) => (
              <Button key={item.name} href={item.location} sx={{ color: '#fff' }}>
                {item.name}
              </Button>
            ))}
          </Box>
          <Divider/>
          <Button href="/login" variant="contained" color="secondary">Login</Button>
        </Toolbar>
      </Container>
    </AppBar>
	);
}
      /* <div className='navbar'>
			<h1><Link to="/homepage">Unifit</Link></h1>
      <div className='link-container'>
          <Link to="/homepage">Home</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/postpage">Posts</Link>
      </div>
        <div className='button'>
          <Link to="/login">Login</Link>
        </div>
		</div> */
          /*<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>*/
