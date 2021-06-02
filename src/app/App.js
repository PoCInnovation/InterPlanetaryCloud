import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import OrbitDB from "orbit-db";
import UploadButton from '../components/button/UploadButton.js';
import {DownloadButton} from '../components/button/DownloadButton';
import {Signup} from '../components/forms/Signup';
import {Login} from '../components/forms/Login';
import Home from '../components/Home';
import './App.css';

const IPFS = require('ipfs-http-client');

function App() {
    const ipfs = IPFS('http://localhost:5001');
    const [orbit_db, setOrbitDB] = useState(null)
    const [fileHash, setFileHash] = useState("");
    const [token, setToken] = useState("no token");

    useEffect(() => {
        async function initInstance() {
            setOrbitDB(await OrbitDB.createInstance(ipfs))
        }
        initInstance()
    }, [ipfs])

    return (
        <div className="app">
            <BrowserRouter>
                <Switch>
                    <Route exact path="/">
                        <Home/>
                    </Route>
                    <Route path="/signup">
                        <div className="route-container">
                            <h3>Inter Planetary Cloud</h3>
                            <Signup orbit_db={orbit_db} setToken={setToken}/>
                        </div>
                    </Route>
                    <Route path="/login">
                        <div className="route-container">
                            <h3>Inter Planetary Cloud</h3>
                            <Login orbit_db={orbit_db} setToken={setToken}/>
                        </div>
                    </Route>
                    <Route path="/dashboard">
                        <div className="route-container">
                            <h1>Inter Planetary Cloud</h1>
                            <div className="dashboard-box">
                                <h3>Upload a file</h3>
                                <UploadButton ipfs={ipfs} setFileHash={setFileHash}/>
                                {fileHash ? <div id="success">{'Success: ' + fileHash}</div> : null}
                            </div>
                            <div className="dashboard-box">
                                <h3>Download a file</h3>
                                <DownloadButton ipfs={ipfs}/>
                            </div>
                        </div>
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
