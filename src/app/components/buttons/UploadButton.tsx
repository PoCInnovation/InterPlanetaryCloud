import CryptoJS from "crypto-js";
import React from "react";
import jwt, {JwtPayload, Secret} from "jsonwebtoken";
import { nanoid } from "nanoid";
import { JWT_SECRET } from "config/environment";
import "./UploadButton.css";
import {OrbitDocuments} from "../../../types/Orbit";
import {IPCFile} from "../../../types/File";

/// Extract the filename from a filepath.
function extractFilename(filepath: string) {
    const result = /[^\\]*$/.exec(filepath);
    return result && result.length ? result[0] : "";
}

/// TODO: Fix type annotation of file.
function getFileContent(file: any) {
    return new Promise((resolve, reject) => {
        const reader = new window.FileReader();
        /// TODO: Fix dirty cast.
        const password = (jwt.verify(localStorage.token, JWT_SECRET as Secret) as JwtPayload).password;
        let hashFileContent = "";
        /// TODO: Find type annotation of event.
        reader.onload = function (event: any) {
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

export type UploadButtonProps = {
    userDocs: OrbitDocuments,
    setUserDocs: React.Dispatch<OrbitDocuments>,
    setFiles: React.Dispatch<Array<IPCFile> | null>,
};

const UploadButton: React.FC<UploadButtonProps> = props => {
    const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const filename = extractFilename(event.target.value);
            const fileContent = await getFileContent(event.target.files ? event.target.files[0] : []);
            if (filename === "" || fileContent === "") return;
            await props.userDocs.put({
                _id: nanoid(),
                name: filename,
                created_at: Date.now(),
                content: fileContent,
                data: {},
            });
            props.setUserDocs(props.userDocs);
            props.setFiles(await props.userDocs.get(""));
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
