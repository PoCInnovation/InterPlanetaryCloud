import React, { useState } from "react";
import "./Login.css";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../../../config/Environment";

function Login({ orbitDB, usersKV, setUserDocs }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const emailChange = (event) => setEmail(event.target.value);
    const passwordChange = (event) => setPassword(event.target.value);

    const logIn = async (e) => {
        e.preventDefault();

        try {
            await usersKV.load();
            const userId = await usersKV.get(email);
            let validPassword = undefined;
            let userDocs = undefined;

            if (userId) {
                userDocs = await orbitDB.docs(userId._id);
                await userDocs.load();
                const hash = await userDocs.get(email)[0].password;
                validPassword = bcrypt.compareSync(password, hash);
            }
            if (!userId || !validPassword) {
                console.log("Invalid email or password");
                return;
            }
            const payload = {
                email,
                password,
                docsAddress: userId._id,
            };
            const token = jwt.sign(payload, JWT_SECRET);
            localStorage.setItem("token", token);
            setUserDocs(userDocs);
            console.log(localStorage.token);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={async (e) => await logIn(e)}>
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
