import React from "react";

const FilesGrid: React.FC = props => {
    return (
        <div>
            <h1 className={"uppercase text-gray-600 mb-2"}>All files</h1>
            <div className={"grid grid-cols-[repeat(3,minmax(0,1fr))] gap-4"}>

            </div>
        </div>
    );
}

export default FilesGrid;
