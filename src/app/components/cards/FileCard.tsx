import React from "react";
import { IPCFile } from "types/File";
import "./FileCard.css";

export type FileCardProps = {
    file: IPCFile,
};

const FileCard: React.FC<FileCardProps> = props => {
    if (props.file.password) return <div></div>;
    return (
        <div className="file-card-container">
            <h3>name: {props.file.name}</h3>
            <h6>date: {new Date(props.file.created_at).toDateString()}</h6>
            <p className="temp" >content: {props.file.content} </p>
        </div>
    );
};

export default FileCard;
