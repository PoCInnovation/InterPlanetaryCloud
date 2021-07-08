import React from "react";
import FilesGrid from "./FilesGrid";
import Dashboard from "components/layout/Dashboard";

const DashboardPage: React.FC = props => {
    return (
        <Dashboard>
            <FilesGrid />
        </Dashboard>
    );
}

export default DashboardPage;
