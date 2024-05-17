
export default function SignUp() {    
    var username = '';
    var password = '';
    var doesExist = false;

    const handleSubmission = async (event) => {
      event.preventDefault(); 
      username = event.target.username.value;
      password = event.target.password.value;

      //First check to see if the username already exists
      try {
        const check = await fetch(`http://localhost:5050/user/check?username=${username}`, {
          method: 'GET',
          credentials: 'include'
        });
        const checkResponse = await check.json();

        if(checkResponse.bad){
          const errorText = await response.text();
          console.error('Failed to check usernames:', errorText);
          throw new Error('Failed to check usernames.');
        }
        if(checkResponse.username){
          console.log("Username already in use, please choose a different username");
          doesExist = true;
        } else{
          doesExist = false;
        }
      } catch (err){
        console.error('Error checking usernames present:', err);
        alert('Failed to check usernames.');
      }
      
      if(!doesExist){
        try {
          const formDataToSend = new FormData();
          formDataToSend.append('username', username); //replace username with event....
          formDataToSend.append('password', password);
  
          const response = await fetch('http://localhost:5050/user/upload', {
            method: 'POST',
            credentials: 'include',
            body: formDataToSend
          });
    
          if (response.ok) {
            alert('User created saved successfully!');
          } else {
            const errorText = await response.text();
            console.error('Failed to save post:', errorText);
            throw new Error('Failed to save post.');
          }
        } catch (error) {
          console.error('Error submitting post:', error);
          alert('Failed to save post.');
        }
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