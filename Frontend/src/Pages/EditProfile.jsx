import React, { useState } from 'react';
import "../styles/EditProfile.css";

function EditProfile() {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    password: '',
    profilePicture: null,
    school: ''
  });

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
      console.log("formData.profilePicture: ", formData.profilePicture);
      formDataToSend.append('profilePicture', formData.profilePicture);
    }
  
    try {
      const response = await fetch('http://localhost:5050/user/editprofile', {
        method: 'POST',
        body: formDataToSend
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("pfp: ", data.profilePicture);
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
  
  return (
    <div className='container'>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <h4>Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder='Enter your name'
          />
        </h4>

        <h4>Bio:
          <input
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Enter your bio"
          />
        </h4>

        <h4>Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your new password"
          />
        </h4>

        <h4>School:
          <select
            type='school'
            name='school'
            value={formData.school}
            onChange={handleChange}
            >
            <option value=''>Select a school</option>
            <option value='UCLA'>UCLA</option>
            <option value='University of Maryland'>University of Maryland, College Park</option>
            <option value='oocla'>oocla</option>
            <option value='UC Berkeley'>UC Berkeley</option>
            <option value='Florida State University, School of Circustry'>Florida State University, School of Circustry</option>
            <option value='University of Spoiled Children'>University of Spoiled Children</option>
            <option value='Stanford University'>Stanford University</option>
            <option value='Some school in the midwest (love u eggert)'>Some school in the midwest (love u eggert)</option>
          </select>
        </h4>

        <h4>Profile Picture:
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleChange}
          />
        </h4>

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default EditProfile;
