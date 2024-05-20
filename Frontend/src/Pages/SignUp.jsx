
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
        const check = await fetch(`http://localhost:5050/users/check?username=${username}`, {
          method: 'GET',
          credentials: 'include'
        });
        const checkResponse = await check.json();
        console.log(checkResponse);
        if(checkResponse.bad){
          const errorText = await response.text();
          console.error('Error 1:', errorText);
          throw new Error('Failed to check usernames.');
        }
        if(checkResponse.username){
          console.log("Username already in use, please choose a different username");
          doesExist = true;
        } else{
          doesExist = false;
        }
      } catch (err){
        console.error('Error 2:', err);
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
            console.error('Error 3: ', errorText);
            throw new Error('Failed to create user: ');
          }
        } catch (error) {
          console.error('Error 4:', error);
          alert('Failed to create user.');
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
          type='password'
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
