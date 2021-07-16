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
    await userDocs.load();
}

async function getFiles(userDocs: any, setFiles: React.Dispatch<any>) {
    await loadUserDocs(userDocs);
    setFiles(await userDocs.get(""));
}

export type TDashboardProps = RouteComponentProps;

const Dashboard: React.FC<TDashboardProps> = props => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [files, setFiles] = React.useState<IPCFile[]>([]);
    const [loading, setLoading] = React.useState(true);
    const {userDocs} = useDocumentsContext();

    const load = async (decoded: any) => {
        setEmail(decoded.email);
        setPassword(decoded.password);
        await getFiles(userDocs, setFiles);
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
    }, []);

    if (loading) return (<FullPageLoader />);

    return (
        <UserContext.Provider value={{email: email, password: password}}>
            <FilesContext.Provider value={{files: files, setFiles: setFiles}}>
                <div className="grid grid-cols-[300px,1fr] h-screen overflow-hidden">
                    <Sidebar />
                    <div className={"p-12"}>
                        {props.children}
                    </div>
                </div>
            </FilesContext.Provider>
        </UserContext.Provider>
    )
};

export default withRouter(Dashboard);