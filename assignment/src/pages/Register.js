import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  //State Variables
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  //Funtion to fetch data from front end to back end
  async function registerUser(event) {
    console.log("Register Clicked")
    event.preventDefault()

    const response = await fetch ('http://localhost:1337/api/register', {
      method: "POST",   
      headers: {
          'Content-Type' : 'application/json'
        },

      body: JSON.stringify({
        name,
        email,
        password
      })
    })

    const data = await response.json()

    if(data.status === "ok") {
      navigate('/login')
    }
  }

  return (
  <div>
      <h1> Register </h1>
      <form onSubmit={registerUser}>
        <input value={name} onChange={(user) => setName(user.target.value)} type="text" placeholder="First Name" />
        <br/>
        <input value={email} onChange={(user) => setEmail(user.target.value)} type="email" placeholder="Email" />
        <br/>
        <input value={password} onChange={(user) => setPassword(user.target.value)} type="password" placeholder="Password" />
        <br/>
        <input type="submit" value="Register" />
      </form>
  </div>
  );
}

export default Register;
