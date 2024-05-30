import React, { useState } from 'react';
import "../styles/Login.css"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PostPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    image: null,
    isForSale: false,
    isForRent: false,
    buyPrice: '',
    rentPrice: '',
    availability: [null, null],
  });

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
      availability: [date, prev.availability[1]]
    }));
  };

  const handleEndDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      availability: [prev.availability[0], date]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }
      const username = localStorage.getItem('username');
      console.log("username: ", username);
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
          isForSale: false,
          isForRent: false,
          buyPrice: '',
          rentPrice: '',
          availability: [null, null]
        }); // Reset form
      } else {
        const errorText = await response.text();
        console.error('Failed to save post:', errorText);
        throw new Error('Failed to save post.');
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      alert('Failed to save post.');
    }
  };

  return (
    <div className='container'>
      <h1 className='header'>Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Title:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label>
            Description:
            <textarea name="desc" value={formData.desc} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label>
            Image:
            <input type="file" name="image" accept="image/*" onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label>
            For Sale:
            <input type="checkbox" name="isForSale" checked={formData.isForSale} onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>
            For Rent:
            <input type="checkbox" name="isForRent" checked={formData.isForRent} onChange={handleChange} />
          </label>
        </div>
        {formData.isForSale && (
          <div>
            <label>
              Buy Price:
              <input type="number" name="buyPrice" value={formData.buyPrice} onChange={handleChange} required={formData.isForSale} />
            </label>
          </div>
        )}
        {formData.isForRent && (
          <div>
            <label>
              Rent Price:
              <input type="number" name="rentPrice" value={formData.rentPrice} onChange={handleChange} required={formData.isForRent} />
            </label>
          </div>
        )}
        <div>
          <label>
            Start Date:
            <DatePicker
              selected={formData.availability[0]}
              onChange={handleStartDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select Start Date"
              className="date-input"
            />
          </label>
        </div>
        <div>
          <label>
            End Date:
            <DatePicker
              selected={formData.availability[1]}
              onChange={handleEndDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select End Date"
              className="date-input"
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostPage;
