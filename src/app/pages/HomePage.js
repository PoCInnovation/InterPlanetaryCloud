import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
    return (
        <div className="home-container">
            <div className="home-header">
                <h3>Welcome to</h3>
                <h1>Inter Planetary Cloud</h1>
                <p>The first Cloud unsealing your Data</p>
            </div>
            <div className="home-btns">
                <Link className="home-btn border-green" to="/signup">
                    Sign Up
                </Link>
                <div className="home-login-container">
                    <p>Already an account ?</p>
                    <Link className="home-btn border-blue" to="/login">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
