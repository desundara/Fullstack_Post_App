import React, { useState } from 'react';
import axios from 'axios';

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const changepassword = () => {
        if (!oldPassword || !newPassword) {
        alert("Please fill in both fields");
        return;
        }

        // ✅ Use environment variable for deployed backend
        axios.put(`${process.env.REACT_APP_API_URL}/auth/changepassword`, {
        oldPassword,
        newPassword,
        }, {
        headers: {
            accessToken: localStorage.getItem("accessToken"),
        },
        })
        .then((response) => {
        console.log("Response:", response.data);
        if (response.data.error) {
            alert(response.data.error);
        } else {
            alert("Password changed successfully!"); // Success alert
            setOldPassword("");
            setNewPassword("");
        }
        })
        .catch((error) => {
        console.error("Error changing password:", error);
        alert("Failed to change password");
        });
    }

    return (
        <div className="changePasswordContainer">
        <div className="changePasswordBox">
            <h3>Change Password</h3>

            <input
            type="password"
            placeholder="Old Password..."
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            />

            <input
            type="password"
            placeholder="New Password..."
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            />

            <button onClick={changepassword}>Save Changes</button>
        </div>
        </div>
    );
}

export default ChangePassword;
