import React from "react";
import fileDownload from "js-file-download";
import all from "it-all";
import concat from "it-concat";
import CryptoJS from "crypto-js";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { JWT_SECRET } from "config/environment";

/// Download the content of a file from IPFS via the client & hash, then extract it via the setter.
async function downloadFromIPFS(ipfs: any, hash: string): Promise<string | undefined> {
    let fileContent;
    try {
        /// TODO: Find better type annotations for this section.
        const result: Array<any> = await all(ipfs.get(hash));
        const bufferList: any = await concat(result[0].content);
        const hashFileContent = bufferList._bufs[0].toString();
        /// TODO: Again, mut find alternative to this ugly cast.
        const password = (jwt.verify(localStorage.token, JWT_SECRET as Secret) as JwtPayload).password;
        const bytes = CryptoJS.AES.decrypt(hashFileContent, password);
        fileContent = bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.log(error);
    }
    return fileContent;
}

export type DownloadButtonProps = {
    ipfs: any,
};

/// Retrieves file from IPFS.
const DownloadButton: React.FC<DownloadButtonProps> = props => {
    const [hash, setHash] = React.useState("");

    const handleClick = async () => {
        if (!hash) return;
        try {
            const data = await downloadFromIPFS(props.ipfs, hash);
            /// TODO: Fix this ugly cast too.
            const blob = new Blob([data as string]);
            fileDownload(blob, hash + ".txt");
        } catch (error) {
            console.log(error);
        }
    };

    const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            <button
                className="p-2 -4 bg-blue-600 text-white rounded shadow-md"
                onClick={handleClick}>
                Download
            </button>
        </div>
    );
}

export default DownloadButton;
