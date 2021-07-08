import React from "react";
import Sidebar from "./Sidebar";
import FilesGrid from "./FilesGrid";
import jwt, {Secret} from "jsonwebtoken";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { JWT_SECRET } from "config/environment";
import FullPageLoader from "components/loaders/FullPageLoader";
import DashboardWidgets from "./DashboardWidgets";
import {useDocumentsContext} from "../../contexts/documents";
import {IPCFile} from "../../types/file";

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

export type DashboardViewProps = RouteComponentProps;

const DashboardPage: React.FC<DashboardViewProps> = props => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [files, setFiles] = React.useState<IPCFile[] | null>(null);
    const [loading, setLoading] = React.useState(true);
    const { userDocs } = useDocumentsContext();

    const setVariables = async (decoded: any) => {
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
            setVariables(decoded).then(() => {
                setLoading(false);
            });
        });
    });

    if (loading) return (<FullPageLoader />);

    return (
        <div className="grid grid-cols-[300px,1fr] h-screen">
            <Sidebar email={email}
                     setFiles={setFiles} />
            <DashboardWidgets />
            <FilesGrid files={files || []} />
        </div>
    );
}

export default withRouter(DashboardPage);
