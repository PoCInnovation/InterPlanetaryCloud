import React from "react";
import Auth from "../lib/auth";

export type TAuthContext = null | Auth;

const AuthContext = React.createContext<TAuthContext>(null);

export function useAuthContext() {
    const context = React.useContext(AuthContext);
    if (context === null) {
        throw new Error("context used outside of provider.");
    }
    return context;
}

export default AuthContext;