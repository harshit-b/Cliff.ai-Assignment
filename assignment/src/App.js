import * as React from "react";
import { Routes, Route} from "react-router-dom";
import "./App.css";
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Subscriptions from "./pages/Subscriptions"

function App() {
  return (
    <div className="App">
      <h1>Welcome!</h1>
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