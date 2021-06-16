import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import OrbitDB from "orbit-db";

import Ipfs from "../config/Ipfs";

import jwt from "jsonwebtoken";

import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import "./App.css";

import { KEYVALUE_DB_ADDRESS, JWT_SECRET } from "../config/Environment";

async function initOrbitDB(setOrbitDB, orbitDB) {
    if (!orbitDB) {
        console.log("Getting orbiDB ...");
        try {
            setOrbitDB(await OrbitDB.createInstance(Ipfs));
        } catch (error) {
            console.log(error);
        }
    }
}

async function initUsersKV(orbitDB, usersKV, setUsersKV) {
    if (orbitDB && !usersKV) {
        console.log("Getting usersKV ...");
        try {
            setUsersKV(await orbitDB.keyvalue(KEYVALUE_DB_ADDRESS));
        } catch (error) {
            console.log(error);
        }
    }
}

async function initUserDocs(orbitDB, userDocs, setUserDocs) {
    const token = localStorage.token;

    if (orbitDB && token && !userDocs) {
        console.log("Getting userDocs ...");
        jwt.verify(token, JWT_SECRET, async function (err, decoded) {
            if (err) return;
            try {
                setUserDocs(await orbitDB.docs(decoded.docsAddress));
            } catch (error) {
                console.log(error);
            }
        });
    }
}

function App() {
    const [orbitDB, setOrbitDB] = useState(null);
    const [usersKV, setUsersKV] = useState(null);
    const [userDocs, setUserDocs] = useState(null);

    useEffect(() => {
        async function initInstances() {
            await initOrbitDB(setOrbitDB, orbitDB);
            await initUsersKV(orbitDB, usersKV, setUsersKV);
            await initUserDocs(orbitDB, userDocs, setUserDocs);
        }
        initInstances();
    });

    return (
        <div className="app">
            <BrowserRouter>
                <Switch>
                    <Route exact path="/">
                        <HomePage />
                    </Route>
                    <Route path="/signup">
                        <SignupPage
                            orbitDB={orbitDB}
                            usersKV={usersKV}
                            setUsersKV={setUsersKV}
                            setUserDocs={setUserDocs}
                        />
                    </Route>
                    <Route path="/login">
                        <LoginPage
                            orbitDB={orbitDB}
                            usersKV={usersKV}
                            setUserDocs={setUserDocs}
                        />
                    </Route>
                    <Route path="/dashboard">
                        <DashboardPage
                            userDocs={userDocs}
                            setUserDocs={setUserDocs}
                        />
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
