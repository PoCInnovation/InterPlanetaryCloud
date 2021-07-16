import React from "react";
import Modal from "../layout/Modal";
import UploadButton from "../buttons/UploadButton";

type TAddFileModalProps = {
    close: Function,
};

const AddFileModal: React.FC<TAddFileModalProps> = props => {
    return (
        <Modal close={props.close} title={"Upload a file"}>
            <div className={"bg-gray-100 flex justify-center w-full p-2"}>
                <UploadButton />
            </div>
        </Modal>
    )
};

export default AddFileModal;