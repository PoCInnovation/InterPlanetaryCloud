import React, { useState } from "react";
import "./Login.css";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import { JWT_SECRET, KEYVALUE_DB_ADDRESS } from "../../../config/Environment";

function Login({ orbit_db }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const emailChange = (event) => setEmail(event.target.value);
    const passwordChange = (event) => setPassword(event.target.value);

    const logIn = async (e) => {
        e.preventDefault();

        try {
            const users = await orbit_db.keyvalue(KEYVALUE_DB_ADDRESS);
            let validPassword = undefined;

            await users.load();
            const userId = await users.get(email);

            if (userId) {
                const user = await orbit_db.docs(userId._id);
                await user.load();
                const hash = await user.get(email)[0].password;
                validPassword = bcrypt.compareSync(password, hash);
            }
            if (!userId || !validPassword) {
                console.log("Invalid email or password");
                return;
            }
            const payload = {
                email,
                password,
            };
            const token = jwt.sign(payload, JWT_SECRET);
            localStorage.setItem("token", token);
            console.log(localStorage.token);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={(e) => logIn(e)}>
                <div className="login-form-field">
                    <label>email</label>
                    <input
                        type="email"
                        id="email"
                        name="user_email"
                        onChange={emailChange}
                    />
                </div>
                <div className="login-form-field">
                    <label>password</label>
                    <input
                        type="password"
                        id="name"
                        name="user_password"
                        onChange={passwordChange}
                    />
                </div>
                <div className="login-submit-btn">
                    <button type="submit">Log In</button>
                </div>
            </form>
        </div>
    );
}

export default Login;
