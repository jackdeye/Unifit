import React, { useState} from 'react';
  
function EditProfile () {
    const [name, setName] = useState('');
    const handleChange = (event) => {
        setName(event.target.value);
    };

  return (
    <div>
      <h1>Input Name</h1>
        <input
        type="text"
        value={name}
        onChange={handleChange}
        placeholder='Type Name...'
        />
        <p>You Typed: {name}</p>
    </div>
  );
}

export default EditProfile;