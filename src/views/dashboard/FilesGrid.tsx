import React from "react";
import FileCard from "components/cards/FileCard";
import {useFilesContext} from "contexts/files";

const FilesGrid: React.FC = props => {
    const { files } = useFilesContext();

    return (
        <div>
            <h1 className={"uppercase text-gray-600 mb-2"}>All files</h1>
            <div className={"grid grid-cols-[repeat(3,minmax(0,1fr))] gap-4"}>
                {files.map((file, i) => <FileCard key={i} file={file} /> )}
            </div>
        </div>
    );
}

export default FilesGrid;
