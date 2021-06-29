import Signup from "../components/forms/Signup";
import "./SignupPage.css";

function SignupPage({ orbitDB, usersKV, setUsersKV, setUserDocs }) {
    return (
        <div className="signup-page-container">
            <h3>Inter Planetary Cloud</h3>
            <Signup
                orbitDB={orbitDB}
                usersKV={usersKV}
                setUsersKV={setUsersKV}
                setUserDocs={setUserDocs}
            />
        </div>
    );
}

export default SignupPage;
