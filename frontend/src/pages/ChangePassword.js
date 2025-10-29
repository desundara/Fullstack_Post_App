import React, {useState} from 'react'
import axios from 'axios'

function ChangePassword() {

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const changepassword = () => {
        if (!oldPassword || !newPassword) {
            alert("Please fill in both fields");
            return;
        }

        axios.put("http://localhost:3001/auth/changepassword", {
            oldPassword: oldPassword, 
            newPassword: newPassword,
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
                alert("Password changed successfully!"); //Success alert
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
            onChange={(event) => {
                setOldPassword(event.target.value);
            }}
            />

            <input
            type="password"
            placeholder="New Password..."
            onChange={(event) => {
                setNewPassword(event.target.value);
            }}
            />

            <button onClick={changepassword}>Save Changes</button>
        </div>
    </div>

    )  
}

export default ChangePassword