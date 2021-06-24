import React from "react";
import { Link } from "react-router-dom";

const HomeView: React.FC = () => {
    return (
        <div className={"flex flex-col justify-center items-center w-full pt-[20vh]"}>
            <div className={"flex flex-col items-center"}>
                <p className={"text-lg"}>Welcome to</p>
                <h1 className={"text-5xl font-bold"}>Inter Planetary Cloud</h1>
                <p className={"text-blue-600 mt-4"}>The first cloud unsealing your data</p>
            </div>
            <div className={"flex mt-8"}>
                <Link to={"/login"}>
                    <button className={"shadow-md border bg-white border-gray-200 p-2 px-4 rounded-md transition duration-200 hover:bg-gray-100"}>
                        Login
                    </button>
                </Link>
                <div className={"w-4"}></div>
                <Link to={"/signup"}>
                    <button className={"shadow-md p-2 px-4 bg-blue-600 text-white rounded-md transition duration-200 hover:bg-blue-700"}>
                        Create an account
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default HomeView;