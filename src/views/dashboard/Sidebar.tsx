import React from "react";
import { IPCFile } from "../../types/file";
import UploadButton from "../../components/buttons/UploadButton";

export type LeftBarProps = {
    email: string,
    setFiles: React.Dispatch<IPCFile[] | null>,
};

const Sidebar: React.FC<LeftBarProps> = props => {
    return (
        <div className="left-bar-container">
            <h4>{props.email}</h4>
            <UploadButton setFiles={props.setFiles || []} />
        </div>
    );
}

export default Sidebar;
