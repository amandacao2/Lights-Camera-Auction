import React from "react";
import firebase, { FIREBASE_AUTH } from "./firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "./login-signup.css"; // Use the shared CSS
import "./landing.css";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const auth = FIREBASE_AUTH;
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
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
  };

  return (
    <div className="login-container">
      <div>
      <h1 className="login-title" style={{marginLeft: "5rem" }}>Login</h1>
      <spline-viewer url="https://prod.spline.design/hlGWKuhbw7Xt-1cC/scene.splinecode"></spline-viewer>
      </div>
      <div className="login-form-container">
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn-submit" type="submit">
            Login
          </button>
        </form>
        <p style={{ textAlign: "left", marginTop: "1rem", marginLeft: "3rem" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#153594", textDecoration: "underline" }}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
