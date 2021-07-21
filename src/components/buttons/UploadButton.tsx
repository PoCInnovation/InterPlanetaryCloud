import React from "react";

const UploadButton: React.FC = props => {
    const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {};

    return (
        <div>
            <input onChange={uploadFile} type="file" />
        </div>
    );
}

export default UploadButton;
