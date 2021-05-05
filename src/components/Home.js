import { Link } from 'react-router-dom';
import './Home.css'

function Home() {
    return (
        <div className="home-container">
            <div className="home-header">
                <h3>Welcome to</h3>
                <h1>Inter Planetary Cloud</h1>
                <p>The first Cloud unsealing your Data</p>
            </div>
            <div className="home-btns">
                <Link class="home-btn border-green" to="/signup">
                    Sign Up
                </Link>
                <div id="home-login-container">
                    <p>Already an account ?</p>
                    <Link class="home-btn border-blue" to="/login">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;