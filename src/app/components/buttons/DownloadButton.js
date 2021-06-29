import React from "react";
import Button from "@material-ui/core/Button";
import "./DownloadButton.css";

import fileDownload from "js-file-download";
import all from "it-all";
import concat from "it-concat";

import CryptoJS from "crypto-js";

import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../../../config/Environment";

/**
 * Download the content of a file from IPFS via the client & hash, then extract it via the setter.
 * @param ipfs - IPFS Client.
 * @param hash {string} - Hash of a file on IPFS.
 * @returns {Promise<void>}
 */
async function downloadFromIPFS(ipfs, hash) {
    let fileContent = undefined;

    try {
        const result = await all(ipfs.get(hash));
        const bufferList = await concat(result[0].content);
        const hashFileContent = bufferList._bufs[0].toString();
        const password = jwt.verify(localStorage.token, JWT_SECRET).password;
        const bytes = CryptoJS.AES.decrypt(hashFileContent, password);
        fileContent = bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.log(error);
    }

    return fileContent;
}

/**
 * Component Function used to retrieve a file from IPFS based on user's input.
 * Test hash: QmPKby2sr2fxeEpxeGVuevGsvSVd1Hs37JBR9QSuWrvzuV -- my_world file from Alex & Theo
 * @param ipfs - IPFS Client.
 * @returns {JSX.Element}
 * @constructor
 */
function DownloadButton({ ipfs }) {
    const [hash, setHash] = React.useState("");

    const handleClick = async () => {
        if (!hash) return;

        try {
            const data = await downloadFromIPFS(ipfs, hash);
            const blob = new Blob([data]);
            fileDownload(blob, hash + ".txt");
        } catch (error) {
            console.log(error);
        }
    };

    const inputOnChange = (event) => {
        setHash(event.target.value);
    };

    return (
        <div className="download-container">
            <input
                className="download-input"
                onChange={inputOnChange}
                type="text"
                name="HashField"
            />
            <Button
                className="download-button"
                onClick={handleClick}
                variant="contained"
                color="primary"
            >
                Download
            </Button>
        </div>
    );
}

export default DownloadButton;
