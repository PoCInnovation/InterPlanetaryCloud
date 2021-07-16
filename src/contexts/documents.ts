import React from "react";

export type TDocumentsContext = null | {
    userDocs: any,
    refresh: () => void,
};

const DocumentsContext = React.createContext<TDocumentsContext>(null);

export function useDocumentsContext() {
    const context = React.useContext(DocumentsContext);

    if (context === null) {
        throw new Error("context used outside of provider.");
    }
    return context;
}

export default DocumentsContext;