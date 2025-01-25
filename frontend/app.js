// app.js
import firebase from './firebase-config';

// Function to sign up a user
async function signUp(email, password) {
  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    await user.sendEmailVerification();
    console.log("Verification email sent!");
    alert("User signed up successfully. Please check your email for verification.");
  } catch (error) {
    console.error("Error signing up:", error.message);
    alert("Error signing up: " + error.message);
  }
}

// Function to log in a user
async function logIn(email, password) {
  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    if (user.emailVerified) {
      const idToken = await user.getIdToken();
      console.log("Login successful! ID Token:", idToken);
      alert("Login successful!");
      // You can send the idToken to your backend for verification and further actions
    } else {
      alert("Please verify your email first.");
    }
  } catch (error) {
    console.error("Error logging in:", error.message);
    alert("Error logging in: " + error.message);
  }
}

// Handle the Sign-Up form submission
document.getElementById("signup-form").addEventListener("submit", function (event) {
  event.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  signUp(email, password);
});

// Handle the Login form submission
document.getElementById("login-form").addEventListener("submit", function (event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  logIn(email, password);
});
