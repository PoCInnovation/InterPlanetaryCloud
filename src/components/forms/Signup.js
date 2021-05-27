import React, { useState } from 'react';
import './Signup.css'

const bcrypt = require('bcryptjs');
const interfaceIpfsCore = require('interface-ipfs-core');

export function Signup({orbit_db}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const emailChange = (event) => setEmail(event.target.value)
    const passwordChange = (event) => setPassword(event.target.value)
    const repeatPasswordChange = (event) => setRepeatPassword(event.target.value)

    const signUp = async (e) => {
    }

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={(e) => signUp(e)}>
                <div className="signup-form-field">
                    <label>email</label>
                    <input type="email" id="email" name="user_email" onChange={emailChange}/>
                </div>
                <div className="signup-form-field">
                    <label>password</label>
                    <input type="password" id="password" name="user_password" onChange={passwordChange}/>
                </div>
                <div className="signup-form-field">
                    <label>confirm-password</label>
                    <input type="password" id="confirm-password" name="user_repeat_password" onChange={repeatPasswordChange}/>
                </div>
                <div className="signup-submit-btn">
                    <button type="submit">Sign Up</button>
                </div>
            </form>
        </div>
    );
}
