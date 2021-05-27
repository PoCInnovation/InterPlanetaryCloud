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
        e.preventDefault()

        const users = await orbit_db.keyvalue('/orbitdb/zdpuAsw4HXJNPKRXWKmT78HpFmHyLkwbaXS3LKeZXQF6rLHsC/ipc.users');

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
