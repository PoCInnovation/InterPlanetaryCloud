import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

/**
 * Upload the content of a file to IPFS via the client and save the file's hash.
 * @param ipfs - IPFS Client.
 * @param fileContent {string} - Content of the file to upload.
 * @returns the hash of the uploaded file
 */
async function uploadToIPFS(ipfs, fileContent, setFileHash) {
    const result = await ipfs.add(fileContent);
    return result.path;
}

/**
 * Extract the filename from a filepath.
 * @param filepath {string} - Source of the name.
 * @returns the file name.
 */
function extractFileName(filepath) {
    const result = /[^\\]*$/.exec(filepath)[0];
    return result;
}

/**
 * Creates a FileReader to read a file and use the setter to extract it.
 * @param file - File to retrieve the content from.
 * @returns the file content.
 */
function getFileContent(file) {
    var content = "";
    let reader = new window.FileReader();
    reader.onload = (event) => content = event.target.result;
    reader.readAsText(file);
    return content;
}

/**
 * Component Function used to retrieve a file from the user's machine & upload it to IPFS.
 * @param ipfs - IPFS Client.
 * @returns {JSX.Element}
 * @constructor
 */
class UploadButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileField: null,
            fileName: "",
            fileContent: "",
            // fileHash: ""
        };
    }

    render() {
        const inputOnChange = async (event) => {
            this.state.fileName = extractFileName(event.target.value);
            this.state.fileContent = getFileContent(event.target.files[0]);
        };
        const buttonOnClick = async () => {
            // TODO --> https://github.com/PoCInnovation/ResearchShare/blob/master/src/components/submit_paper/ButtonUpload.js
            return;
        };

        return (
            <div>
                <div id="upload">
                    <Input placeholder='Field' onChange={(event) => this.state.fileField = event.target.value} />
                    <input id="upload_input" onChange={inputOnChange} type="file"/>
                    <Button id="upload_button" onClick={buttonOnClick} variant="contained" color="primary">Upload</Button>
                </div>
                {/*<br/>*/}
                {/*{fileHash ? <div id="success">{'Success: ' + fileHash}</div> : null}*/}
            </div>
        );
    }
}

export default UploadButton;
