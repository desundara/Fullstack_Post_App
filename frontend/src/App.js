import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Registration from "./pages/Registration";
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthContext } from './helpers/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
    loading: true,
  });

  useEffect(() => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    axios.get("http://localhost:3001/auth/auth", { headers: { accessToken: token } })
      .then(res => {
        if (!res.data.error) setAuthState({ username: res.data.username, id: res.data.id, status: true, loading: false });
        else setAuthState({ status: false, loading: false });
      })
      .catch(() => setAuthState({ status: false, loading: false }));
  } else {
    setAuthState({ status: false, loading: false });
  }

  // 👇 handles token changes across tabs
  window.addEventListener("storage", () => {
    const tokenCheck = localStorage.getItem("accessToken");
    if (!tokenCheck) {
      setAuthState({ username: "", id: 0, status: false, loading: false });
    }
  });
}, []);

  const logout = () => {
  localStorage.removeItem("accessToken");
  setAuthState({ username: "", id: 0, status: false });
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{authState,setAuthState}}> 
        <Router>
          <div className='navbar'>
            {!authState.status ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/registration">Registration</Link>
            </>
            ) : (
              <>
                <Link to="/">Home Page</Link>
                <Link to="/createpost">Create A Post</Link>
              </>
            )}
              <button onClick={logout}>Logout</button>
            <h1>{authState.username}</h1>
          </div>

          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/createpost" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
            <Route path="/post/:id" element={<ProtectedRoute><Post /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/changepassword" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
            <Route path='*' exact element={<PageNotFound />} />
        
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
