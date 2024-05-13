import React, { useState} from 'react';
import "./EditProfile.css";
  
function EditProfile () {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [email, setEmail] = useState('');

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleBioChange = (event) => {
      setBio(event.target.value);
    };

    const handleEmailChange = (event) => {
      setEmail(event.target.value);
    };

  return (
    <div>
      <h1>Edit Profile</h1>
          <h4>Name: 
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder='Current Name Displayed here?...'
          />
          <input type="submit" value='Save'/>
          </h4>

        <h4>Bio
        <input
            type="text"
            value={bio}
            onChange={handleBioChange}
            placeholder="current bio displayed here..."
          />
          <input type="submit" value='Save'/>
          </h4>
        
        <h4>Email:
          <input
            type="text"
            value={email}
            onChange={handleEmailChange}
            placeholder="current email displayed here..."
          />
          <input type="submit" value='Save'/>
        </h4>
        
        <h4>Passworld:</h4>
          <h5>Display Password with *** ??</h5>
    </div>
  );
}

export default EditProfile;