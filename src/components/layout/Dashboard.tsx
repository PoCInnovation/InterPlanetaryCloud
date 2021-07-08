import React from "react";
import Sidebar from "./Sidebar";
import FilesContext from "contexts/files";
import UserContext from "contexts/user";
import {IPCFile} from "types/file";
import {useDocumentsContext} from "../../contexts/documents";
import jwt, {Secret} from "jsonwebtoken";
import {JWT_SECRET} from "config/environment";
import FullPageLoader from "components/loaders/FullPageLoader";
import {RouteComponentProps, withRouter} from "react-router-dom";

async function loadUserDocs(userDocs: any) {
    if (userDocs) {
        console.log("Loading userDocs ...");
        try {
            await userDocs.load();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    return false;
}

async function getFiles(userDocs: any, setFiles: React.Dispatch<any>) {
    if (await loadUserDocs(userDocs)) {
        console.log("Getting user files ...");
        try {
            setFiles(await userDocs.get(""));
        } catch (error) {
            console.log(error);
        }
    }
}

export type TDashboardProps = RouteComponentProps;

const Dashboard: React.FC<TDashboardProps> = props => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [files, setFiles] = React.useState<IPCFile[]>([]);
    const [loading, setLoading] = React.useState(true);
    const {userDocs} = useDocumentsContext();

    const load = async (decoded: any) => {
        if (!email) setEmail(decoded.email);
        if (!password) setPassword(decoded.password);
        if (!files) await getFiles(userDocs, setFiles);
    };

    React.useEffect(() => {
        const token = localStorage.token;
        return jwt.verify(token, JWT_SECRET as Secret, function (err: any, decoded: any) {
            if (err) {
                props.history.push("/");
            }
            load(decoded).then(() => {
                setLoading(false);
            });
        });
    });

    if (loading) return (<FullPageLoader />);

    return (
        <UserContext.Provider value={{email: "", password: ""}}>
            <FilesContext.Provider value={{files: files, setFiles: setFiles}}>
                <div className="grid grid-cols-[300px,1fr] h-screen overflow-hidden">
                    <Sidebar />
                    {props.children}
                </div>
            </FilesContext.Provider>
        </UserContext.Provider>
    )
};

export default withRouter(Dashboard);