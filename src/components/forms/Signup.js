import React, { useState } from 'react';
import './Signup.css'

const bcrypt = require('bcryptjs');

export function Signup({orbit_db}) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const emailChange = (event) => setEmail(event.target.value)
    const usernameChange = (event) => setUsername(event.target.value)
    const passwordChange = (event) => setPassword(event.target.value)
    const repeatPasswordChange = (event) => setRepeatPassword(event.target.value)

    const signUp = async (e) => {
        var hashedPassword = "";
        e.preventDefault()

        /* const db = await orbit_db.docs('/orbitdb/zdpuAwTKuRHqs7m5ecoD3yXJ6csM26MWmakdUJKCyKyDPyaDy/ipc.users',
            {indexBy: 'email'}); */

        /* await db.load() */
        /* if (db.get(email) !== null) {
            console.log("user exist!")
            return
        } */
        if (password !== repeatPassword) {
            console.log("password doesn't matches with repeat password")
            return
        }
        hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
        /* await db.put({_id: email, email: email, username: username, password: hashedPassword}) */
        /* console.log('user created')
        console.log(db.get(email)) */
        console.log(`email = ${email}`)
        console.log(`username = ${username}`)
        console.log(`password = ${password}`)
        console.log(`hashedPassword = ${hashedPassword}`)
    }

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={(e) => signUp(e)}>
                <div className="signup-form-field">
                    <label>email</label>
                    <input type="email" id="email" name="user_email" onChange={emailChange}/>
                </div>
                <div className="signup-form-field">
                    <label>username</label>
                    <input type="text" id="name" name="user_username" onChange={usernameChange}/>
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
