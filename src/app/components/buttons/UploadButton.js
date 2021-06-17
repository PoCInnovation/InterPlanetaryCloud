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
function extractFilename(filepath) {
    const result = /[^\\]*$/.exec(filepath)[0];

    return result;
}

function getFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new window.FileReader();
        const password = jwt.verify(localStorage.token, JWT_SECRET).password;
        let hashFileContent = "";

        reader.onload = function (event) {
            hashFileContent = CryptoJS.AES.encrypt(
                event.target.result,
                password
            ).toString();
            resolve(hashFileContent);
        };
        reader.onerror = function (event) {
            reject(event);
        };
        reader.readAsText(file);
    });
}

/**
 * Component Function used to retrieve a file from the user's machine & upload it to IPFS.
 * @param ipfs - IPFS Client.
 * @param setFileHash
 * @returns {JSX.Element}
 * @constructor
 */
function UploadButton({ userDocs, setUserDocs, setFiles }) {
    const uploadFile = async (event) => {
        try {
            const filename = extractFilename(event.target.value);
            const fileContent = await getFileContent(event.target.files[0]);
            if (filename === "" || fileContent === "") return;
            await userDocs.put({
                _id: nanoid(),
                name: filename,
                created_at: Date.now(),
                content: fileContent,
                data: {},
            });
            setUserDocs(userDocs);
            setFiles(await userDocs.get(""));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="upload-container">
            <input className="upload-input" onChange={uploadFile} type="file" />
        </div>
    );
}

export default UploadButton;
