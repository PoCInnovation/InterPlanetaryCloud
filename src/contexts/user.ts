import React from "react";
import User from "lib/user";

export type TUserContext = null | { user: User, setUser: React.Dispatch<User | null> };

const UserContext = React.createContext<TUserContext>(null);

export function useUserContext() {
    const context = React.useContext(UserContext);
    if (context === null) {
        throw new Error("context used outside of provider.");
    }
    return context;
}

export default UserContext;