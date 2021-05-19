import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import UploadButton from '../components/button/UploadButton.js';
import {DownloadButton} from '../components/button/DownloadButton';
import {Signup} from '../components/forms/Signup';
import {Login} from '../components/forms/Login';
import Home from '../components/Home';
import './App.css';

const IPFS = require('ipfs-http-client');
const Identities = require('orbit-db-identity-provider');

async function identitiesTests() {
    var options = { id: 'my personnal id 1' };
    var identity = await Identities.createIdentity(options);
    console.log(identity.toJSON());
    var id = await identity.id;
    console.log(id);
    var valid = await Identities.verifyIdentity(identity);
    console.log(valid);

    var options = { id: 'my personnal id 2' };
    var identity = await Identities.createIdentity(options);
    console.log(identity.toJSON());
    var id = await identity.id;
    console.log(id);
    var valid = await Identities.verifyIdentity(identity);
    console.log(valid);
}

identitiesTests();

function App() {
    const ipfs = IPFS('http://localhost:5001');
    const [fileHash, setFileHash] = useState("");


    return (
        <div className="app">
            <BrowserRouter>
                <Switch>
                    <Route exact path="/">
                        <Home></Home>
                    </Route>
                    <Route path="/signup">
                        <div className="route-container">
                            <h3>Inter Planetary Cloud</h3>
                            <Signup></Signup>
                        </div>
                    </Route>
                    <Route path="/login">
                        <div className="route-container">
                            <h3>Inter Planetary Cloud</h3>
                            <Login></Login>
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
                                <h3>Downlod a file</h3>
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
