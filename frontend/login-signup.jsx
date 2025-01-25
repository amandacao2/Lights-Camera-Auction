import React from "react";
import './login-signup.css';

const LoginSignup = () => {
    return (
        <div>
            <h1 class = "container">Login</h1>
            <form>
                <div class = "container">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required></input>
                </div>
                <div class = "container">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required></input>
                </div>
                <div class = "container">
                <button type="submit">Login</button>
                </div>
            </form>
        </div>
    );
} 

export default LoginSignup;