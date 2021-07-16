import React from "react";

export type TUserContext = null | {
    email: string,
    password: string,
};

const UserContext = React.createContext<TUserContext>(null);

export function useUserContext() {
    const context = React.useContext(UserContext);

    if (context === null) {
        throw new Error("context used outside of provider.");
    }
    return context;
}

export default UserContext;