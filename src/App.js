import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home"; 
import AddTrophy from "./AddTrophy";
import EditTrophy from "./EditTrophy";
import AllTrophies from './AllTrophies';
import ResetPassword from "./ResetPassword"; 



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} /> 
        <Route path="/add" element={<AddTrophy />} />
        <Route path="/edit/:id" element={<EditTrophy />} />
        <Route path="/trophies" element={<AllTrophies />} /> 
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;

