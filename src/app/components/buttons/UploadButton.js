import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import "./UploadButton.css";

import CryptoJS from "crypto-js";

import jwt from "jsonwebtoken";

import { nanoid } from "nanoid";

import { JWT_SECRET } from "../../../config/Environment";

/**
 * Extract the filename from a filepath.
 * @param filepath {string} - Source of the name.
 * @param setFilename - Setter from `React.useState` to retrieve the name of the file.
 */
function extractFilename(filepath, setFilename) {
    const result = /[^\\]*$/.exec(filepath)[0];

    setFilename(result);
}

/**
 * Creates a FileReader to read a file and use the setter to extract it.
 * @param file - File to retrieve the content from.
 * @param setFileContent - Setter from `React.useState` to retrieve the content of the file.
 */
function getFileContent(file, setFileContent) {
    const reader = new window.FileReader();
    const token = localStorage.token;
    const password = jwt.verify(token, JWT_SECRET).password;

    reader.onload = (event) => {
        const hashFileContent = CryptoJS.AES.encrypt(
            event.target.result,
            password
        ).toString();
        setFileContent(hashFileContent);
    };
    reader.readAsText(file);
}

/**
 * Component Function used to retrieve a file from the user's machine & upload it to IPFS.
 * @param ipfs - IPFS Client.
 * @param setFileHash
 * @returns {JSX.Element}
 * @constructor
 */
function UploadButton({ userDocs, setUserDocs, setFiles }) {
    const [filename, setFilename] = useState("");
    const [fileContent, setFileContent] = useState("");

    const inputOnChange = async (event) => {
        extractFilename(event.target.value, setFilename);
        getFileContent(event.target.files[0], setFileContent);
    };

    const buttonOnClick = async () => {
        if (filename === "" || fileContent === "") return;
        try {
            await userDocs.put({
                _id: nanoid(),
                name: filename,
                created_at: Date.now(),
                data: { content: fileContent },
            });
            setUserDocs(userDocs);
            setFiles(await userDocs.get(""));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="upload-container">
            <input
                className="upload-input"
                onChange={inputOnChange}
                type="file"
            />
            <Button
                className="upload-button"
                onClick={buttonOnClick}
                variant="contained"
                color="primary"
            >
                Upload
            </Button>
        </div>
    );
}

export default UploadButton;
