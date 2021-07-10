import React from "react";
import {XIcon} from "@heroicons/react/outline";

type TModalProps = {
    close: Function,
    title: string,
};

const Modal: React.FC<TModalProps> = props => {
    return (
        <div className={"fixed bg-[rgba(0,0,0,0.2)] w-screen h-screen top-0 left-0 flex items-center justify-center"}>
            <div className={"flex bg-white rounded shadow-xl p-6 text-black min-w-[450px] flex-col"}>
                <div className={"flex justify-between w-full items-center"}>
                    <h1 className={"mb-2 text-lg"}>{props.title}</h1>
                    <div onClick={() => props.close()}>
                        <XIcon className={"h-5 w-5 text-gray-700"} />
                    </div>
                </div>
                <div>
                    {props.children}
                </div>
            </div>
        </div>
    )
};

export default Modal;