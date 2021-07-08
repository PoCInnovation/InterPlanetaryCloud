import React from "react";
import bcrypt from "bcryptjs";
import jwt, {Secret} from "jsonwebtoken";
import { JWT_SECRET, KEYVALUE_DB_ADDRESS } from "config/environment";

const salt = bcrypt.genSaltSync(10);

export type SignupViewProps = {
    orbitDB: any,
    usersKV: any,
    setUsersKV: React.Dispatch<any>,
    setUserDocs: React.Dispatch<any>,
};

const SignupView: React.FC<SignupViewProps> = props => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const emailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

    const signupUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            console.log(props.orbitDB);

            const users = await props.orbitDB.keyvalue(KEYVALUE_DB_ADDRESS);
            await users.load();
            if (users.get(email)) {
                console.error("user already exists");
                return;
            }
            const user = await props.orbitDB.docs("ipc.user." + email);
            const hash = bcrypt.hashSync(password, salt);

            await user.put({ _id: email, password: hash, data: {} });
            await users.put(email, { _id: user.address.toString() });
            const payload = {
                email,
                password,
            };
            const token = jwt.sign(payload, JWT_SECRET as Secret);
            localStorage.setItem("token", token);
            console.log(localStorage.token);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={"flex items-center justify-center"}>
            <form onSubmit={(e) => signupUser(e)} className={"mt-24 bg-white p-6 rounded-md border border-gray-200 w-[400px] shadow-md"}>
                <div className={""}>
                    <p className={"text-xl"}>
                        Sign up
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

export default SignupView;