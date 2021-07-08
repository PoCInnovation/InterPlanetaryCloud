import React from "react";

export type TDocumentsContext = null | {
    userDocs: any,
    refresh: () => void,
};

/// Holds the orbit-db database instance.
const DocumentsContext = React.createContext<TDocumentsContext>(null);

/// TODO: Implement the context inside the React components.
/// Safely obtain the database context. Ensures a context provider is declared higher up in the component tree.
export function useDocumentsContext() {
    const context = React.useContext(DocumentsContext);

    if (context === null) {
        throw new Error("context used outside of provider.");
    }
    return context;
}

export default DocumentsContext;