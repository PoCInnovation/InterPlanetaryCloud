import React from "react";
import FilesGrid from "./FilesGrid";
import Dashboard from "components/layout/Dashboard";
import UploadFileFloatingButton from "components/buttons/UploadFileFloatingButton";

const DashboardPage: React.FC = props => {
    return (
        <Dashboard>
            <FilesGrid />
            <UploadFileFloatingButton />
        </Dashboard>
    );
}

export default DashboardPage;
