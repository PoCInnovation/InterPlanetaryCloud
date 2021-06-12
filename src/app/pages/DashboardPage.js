import React, { useState } from "react";

import UploadButton from "../components/buttons/UploadButton";
import DownloadButton from "../components/buttons/DownloadButton";
import "./DashboardPage.css";

function DashboardPage({ ipfs }) {
    const [fileHash, setFileHash] = useState("");

    return (
        <div className="dashboard-page-container">
            <h1>Inter Planetary Cloud</h1>
            <div className="dashboard-box">
                <h3>Upload a file</h3>
                <UploadButton ipfs={ipfs} setFileHash={setFileHash} />
                {fileHash ? (
                    <div id="success">{"Success: " + fileHash}</div>
                ) : (
                    <div />
                )}
            </div>
            <div className="dashboard-box">
                <h3>Download a file</h3>
                <DownloadButton ipfs={ipfs} />
            </div>
        </div>
    );
}

export default DashboardPage;
