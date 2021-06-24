import React from "react";
import FileCard from "../../app/components/cards/FileCard";
import {IPCFile} from "../../types/File";
import "./FilesGrid.css";

export type FilesGridProps = {
    files: IPCFile[];
};

const FilesGrid: React.FC<FilesGridProps> = props => {
    return (
        <div className="files-grid-container">
            <h3>{props.files.length - 1} files</h3>
            {props.files.map((file, i) => <FileCard key={i} file={file} /> )}
        </div>
    );
}

export default FilesGrid;
