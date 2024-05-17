
export default function SignUp() {    
    var username = '';
    var password = '';
    const handleSubmission = async (event) => {
      event.preventDefault(); 
      username = event.target.username.value;
      password = event.target.password.value;
      console.log("Created an Account");
      console.log("Username: " + username);
      console.log("Password: " + password);
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('username', username);
        formDataToSend.append('password', password);
  
        const response = await fetch('http://localhost:5050/user/upload', {
          method: 'POST',
          credentials: 'include',
          body: formDataToSend
          //body: JSON.stringify(formData)
        });
  
        if (response.ok) {
          alert('User created saved successfully!');
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

  return(
    <div className='container'>
    <div className='header'>
      <h1>Signup</h1>
    </div>
    <div className='input'>
      <form onSubmit={handleSubmission}>
        <label htmlFor='Username'>Username:</label>
        <input
          type='text'
          id='username'
          placeholder='Enter your Username'
          required
        />
        <label htmlFor='password'>Password:</label>
        <input
          type='text'
          id='password'
          placeholder='Enter your password'
          required
        />
        <button type='submit'>Signup</button>
      </form>
    </div>
  </div>
);
}