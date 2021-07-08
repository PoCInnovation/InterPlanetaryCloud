import React from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";

export type TSidebarProps = RouteComponentProps;

const Sidebar: React.FC<TSidebarProps> = props => {
    const logout = () => {
        window.localStorage.clear();
        props.history.push("/")
    };

    return (
        <div className="border-r border-gray-300 flex flex-col items-center py-12 justify-between">
            <div>
                <h1 className="text-xl">InterPlanetaryCloud</h1>
            </div>
            <div>
                <button className={"py-1 px-4 bg-gray-200 hover:bg-gray-300 transition duration-200 text-gray-800 text-sm rounded-full"}
                    onClick={logout}>
                    Log out
                </button>
            </div>
        </div>
    );
}

export default withRouter(Sidebar);
