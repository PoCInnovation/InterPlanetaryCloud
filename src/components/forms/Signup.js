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
        e.preventDefault()

        const users = await orbit_db.keyvalue('/orbitdb/zdpuAvYaDhCxMxk9ATkUWLCkMYkm1oXfR1H2GNAKssWHPmBaA/ipc.users');

        await users.load()
        if (password !== repeatPassword) {
            console.log("password doesn't matches with repeat password")
        } else if (users.get(email) !== undefined) {
            console.log("user already exists")
        } else {
            const user = await orbit_db.docs('ipc.user.' + email)

            await user.put({_id: email, password: password, data: {}})
            await users.put(email, {_id: user.address.toString()})
            console.log(user)
        }
    }

    /*const signUp = async (e) => {
        e.preventDefault()

        console.log("here 1")
        const db = await orbit_db.docs('/orbitdb/zdpuAwTKuRHqs7m5ecoD3yXJ6csM26MWmakdUJKCyKyDPyaDy/ipc.users',
            {indexBy: 'email'});
        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());

        await db.load()
        if (db.get(email) !== null) {
            console.log("user exist!")
            return
        }
        if (password !== repeatPassword) {
            console.log("password doesn't matches with repeat password")
            return
        }
        await db.put({_id: email, email: email, username: username, password: hashedPassword})
        console.log('user created')
        console.log(db.get(email))
    } */

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
                    <input type="password" id="name" name="user_password" onChange={passwordChange}/>
                </div>
                <div className="signup-form-field">
                    <label>confirm-password</label>
                    <input type="password" id="name" name="user_repeat_password" onChange={repeatPasswordChange}/>
                </div>
                <div className="signup-submit-btn">
                    <button type="submit">Sign Up</button>
                </div>
            </form>
        </div>
    );
}
