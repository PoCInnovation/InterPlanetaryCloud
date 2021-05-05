import React, { useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import UploadButton from '../components/button/UploadButton.js';
import {DownloadButton} from '../components/button/DownloadButton';
import {Signup} from '../components/forms/Signup';
import {Login} from '../components/forms/Login';
import './App.css';

const IPFS = require('ipfs-http-client');

function App() {
    const ipfs = IPFS('http://localhost:5001');
    const [fileHash, setFileHash] = useState("");

    return (
        <div className="app">
            <BrowserRouter>
                <Route path="/signup">
                    <div className="signup-route">
                        <h3>Inter Planetary Cloud</h3>
                        <Signup></Signup>
                    </div>
                </Route>
                <Route path="/login">
                    <div className="login-route">
                        <h3>Inter Planetary Cloud</h3>
                        <Login></Login>
                    </div>
                </Route>
                <Route path="/dashboard">
                    <h1>Inter Planetary Cloud</h1>
                    <h3>Upload a file</h3>
                    <UploadButton ipfs={ipfs} setFileHash={setFileHash}/>
                    {fileHash ? <div id="success">{'Success: ' + fileHash}</div> : null}
                    <DownloadButton ipfs={ipfs}/>
                </Route>
            </BrowserRouter>
        </div>
    );
}

export default App;
