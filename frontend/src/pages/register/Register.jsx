import "./register.css";
import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Register() {
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const navigate = useNavigate();

    const handleClick = async (e) => {
        e.preventDefault();
        if (passwordAgain.current.value !== password.current.value) {
            passwordAgain.current.setCustomValidity("Passwords don't match!");
        } else {
            const user = {
                email: email.current.value,
                password: password.current.value,
            };
            try {
                await axios.post("/authen/register", user);
                navigate("/login");
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Tamnotsocial</h3>
                    <span className="loginDesc">Tam all around the world</span>
                </div>

                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input
                            placeholder="Email"
                            required
                            ref={email}
                            className="loginInput"
                            type="email"
                        />
                        <input
                            placeholder="Password"
                            required
                            ref={password}
                            className="loginInput"
                            type="password"
                            minLength="6"   
                        />
                        <input
                            placeholder="Password Again"
                            required
                            ref={passwordAgain}
                            className="loginInput"
                            type="password"
                        />
                        <button className="loginButton">Sign Up</button>
                        <Link to="/login">
                            <button className="loginRegisterButton">
                                Explore the world
                            </button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}