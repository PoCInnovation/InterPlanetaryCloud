import React from "react";
import {IPCFile} from "types/file";

export type TFilesContext = null | {
    files: IPCFile[],
    setFiles: React.Dispatch<IPCFile[]>
};

const FilesContext = React.createContext<TFilesContext>(null);

export function useFilesContext() {
    const context = React.useContext(FilesContext);

    if (context === null) {
        throw new Error("context used outside of provider.");
    }
    return context;
}

export default FilesContext;