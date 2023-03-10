
import "./styles/css/App.css";
import Navbar from "./components/Navbar.js";
import {
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { AuthProvider, useToken } from "./authApi";
import Create from "./pages/Create";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Logout from "./pages/Logout";

const domain = /https:\/\/[^/]+/;
const basename = process.env.PUBLIC_URL.replace(domain, "");

function GetToken() {
  useToken();
  return null;
}


function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={basename}>
        <Navbar />
        <GetToken />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/create" element={<Create />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
