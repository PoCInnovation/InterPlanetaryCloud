import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import LeftBar from "../components/navbars/LeftBar";
import FilesGrid from "../components/grids/FilesGrid";
import "./DashboardPage.css";

import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../../config/Environment";

async function loadUserDocs(userDocs) {
    if (userDocs) {
        console.log("Loading userDocs ...");
        try {
            await userDocs.load();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    return false;
}

async function getFiles(userDocs, setFiles) {
    let userFiles = null;
    const isLoad = await loadUserDocs(userDocs);

    if (isLoad) {
        console.log("Getting user files ...");
        try {
            userFiles = await userDocs.get("");
            setFiles(userFiles);
        } catch (error) {
            console.log(error);
        }
    }
}

function DashboardPage({ userDocs, setUserDocs }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [files, setFiles] = useState(null);

    const setVariables = async (decoded) => {
        if (!email) setEmail(decoded.email);
        if (!password) setPassword(decoded.password);
        if (!files) await getFiles(userDocs, setFiles);
    };

    const userIsLog = () => {
        const token = localStorage.token;

        return jwt.verify(token, JWT_SECRET, function (err, decoded) {
            if (err) return false;
            setVariables(decoded);
            return true;
        });
    };

    if (!userIsLog()) return <Redirect to={"/login"} />;

    return (
        <div className="dashboard-page-container">
            <LeftBar
                email={email}
                userDocs={userDocs}
                setUserDocs={setUserDocs}
                setFiles={setFiles}
            />
            <FilesGrid files={files} />
        </div>
    );
}

export default DashboardPage;
