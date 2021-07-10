import React from "react";
import { IPCFile } from "types/file";
import {StarIcon} from "@heroicons/react/solid";
import {CloudDownloadIcon} from "@heroicons/react/outline";
import Clipboard from 'react-clipboard.js';

export type FileCardProps = {
    file: IPCFile,
};

const FileCard: React.FC<FileCardProps> = props => {

    const addFileToFavorites = () => {

    };

    const downloadFile = () => {

    };

    if (props.file.password) return <div />;
    return (
        <div className={"border-gray-200 bg-white p-4 shadow rounded cursor-pointer"}>
            <p className={"overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[100%]"}>{props.file.name}</p>
            <p className={"text-sm text-gray-700"}>{new Date(props.file.created_at).toDateString()}</p>
            <div>
                <button className={"group rounded-full p-[6px] border border-gray-300 bg-gray-100 hover:bg-gray-200 mr-2 mt-4"}
                    onClick={addFileToFavorites}>
                    <StarIcon className={"h-5 w-5 text-gray-400 group-hover:text-yellow-500"} />
                </button>
                <Clipboard data-clipboard-text={props.file.content}>
                    <button className={"group rounded-full p-[6px] border border-gray-300 bg-gray-100 hover:bg-gray-200 mr-4 mt-2"}
                            onClick={downloadFile}>
                        <CloudDownloadIcon className={"h-5 w-5 text-blue-600"} />
                    </button>
                </Clipboard>
            </div>
        </div>
    );
};

export default FileCard;
