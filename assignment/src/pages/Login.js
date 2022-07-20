import {useState} from 'react'

function Login() {
  //State Variables
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  //Funtion to fetch data from front end to back end
  async function loginUser(event) {
    console.log("login clicked")
    event.preventDefault()

    const response = await fetch ('http://localhost:1337/api/login', {
      method: "POST",   
      headers: {
          'Content-Type' : 'application/json'
        },

      body: JSON.stringify({
        name,
        password
      })
    })

    const data = await response.json()

    if (data.user) {
      localStorage.setItem('token', data.user)
      alert('Login Successful')
      window.location.href = "/subscriptions"
    } else {
      alert("Please Check your username and password")
    }
  }


  return (
  <div>
      <h1> Login </h1>
      <form onSubmit={loginUser}>
        <input value={name} onChange={(user) => setName(user.target.value)} type="text" placeholder="First Name" />
        <br/>
        <input value={password} onChange={(user) => setPassword(user.target.value)} type="password" placeholder="Password" />
        <br/>
        <input type="submit" value="login" />
      </form>
  </div>
  );
}

export default Login;
