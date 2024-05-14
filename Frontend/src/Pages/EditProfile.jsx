import React, { useState} from 'react';
import "../styles/EditProfile.css"
  
export default function EditProfile () {
    const [name, setName] = useState('');
    const handleChange = (event) => {
        setName(event.target.value);
    };

  return (
    <div>
      <h1>Edit Profile</h1>
          <h4>Name: 
          <input
            type="text"
            value={name}
            onChange={handleChange}
            placeholder='Current Name Displayed here?...'
          />
          <input type="submit" value='Save'/>
          </h4>
        <p>You Typed: {name}</p>
        
        <h4>Bio
        <input
            type="text"
            value={name}
            onChane={handleChange}
            placeholder="current bio displayed here..."
          />
          <input type="submit" value='Save'/>
          </h4>
        
        <h4>Email:
          <h5>Display Email...</h5>
        </h4>
        
        <h4>Passworld:</h4>
          <h5>Display Password with *** ??</h5>
    </div>
  );
}