import React from "react";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { Redirect } from "react-router-dom";
import { JWT_SECRET } from "config/environment";

export type LoginViewProps = {
    orbitDB: any,
    usersKV: any,
    setUserDocs: React.Dispatch<any>,
};

const LoginView: React.FC<LoginViewProps> = props => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loggedIn, setLoggedIn] = React.useState(false);

    const emailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

    const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await props.usersKV.load();
            const userId = await props.usersKV.get(email);
            let validPassword = undefined;
            let userDocs = undefined;

            if (userId) {
                userDocs = await props.orbitDB.docs(userId._id);
                await userDocs.load();
                const hash = await userDocs.get(email)[0].password;
                validPassword = bcrypt.compareSync(password, hash);
            }
            if (!userId || !validPassword) {
                console.log("Invalid email or password");
                return;
            }
            const payload = {
                email,
                password,
                docsAddress: userId._id,
            };
            const token = jwt.sign(payload, JWT_SECRET as Secret);
            localStorage.setItem("token", token);
            props.setUserDocs(userDocs);
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        jwt.verify(
            localStorage.token,
            JWT_SECRET as Secret,
            function (err: any, decoded: any) {
                setLoggedIn(!err && decoded.docsAddress)
            });
    })

    if (loggedIn) return <Redirect to={"/dashboard"} />;

    return (
        <div className={"flex items-center justify-center"}>
            <form onSubmit={(e) => loginUser(e)} className={"mt-24 bg-white p-6 rounded-md border border-gray-200 w-[400px] shadow-md"}>
                <div className={""}>
                    <p className={"text-xl"}>
                        Log in
                    </p>
                </div>

                <div className={"flex flex-col mt-6"}>
                    <label className={"text-sm text-gray-600 mb-1"}>Email</label>
                    <input className={"p-2 text-sm bg-gray-100 border border-gray-300 rounded mb-4"}
                           onChange={emailChange}
                           type="text"/>
                    <label className={"text-sm text-gray-600 mb-1"}>Password</label>
                    <input
                        className={"p-2 text-sm bg-gray-100 border border-gray-300 rounded"}
                        onChange={passwordChange}
                        type="password"/>
                </div>

                <div className={"flex justify-end mt-6"}>
                    <button className={"shadow p-2 px-4 text-sm bg-blue-600 text-white rounded transition duration-200 hover:bg-blue-700"}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginView;