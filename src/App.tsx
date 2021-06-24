// @ts-ignore
import OrbitDB from "orbit-db";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import jwt, {Secret} from "jsonwebtoken";
import IPFSClient from "config/ipfs";
import {KEYVALUE_DB_ADDRESS, JWT_SECRET} from "config/environment";
import DashboardView from "views/dashboard/DashboardView";
import LoginView from "views/login/LoginView";
import SignupView from "views/signup/SignupView";
import HomeView from "views/home/HomeView";

async function initOrbitDB(orbitDB: any, setOrbitDB: React.Dispatch<any>) {
    if (!orbitDB) {
        console.log("Getting orbitDB ...");
        try {
            setOrbitDB(await OrbitDB.createInstance(IPFSClient));
        } catch (error) {
            console.error(error);
        }
    }
}

async function initUsersKV(orbitDB: any, usersKV: any, setUsersKV: React.Dispatch<any>) {
    if (orbitDB && !usersKV) {
        console.log("Getting usersKV ...");
        try {
            setUsersKV(await orbitDB.keyvalue(KEYVALUE_DB_ADDRESS));
        } catch (error) {
            console.error(error);
        }
    }
}

async function initUserDocs(orbitDB: any, userDocs: any, setUserDocs: React.Dispatch<any>) {
    const token = localStorage.token;

    if (orbitDB && token && !userDocs) {
        console.log("Getting userDocs ...");
        /// TODO: Perform a cleaner conversion of JWT_SECRET to Secret and fix the type annotations inside the callback.
        jwt.verify(token, JWT_SECRET as Secret, async function (err: any, decoded: any) {
            if (err) return;
            try {
                setUserDocs(await orbitDB.docs(decoded.docsAddress));
            } catch (error) {
                console.log(error);
            }
        });
    }
}

const App: React.FC = () => {
    const [orbitDB, setOrbitDB] = React.useState<any>(null);
    const [usersKV, setUsersKV] = React.useState<any>(null);
    const [userDocs, setUserDocs] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        (async () => {
            if (!loading) {
                return;
            }
            await initOrbitDB(orbitDB, setOrbitDB);
            await initUsersKV(orbitDB, usersKV, setUsersKV);
            await initUserDocs(orbitDB, userDocs, setUserDocs);
            setLoading(false);
        })();
    }, [orbitDB, userDocs, usersKV, loading]);

    return (
        <div>
            {
                loading ? "Loading..." :
                <BrowserRouter>
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
                        <Route path="/dashboard">
                            <DashboardView
                                userDocs={userDocs}
                                setUserDocs={setUserDocs}
                            />
                        </Route>
                    </Switch>
                </BrowserRouter>
            }
        </div>
    );
};

export default App;
