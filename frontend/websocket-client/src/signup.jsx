import React from "react";
import './login-signup.css';
import firebase, { FIREBASE_AUTH } from './firebase-config';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useNavigate } from "react-router-dom";

const Signup = () => {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const auth = FIREBASE_AUTH;
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await sendEmailVerification(user);
            console.log("Verification email sent!");
            alert("User signed up successfully. Please check your email for verification.");
            localStorage.setItem("uid", user.uid);
            navigate("/login");
        } catch (error) {
            console.error("Error signing up:", error.message);
            alert("Error signing up: " + error.message);
        }
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    }

    return (
        <div>
            <h1 class = "container">Signup</h1>
            <form onSubmit={handleSignup}>
                <div class = "container">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email"  onChange={handleInputChange} required></input>
                </div>
                <div class = "container">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" onChange={handleInputChange} required></input>
                </div>
                <div class = "container">
                <button type="submit">Signup</button>
                </div>
            </form>
        </div>
    );
} 

export default Signup;