import React from 'react';
import UploadButton from '../components/button/UploadButton.js'

const IPFS = require('ipfs-http-client')

function App() {
    const ipfs = IPFS('http://localhost:5001')

    return (
        <div className="App">
            <h1>Inter Planetary Cloud</h1>
            <h3>Upload a file</h3>
            <UploadButton ipfs={ ipfs }/>
        </div>
    );
}

export default App;
