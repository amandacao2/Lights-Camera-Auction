import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./signup";
import Login from "./login";
import Directory from "./directory";
import Admin from "./admin";
import Landing from "./landing";
// import "./landing.css";

const App = () => {
  return (
    
    <Router>
      <Routes>
        {/* Define the default route for Landing */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;
