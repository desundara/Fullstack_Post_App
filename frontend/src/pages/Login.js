import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setAuthState } = useContext(AuthContext);
    const navigate = useNavigate();

    const login = (e) => {
        e.preventDefault(); // prevent page refresh
        const data = { username, password };

        // ✅ Use environment variable for backend URL
        axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, data)
            .then((response) => {
                if (response.data.error) {
                    alert(response.data.error);
                } else {
                    // Save JWT token in localStorage
                    localStorage.setItem("accessToken", response.data.token);
                    setAuthState({
                        username: response.data.username,
                        id: response.data.id,
                        status: true
                    });
                    alert("Login successful!");
                    navigate("/"); // Navigate to homepage after login
                }
            })
            .catch((err) => {
                console.error("Login error:", err);
                alert("Login failed. Please try again.");
            });
    };

    return (
        <div className="loginPage">
            <form onSubmit={login}>
                <label>Username: </label>
                <input
                    type='text'
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label>Password: </label>
                <input
                    type='password'
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
