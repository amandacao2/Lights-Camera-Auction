import React from "react";
import "./login-signup.css";
import firebase, { FIREBASE_AUTH } from "./firebase-config";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

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
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Sign<br/>Up</h1>
      <div className="login-form-container">
        <form className="login-form" onSubmit={handleSignup}>
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
            Signup
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#153594", textDecoration: "underline" }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
