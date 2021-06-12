import Login from "../components/forms/Login";
import "./LoginPage.css";

function LoginPage({ orbit_db }) {
    return (
        <div className="login-page-container">
            <h3>Inter Planetary Cloud</h3>
            <Login orbit_db={orbit_db} />
        </div>
    );
}

export default LoginPage;
