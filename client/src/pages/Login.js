import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setAuthState} = useContext(AuthContext);
    const navigate = useNavigate();

    const login = () => {
        const data = { username: username, password: password };
        axios.post("http://localhost:3001/auth/login", data)
            .then((response) => {
                if (response.data.error) {
                    alert(response.data.error);
                } else {
                    // Assuming your backend returns { message: "...", token: "..." }
                    localStorage.setItem("accessToken", response.data.token);
                    setAuthState({username: response.data.username, id: response.data.id, status: true });
                    //sessionStorage.setItem("username", response.data.username); // Optional: store username
                    alert("Login successful!");
                    navigate("/"); //Navigate to homepage after login
                }
                })
            .catch((err) => {
                console.error(err);
                alert("Login failed. Please try again.");
            });
    };
    return (
        <div className="loginPage">
            <label>Username: </label>
            <input type='text'
            placeholder="Username"
            onChange={(event) => {
                setUsername(event.target.value);
            }}
            />
            <label>Password: </label>
            <input type='password' 
            placeholder="Password"
            onChange={(event) => {
                setPassword(event.target.value);
            }}
            />

            <button onClick={login}>Login</button>
        </div>
    );
}

export default Login