import React from "react";
import {useHistory} from "react-router-dom";
import SmallProfileCard from "../cards/SmallProfileCard";
import {useAuthContext} from "../../contexts/auth";

const SidebarHeader: React.FC = props => {
    return (
        <div>
            <h1 className="text-xl mb-4 text-center">InterPlanetaryCloud</h1>
            <SmallProfileCard />
        </div>
    )
};

const SidebarMenu: React.FC = props => {
    return (
        <div>
        </div>
    )
};

const SidebarFooter: React.FC = props => {
    const history = useHistory();
    const auth = useAuthContext();

    const logout = () => {
        auth.logout().then();
        history.push("/")
    };

    return (
        <div>
            <button
                className={"py-1 px-4 bg-gray-200 hover:bg-gray-300 transition duration-200 text-gray-800 text-sm rounded-full"}
                onClick={logout}>
                Log out
            </button>
        </div>
    )
};

const Sidebar: React.FC = props => {
    return (
        <div className="border-r border-gray-300 bg-white flex flex-col items-center py-12 justify-between">
            <SidebarHeader />
            <SidebarMenu />
            <SidebarFooter />
        </div>
    );
}

export default Sidebar;
