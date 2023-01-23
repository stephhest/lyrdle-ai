import { useEffect, useState } from "react";
import Construct from "./Construct.js";
import ErrorNotification from "./ErrorNotification";
import "./App.css";
import Navbar from "./components/Navbar.js";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { AuthProvider, useToken } from "./authApi";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Logout from "./pages/Logout";

function GetToken() {
  // Get token from JWT cookie (if already logged in)
  useToken();
  return null;
}
// function App() {
//   const [launch_info, setLaunchInfo] = useState([]);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(null);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <GetToken />
        <Routes>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
