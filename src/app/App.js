import React, { useState } from 'react';
import UploadButton from '../components/button/UploadButton.js';

const IPFS = require('ipfs-http-client');

function App() {
    const ipfs = IPFS('http://localhost:5001');
    const [fileHash, setFileHash] = useState("");

    return (
        <div className="App">
            <h1>Inter Planetary Cloud</h1>
            <h3>Upload a file</h3>
            <UploadButton ipfs={ ipfs } setFileHash= { setFileHash }/>
            {fileHash ? <div id="success">{'Success: ' + fileHash}</div> : null}
        </div>
    );
}

export default App;
