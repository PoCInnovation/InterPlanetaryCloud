// @ts-ignore
import OrbitDB from "orbit-db";
import React from "react";
import {Route, Switch, useHistory} from "react-router-dom";
import jwt, {Secret} from "jsonwebtoken";
import IPFSClient from "config/ipfs";
import {KEYVALUE_DB_ADDRESS, JWT_SECRET} from "config/environment";
import DocumentsContext from "contexts/documents";
import DashboardView from "views/dashboard/DashboardView";
import LoginView from "views/login/LoginView";
import SignupView from "views/signup/SignupView";
import HomeView from "views/home/HomeView";
import FullPageLoader from "./components/loaders/FullPageLoader";

async function initOrbitDB(setOrbitDB: React.Dispatch<any>, setUsersKV: React.Dispatch<any>, setUsersDocs: React.Dispatch<any>) {
    const token = localStorage.token;
    try {
        const orbitDB = await OrbitDB.createInstance(IPFSClient);
        setOrbitDB(orbitDB);
        const usersKV = await orbitDB.keyvalue(KEYVALUE_DB_ADDRESS);
        setUsersKV(usersKV);
        await jwt.verify(token, JWT_SECRET as Secret, async function (err: any, decoded: any) {
            if (err) throw err;
            const userDocs = await orbitDB.docs(decoded.docsAddress);
            setUsersDocs(userDocs);
        });
    } catch (error) {
        throw error;
    }
}

const App: React.FC = () => {
    const [orbitDB, setOrbitDB] = React.useState<any>(null);
    const [usersKV, setUsersKV] = React.useState<any>(null);
    const [userDocs, setUserDocs] = React.useState<any>(null);
    const [loading, setLoading] = React.useState()
    const history = useHistory();

    React.useEffect(() => {
        (async () => {
            await initOrbitDB(setOrbitDB, setUsersKV, setUserDocs).catch((e) => {
                history.push("/login")
            });
        })();
    }, []);

    return (
        <div>
            {(!orbitDB || !usersKV) ? <FullPageLoader /> :
                <Switch>
                    <Route exact path="/">
                        <HomeView />
                    </Route>
                    <Route path="/signup">
                        <SignupView
                            orbitDB={orbitDB}
                            usersKV={usersKV}
                            setUsersKV={setUsersKV}
                            setUserDocs={setUserDocs}
                        />
                    </Route>
                    <Route path="/login">
                        <LoginView
                            orbitDB={orbitDB}
                            usersKV={usersKV}
                            setUserDocs={setUserDocs}
                        />
                    </Route>
                    {userDocs && <Route path="/dashboard">
                        <DocumentsContext.Provider value={{userDocs: userDocs, refresh: () => setUserDocs(userDocs)}}>
                            <DashboardView />
                        </DocumentsContext.Provider>
                    </Route>}
                </Switch>
            }
        </div>
    );
};

export default App;
