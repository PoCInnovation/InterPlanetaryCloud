import React from "react";
import {Database} from "../lib/database";

export type TDatabaseContext = null | Database;

const DatabaseContext = React.createContext<TDatabaseContext>(null);

export function useDatabaseContext() {
    const context = React.useContext(DatabaseContext);
    if (context === null) {
        throw new Error("context used outside of provider.");
    }
    return context;
}

export default DatabaseContext;