import React from "react";
import {PlusIcon} from "@heroicons/react/solid";
import AddFileModal from "../cards/AddFileModal";

const UploadFileFloatingButton: React.FC = props => {
    const [modalOpen, setModalOpen] = React.useState(false);

    const showUploadMenu = () => setModalOpen(true);

    return (
        <div>
            <button className={"absolute bottom-12 right-12 bg-blue-600 hover:bg-blue-700 transition duration-200 text-white px-4 py-3 rounded-full flex items-center shadow-lg cursor-pointer"}
                    onClick={showUploadMenu}>
                <PlusIcon className={"h-5 w-5 mr-1"} />
                Upload file
            </button>
            {modalOpen ? <AddFileModal close={() => setModalOpen(false)} /> : ""}
        </div>
    );
};

export default UploadFileFloatingButton;