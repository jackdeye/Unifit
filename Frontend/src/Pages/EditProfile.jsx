import React, { useState} from 'react';
import "../styles/Login.css";
  
function EditProfile () {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [email, setEmail] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [bioInput, setBioInput] = useState('');
    const [emailInput, setEmailInput] = useState('');

    const handleNameChange = (event) => {
      setName(event.target.value);
      console.log("Set name to " + name);
      setNameInput('');
    };

    const handleNameInput = () => {
      setNameInput(event.target.value);
    };

    const handleBioChange = (event) => {
      setBio(event.target.value);
      console.log("Set bio to " + bio);
      setBioInput('');
    };

    const handleBioInput = () => {
      setBioInput(event.target.value);
    };

    const handleEmailChange = (event) => {
      setEmail(event.target.value);
      console.log("Set email to " + email);
      setEmailInput('');
    };

    const handleEmailInput = () => {
      setEmailInput(event.target.value);
    };

    

  return (
    <div className='container'>
      <h1>Edit Profile</h1>
          <h4>Name: 
          <input
            type="text"
            value={nameInput}
            onChange={handleNameInput}
            placeholder='Current Name Displayed here?...'
          />
          <button onClick={handleNameChange}>Save</button>
          </h4>

        <h4>Bio
        <input
            type="text"
            value={bioInput}
            onChange={handleBioInput}
            placeholder="current bio displayed here..."
          />
          <button onClick={handleBioChange}>Save</button>
          </h4>
        
        <h4>Email:
          <input
            type="text"
            value={emailInput}
            onChange={handleEmailInput}
            placeholder="current email displayed here..."
          />
          <button onClick={handleEmailChange}>Save</button>
        </h4>
        
        <h4>Password:</h4>
          <h5>Display Password with *** ??</h5>
    </div>
  );
}

export default EditProfile;