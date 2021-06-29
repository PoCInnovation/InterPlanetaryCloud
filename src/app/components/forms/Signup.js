import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import "./Signup.css";

import { JWT_SECRET } from "../../../config/Environment";

const salt = bcrypt.genSaltSync(10);

function Signup({ orbitDB, usersKV, setUsersKV, setUserDocs }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const emailChange = (event) => setEmail(event.target.value);
    const passwordChange = (event) => setPassword(event.target.value);
    const repeatPasswordChange = (event) =>
        setRepeatPassword(event.target.value);

    const signUp = async (e) => {
        e.preventDefault();

        try {
            if (password !== repeatPassword) {
                console.log("password doesn't matches with repeat password");
                return;
            }
            await usersKV.load();
            let userDocs = await usersKV.get(email);
            if (userDocs) {
                console.log("user already exists");
                return;
            }
            userDocs = await orbitDB.docs("ipc.user." + email);
            const hash = bcrypt.hashSync(password, salt);
            await userDocs.put({ _id: email, password: hash, data: {} });
            await usersKV.put(email, { _id: userDocs.address.toString() });
            const payload = {
                email,
                password,
                docsAddress: userDocs.address.toString(),
            };
            const token = jwt.sign(payload, JWT_SECRET);
            localStorage.setItem("token", token);
            setUsersKV(usersKV);
            setUserDocs(userDocs);
        } catch (error) {
            console.log(error);
        }
    };

    const isUserLog = () => {
        return jwt.verify(
            localStorage.token,
            JWT_SECRET,
            function (err, decoded) {
                if (!err && decoded.docsAddress) return true;
                return false;
            }
        );
    };

    if (isUserLog()) return <Redirect to={"/dashboard"} />;

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={(e) => signUp(e)}>
                <div className="signup-form-field">
                    <label>email</label>
                    <input
                        type="email"
                        id="email"
                        name="user_email"
                        onChange={emailChange}
                    />
                </div>
                <div className="signup-form-field">
                    <label>password</label>
                    <input
                        type="password"
                        id="password"
                        name="user_password"
                        onChange={passwordChange}
                    />
                </div>
                <div className="signup-form-field">
                    <label>confirm-password</label>
                    <input
                        type="password"
                        id="confirm-password"
                        name="user_repeat_password"
                        onChange={repeatPasswordChange}
                    />
                </div>
                <div className="signup-submit-btn">
                    <button type="submit">Sign Up</button>
                </div>
            </form>
        </div>
    );
}

export default Signup;
