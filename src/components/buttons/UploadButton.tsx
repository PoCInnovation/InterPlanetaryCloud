import CryptoJS from "crypto-js";
import React from "react";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { nanoid } from "nanoid";
import { JWT_SECRET } from "config/environment";
import { IPCFile } from "../../types/file";
import {useDocumentsContext} from "../../contexts/documents";

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
    setFiles: React.Dispatch<Array<IPCFile> | null>,
};

const UploadButton: React.FC<UploadButtonProps> = props => {
    const { userDocs, refresh } = useDocumentsContext();

    const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const filename = extractFilename(event.target.value);
            const fileContent = await getFileContent(event.target.files ? event.target.files[0] : []);
            if (filename === "" || fileContent === "") return;
            await userDocs.put({
                _id: nanoid(),
                name: filename,
                created_at: Date.now(),
                content: fileContent,
                data: {},
            });
            refresh();
            props.setFiles(await userDocs.get(""));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <input onChange={uploadFile} type="file" />
        </div>
    );
}

export default UploadButton;
