import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import './Signup.css'
import bgImg from './bg.png'
function Signup() {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyA2NhkIIrWIBqAoQTseuBqdLngMaKeJTbI",
    authDomain: "greenslip-6e16b.firebaseapp.com",
    projectId: "greenslip-6e16b",
    storageBucket: "greenslip-6e16b.appspot.com",
    messagingSenderId: "841366779607",
    appId: "1:841366779607:web:59481d60262b9d539d6292",
    measurementId: "G-6DKJZ5LWEV"
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Redirect to dashboard after successful signup
    } catch (error) {
      console.error("Signup failed:", error);
      alert('Failed to signup: ' + error.message);
    }
  };

  return (
    <div className="main-signup" style={{ backgroundImage: `url(${bgImg})`} }>
      <div className="signup-container">
        <h2 className="signup-title">Signup</h2>
        <form className="signup-form" onSubmit={handleSignup}>
          <input
            type="email"
            className="signup-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            className="signup-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" className="signup-button">Signup</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;