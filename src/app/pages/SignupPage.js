import Signup from "../components/forms/Signup";
import "./SignupPage.css";

function SignupPage({ orbit_db }) {
    return (
        <div className="signup-page-container">
            <h3>Inter Planetary Cloud</h3>
            <Signup orbit_db={orbit_db} />
        </div>
    );
}

export default SignupPage;
