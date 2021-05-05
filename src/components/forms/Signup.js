import React, { useState } from 'react';
import './Signup.css'

export function Signup() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");

    const emailChange = (event) => setEmail(event.target.value)
    const usernameChange = (event) => setUsername(event.target.value)
    const passwordChange = (event) => setPassword(event.target.value)
    const confPasswordChange = (event) => setConfPassword(event.target.value)

    const displayInfos = () => {
        console.log("email = " + email)
        console.log("username = " + username)
        console.log("password = " + password)
        console.log("confPassword = " + confPassword)
    }

    return (
        <div className="signup-container">
            <form className="signup-form" /*action="/dashboard" method="get"*/>
                <div className="signup-form-field">
                    <label>email</label>
                    <input type="email" id="email" name="user_email" onChange={emailChange}></input>
                </div>
                <div className="signup-form-field">
                    <label>username</label>
                    <input type="text" id="name" name="user_username" onChange={usernameChange}></input>
                </div>
                <div className="signup-form-field">
                    <label>password</label>
                    <input type="text" id="name" name="user_password" onChange={passwordChange}></input>
                </div>
                <div className="signup-form-field">
                    <label>confirm-password</label>
                    <input type="text" id="name" name="user_conf_password" onChange={confPasswordChange}></input>
                </div>
                <div className="signup-submit-btn">
                    <button type="submit" onClick={displayInfos} >Sign Up</button>
                </div>
            </form>
        </div>
    );
}
