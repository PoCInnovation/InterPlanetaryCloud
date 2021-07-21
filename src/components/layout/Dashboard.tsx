import React from "react";
import Sidebar from "./Sidebar";
import {RouteComponentProps, withRouter} from "react-router-dom";

export type TDashboardProps = RouteComponentProps;

const Dashboard: React.FC<TDashboardProps> = props => {
    return (
        <div className="grid grid-cols-[300px,1fr] h-screen overflow-hidden">
            <Sidebar />
            <div className={"p-12"}>
                {props.children}
            </div>
        </div>
    )
};

export default withRouter(Dashboard);