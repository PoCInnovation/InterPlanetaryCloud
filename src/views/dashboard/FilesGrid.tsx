import React from "react";
import FileCard from "components/cards/FileCard";
import {useFilesContext} from "contexts/files";

const FilesGrid: React.FC = props => {
    const { files } = useFilesContext();

    return (
        <div>
            <h3>{files.length - 1} files</h3>
            {files.map((file, i) => <FileCard key={i} file={file} /> )}
        </div>
    );
}

export default FilesGrid;
