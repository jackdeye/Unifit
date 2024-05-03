import React, { useState } from 'react';
import axios from 'axios';

const PostPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    desc: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5000/upload', formData);
      alert('Post saved successfully!');
      setFormData({ name: '', desc: '' }); // reset form
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostPage;
