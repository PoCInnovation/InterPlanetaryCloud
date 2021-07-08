import React from "react";
import {PlusIcon} from "@heroicons/react/solid";

const UploadFileFloatingButton: React.FC = props => {
    return (
        <button className={"absolute bottom-12 right-12 bg-blue-600 hover:bg-blue-700 transition duration-200 text-white px-4 py-3 rounded-full flex items-center shadow-lg cursor-pointer"}>
            <PlusIcon className={"h-5 w-5 mr-1"} />
            Upload file
        </button>
    );
};

export default UploadFileFloatingButton;