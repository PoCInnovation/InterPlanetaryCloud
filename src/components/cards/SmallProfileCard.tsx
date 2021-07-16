import React from "react";
import {useUserContext} from "../../contexts/user";
import {UserCircleIcon} from '@heroicons/react/solid'

const SmallProfileCard: React.FC = props => {
    const { email } = useUserContext();

    return (
        <div className={"bg-white rounded border-gray-300 border shadow p-3 flex items-center"}>
            <UserCircleIcon className={"w-6 h-6 text-blue-700 mr-2"} />
            <p className={"text-sm text-gray-700"}>{email}</p>
        </div>
    )
};

export default SmallProfileCard;