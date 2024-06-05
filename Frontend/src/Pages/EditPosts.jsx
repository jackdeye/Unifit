import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';;
import "../styles/PostPage.css"
import "../styles/Login.css"
//import DatePicker from 'react-datepicker';
//import 'react-datepicker/dist/react-datepicker.css';
import {
  TextField,
  Grid,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CloudUpload, Send } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

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

const EditPosts = () => {
  const { id } = useParams();
  const [product, setProduct] = useState();
  const [availability, setAvailability] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const gotHereCorrectly = localStorage.getItem('EditPageButton');
    if (gotHereCorrectly === 'false') {
      navigate('/profile');
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5050/post/${id}`);

        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          console.error('Failed to fetch product');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    image: null,
    isForSale: false,
    isForRent: false,
    buyPrice: 0,
    rentPrice: 0,
    size: "XS",
    quality: "New",
    school: null,
    availability: null,

  });

  useEffect(() => {
    if (!product) return;
    const fetchAvailability = async () => {
      try {
        const response = await fetch(`http://localhost:5050/post/${product._id}/availability`);
        if (response.ok) {
          const data = await response.json();
          setAvailability({
            start: new Date(data[0]),
            end: new Date(data[1])
          });
        } else {
          console.error('Failed to fetch availability');
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
      }
    };

    fetchAvailability();
    setFormData({
      name: product.name,
      desc: product.desc,
      image: product.image,
      isForSale: product.isForSale,
      isForRent: product.isForRent,
      buyPrice: product.buyPrice,
      rentPrice: product.rentPrice,
      quality: product.quality,
      size: product.size,
      availability: availability,
    });
  }, [product]);

  if (!product) {
    return <div>Loading...</div>;
  }
  
  const handleChange = (event) => {
    const { name, value, files, type, checked } = event.target;
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0], // Store only the first file
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleStartDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      availability: [date.toDate(), prev.availability[1]]
    }));
  };

  const handleEndDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      availability: [prev.availability[0], date.toDate()]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log(formData);
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }
      
      const deleteResponse = await fetch(`http://localhost:5050/post/${id}`,{
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}` //must include token in Authorization header!
        }, 
      });

      const username = localStorage.getItem('username');
      const school = localStorage.getItem('school');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('desc', formData.desc);
      formDataToSend.append('image', formData.image);
      formDataToSend.append('isForSale', formData.isForSale);
      formDataToSend.append('isForRent', formData.isForRent);
      formDataToSend.append('buyPrice', formData.buyPrice);
      formDataToSend.append('rentPrice', formData.rentPrice);
      formDataToSend.append('availability', JSON.stringify(formData.availability));
      formDataToSend.append('username', username);
      formDataToSend.append('quality', formData.quality); // Append quality to formData
      formDataToSend.append('size', formData.size);
      formDataToSend.append('school', school);

      const response = await fetch('http://localhost:5050/post/upload', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}` // Must include token in Authorization header!
        },
      });

      if (response.ok) {
        alert('Post saved successfully!');
        setFormData({
          name: '',
          desc: '',
          image: null,
          isForSale: true,
          isForRent: true,
          buyPrice: '',
          rentPrice: '',
          availability: [],
          quality: 'New', // Reset quality to default value
          size: 'XS',
        }); // Reset form
      } else {
        const errorText = await response.text();
        console.error('Failed to save post:', errorText);
        throw new Error('Failed to save post.');
      }
      navigate('/profile');
    } catch (error) {
      console.error('Error submitting post:', error);
      alert('Failed to save post.');
    }
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      width="80vh"
      height="80vh"
      margin="auto"
    >
      <Grid item xs={6} display="flex" flexDirection="column">
        <TextField
          sx={{ m: 1, width: '25ch' }}
          id="outlined-required"
          label="Title"
          autoComplete='off'
          value={formData.name}
          name="name"
          onChange={handleChange}
        />
        <TextField
          sx={{ m: 1, width: '25ch' }}
          id="outlined-required"
          label="Description"
          autoComplete='off'
          value={formData.desc}
          name="desc"
          onChange={handleChange}
        />
        {formData.isForSale ?
          <FormControl sx={{ m: 1, width: '25ch' }}>
            <InputLabel htmlFor="outlined-adornment-amount">Buy Price</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              name="buyPrice"
              value={formData.buyPrice}
              label="Buy Price"
              onChange={handleChange}
            />
          </FormControl>
          :
          <div />
        }
        {formData.isForRent ?
          <FormControl sx={{ m: 1, width: '25ch' }}>
            <InputLabel htmlFor="outlined-adornment-amount">Rent Price</InputLabel>

            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              name="rentPrice"
              value={formData.rentPrice}
              label="Rent Price"
              onChange={handleChange}
            />
          </FormControl>
          :
          <div />
        }
        <FormControl sx={{ m: 1, width: '25ch' }}>
          <InputLabel id="quality-select-label">Quality</InputLabel>
          <Select
            labelId="quality-select-label"
            id="quality-simple-select"
            value={formData.quality}
            label="Quality"
            name="quality"
            onChange={handleChange}
          >
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="Like New">Like New</MenuItem>
            <MenuItem value="Used">Used</MenuItem>
            <MenuItem value="Lightly Used">Lightly Used</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4} display="flex" flexDirection="column" alignItems="center">
        <FormControl sx={{ m: 1, width: '25ch' }}>
          <InputLabel id="size-select-label">Size</InputLabel>
          <Select
            labelId="size-select-label"
            id="size-simple-select"
            value={formData.size}
            label="Size"
            name="size"
            onChange={handleChange}
          >
            <MenuItem value="XS">XS</MenuItem>
            <MenuItem value="S">S</MenuItem>
            <MenuItem value="M">M</MenuItem>
            <MenuItem value="L">L</MenuItem>
          </Select>
        </FormControl>
        <Button
          component="label"
          role={undefined}
          variant={formData.image ? "outlined" : "contained"}
          tabIndex={-1}
          startIcon={<CloudUpload />}
          sx={{ m: 1, width: '25ch' }}
        >
          {formData.image ? 'File Uploaded' : 'Upload File'}
          <VisuallyHiddenInput type="file" name="image" onChange={handleChange} />
        </Button>
        <FormGroup>
          <FormControlLabel
            onChange={handleChange}
            control={<Checkbox defaultChecked />}
            label="For Sale"
            value={formData.isForSale}
            name="isForSale"
          />
          <FormControlLabel
            onChange={handleChange}
            control={<Checkbox defaultChecked />}
            label="For Rent"
            value={formData.isForRent}
            name="isForRent"
          />
        </FormGroup>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            onChange={handleStartDateChange}
            sx={{ m: 1, width: '25ch' }}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="End Date"
            onChange={handleEndDateChange}
            sx={{ m: 1, width: '25ch' }}
          />
        </LocalizationProvider>
        <Button variant="contained" onClick={handleSubmit} endIcon={<Send />}>
          Post
        </Button>
      </Grid>
    </Grid>
  );
};
export default EditPosts;