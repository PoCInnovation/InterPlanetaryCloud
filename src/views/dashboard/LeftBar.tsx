import React from "react";
import UploadButton from "../../app/components/buttons/UploadButton";
import {OrbitDocuments} from "../../types/Orbit";
import {IPCFile} from "../../types/File";
import "./LeftBar.css";

export type LeftBarProps = {
    email: string,
    userDocs: OrbitDocuments,
    setUserDocs: React.Dispatch<OrbitDocuments>,
    setFiles: React.Dispatch<IPCFile[] | null>,
};

const LeftBar: React.FC<LeftBarProps> = props => {
    return (
        <div className="left-bar-container bg-white">
            <h4>{props.email}</h4>
            <UploadButton
                userDocs={props.userDocs}
                setUserDocs={props.setUserDocs}
                setFiles={props.setFiles || []}
            />
        </div>
    );
}

export default LeftBar;
