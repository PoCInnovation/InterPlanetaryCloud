import React, { useState } from 'react';
import './Login.css'

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const emailChange = (event) => setEmail(event.target.value)
    const passwordChange = (event) => setPassword(event.target.value)

    const displayInfos = () => {
        console.log("email = " + email)
        console.log("password = " + password)
    }

    return (
        <div className="login-container">
            <form className="login-form" /*action="/dashboard" method="get"*/>
                <div className="login-form-field">
                    <label>email</label>
                    <input type="email" id="email" name="user_email" onChange={emailChange}></input>
                </div>
                <div className="login-form-field">
                    <label>password</label>
                    <input type="text" id="name" name="user_password" onChange={passwordChange}></input>
                </div>
                <div className="login-submit-btn">
                    <button type="submit" onClick={displayInfos}>Log In</button>
                </div>
            </form>
        </div>
    );
}