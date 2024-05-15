import React, { useState } from 'react';

const PostPage = () => {
  const [formData, setFormData] = useState({
    name: ' ',
    position: ' ',
    level: ' ',
    image: null,
  });


  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'image') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] // Store only the first file
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('position', formData.position);
      formDataToSend.append('level', formData.level);
      formDataToSend.append('image', formData.image);

      const response = await fetch('http://localhost:5050/post/upload', {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json'
        // },
        credentials: 'include',
        body: formDataToSend
        //body: JSON.stringify(formData)
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostPage;
