import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import OrbitDB from "orbit-db";

import Ipfs from "../config/Ipfs";

import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import "./App.css";

function App() {
    const [orbit_db, setOrbitDB] = useState(null);

    useEffect(() => {
        async function initInstance() {
            setOrbitDB(await OrbitDB.createInstance(Ipfs));
        }
        initInstance();
    });

    return (
        <div className="app">
            <BrowserRouter>
                <Switch>
                    <Route exact path="/">
                        <HomePage />
                    </Route>
                    <Route path="/signup">
                        <SignupPage orbit_db={orbit_db} />
                    </Route>
                    <Route path="/login">
                        <LoginPage orbit_db={orbit_db} />
                    </Route>
                    <Route path="/dashboard">
                        <DashboardPage ipfs={Ipfs} />
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
