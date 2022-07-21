import * as React from "react";
import { Routes, Route, Link} from "react-router-dom";
import "./App.css";
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Subscriptions from "./pages/Subscriptions"

function App() {
  return (
    <div className="App">
      <h1>Welcome!</h1>
      New user? Please Rigister!

      <Link to="/register">
        <button type="button">
              Register
        </button>
      </Link>

      <br></br>

      Already registered? Please login!
      
      <Link to="/login">
        <button type="button">
              Login
        </button>
      </Link>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/subscriptions" element={<Subscriptions />}/>
      </Routes>
    </div>
  );
}

export default App;