import React from 'react';
import Button from '@material-ui/core/Button';
import './DownloadButton.css'

const fileDownload = require('js-file-download');
const all = require('it-all')
const concat = require('it-concat')

/**
 * Download the content of a file from IPFS via the client & hash, then extract it via the setter.
 * @param ipfs - IPFS Client.
 * @param hash {string} - Hash of a file on IPFS.
 * @returns {Promise<void>}
 */
async function downloadFromIPFS(ipfs, hash) {
    const result = await all(ipfs.get(hash));
    console.log(result)
    const fileContent = await concat(result[0].content);
    return (fileContent);
}

/**
 * Component Function used to retrieve a file from IPFS based on user's input.
 * Test hash: QmPKby2sr2fxeEpxeGVuevGsvSVd1Hs37JBR9QSuWrvzuV -- my_world file from Alex & Theo
 * @param ipfs - IPFS Client.
 * @returns {JSX.Element}
 * @constructor
 */
export function DownloadButton({ipfs}) {
    const [hash, setHash] = React.useState("");

    const handleClick = async () => {
        if (!hash)
            return;
        const data = await downloadFromIPFS(ipfs, hash);
        const blob = new Blob([data]);
        fileDownload(blob, hash + '.txt');
    }
    const inputOnChange = (event) => setHash(event.target.value);

    return (
        <div>
            <div id="download">
                <input id="download_input" onChange={inputOnChange} type="text" name="HashField"/>
                <Button id="download_button" onClick={handleClick} variant="contained" color="primary">
                    Download
                </Button>
            </div>
        </div>
    );
}