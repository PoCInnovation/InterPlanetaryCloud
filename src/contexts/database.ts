import React from "react";

/// Holds the orbit-db database instance.
const DatabaseContext = React.createContext(null);

/// Safely obtain the database context. Ensures a context provider is declared higher up in the component tree.
export function useDatabaseContext() {
    const context = React.useContext(DatabaseContext);

    if (context == undefined) {
        throw new Error("context used outside of provider.");
    }
    return context;
}

export default DatabaseContext;