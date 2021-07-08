import React from "react";
import FileCard from "../../components/cards/FileCard";
import { IPCFile } from "../../types/file";

export type FilesGridProps = {
    files: IPCFile[];
};

const FilesGrid: React.FC<FilesGridProps> = props => {
    return (
        <div>
            <h3>{props.files.length - 1} files</h3>
            {props.files.map((file, i) => <FileCard key={i} file={file} /> )}
        </div>
    );
}

export default FilesGrid;
