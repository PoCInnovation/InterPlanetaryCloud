import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import UploadButton from "../components/buttons/UploadButton";
/* import DownloadButton from "../components/buttons/DownloadButton"; */
import FilesGrid from "../components/grids/FilesGrid";
import "./DashboardPage.css";

import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../../config/Environment";

/*
0- Pas de responsive ni de redirection pour l'instant !
1- DONE Verifier le jwt: si invalid -> rien afficher, sinon dashboard actuel (modifier les autres vérifications)
2- UNDO Ajouter le docs id dans le jwt
3- DOING Quand upload, mettre le fichier dans le docs de l'utilisateur (ajouter date, ...)
4- DOING Récupérer ses fichiers et afficher leur nom
5- TODO Créer LeftBar
6- TODO Créer FileCard
7- TODO Quand download, remplacer hash par le nom du fichier
*/

async function loadUserDocs(userDocs) {
    if (userDocs) {
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

    if (await loadUserDocs(userDocs)) {
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
        await getFiles(userDocs, setFiles);
    }

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
            <h2>{email} dashboard</h2>
            <h4>Upload a file</h4>
            <UploadButton
                userDocs={userDocs}
                setUserDocs={setUserDocs}
                setFiles={setFiles}
            />
            <FilesGrid files={files} />
        </div>
    );
}

export default DashboardPage;
