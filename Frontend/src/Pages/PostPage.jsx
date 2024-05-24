import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PostPage = () => {
  const [formData, setFormData] = useState({
    name: ' ',
    desc: ' ',
    image: null,
    isForSale: false,
    isForRent: false,
    buyPrice: '',
    rentPrice: '',
    availability: [],
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

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFormData(prev => ({
      ...prev,
      availability: [start, end]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('desc', formData.desc);
      formDataToSend.append('image', formData.image);
      formDataToSend.append('isForSale', formData.isForSale);
      formDataToSend.append('isForRent', formData.isForRent);
      formDataToSend.append('buyPrice', formData.buyPrice);
      formDataToSend.append('rentPrice', formData.rentPrice);
      formDataToSend.append('availability', JSON.stringify(formData.availability));

      const response = await fetch('http://localhost:5050/post/upload', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend
      });

      if (response.ok) {
        alert('Post saved successfully!');
        // setFormData({ name: '', desc: '' }); // reset form
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
    <div>
      <h2>Create a New Post</h2>
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
            Availability:
            <DatePicker
              selected={formData.availability[0]}
              onChange={handleDateChange}
              startDate={formData.availability[0]}
              endDate={formData.availability[1]}
              selectsRange
              inline
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostPage;