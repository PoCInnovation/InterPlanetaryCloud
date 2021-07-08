import React from "react";

const FullPageLoader: React.FC = props => {
    return (
        <div className={"absolute w-screen h-screen bg-white flex items-center justify-center"}>
            <p className={"text-lg text-gray-600"}>Loading...</p>
        </div>
    );
};

export default FullPageLoader;