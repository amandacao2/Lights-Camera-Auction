import React from 'react';
import firebase, { FIREBASE_AUTH } from './firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const auth = FIREBASE_AUTH;
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                alert("Please verify your email first.");
                return;
            }
            alert("Login successful!");
            navigate("/directory");
        } catch (error) {
            console.error("Error logging in:", error.message);
            alert("Error logging in: " + error.message);
        }
    }
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} required></input>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} required></input>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;