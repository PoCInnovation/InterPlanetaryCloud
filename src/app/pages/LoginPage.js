import Login from "../components/forms/Login";
import "./LoginPage.css";

function LoginPage({ orbitDB, usersKV, setUserDocs }) {
    return (
        <div className="login-page-container">
            <h3>Inter Planetary Cloud</h3>
            <Login
                orbitDB={orbitDB}
                usersKV={usersKV}
                setUserDocs={setUserDocs}
            />
        </div>
    );
}

export default LoginPage;
