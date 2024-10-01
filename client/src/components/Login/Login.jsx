import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../../AuthContext';
import './Login.css';
import bgImg from './log-bg.png'
function Login() {
  const authContext = useAuth();
  if (!authContext) {
    console.error("Auth context is undefined. This component must be rendered within an AuthProvider.");
    return <div>Error: auth context not available</div>;
  }

  const { auth } = authContext;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      alert('Failed to login: ' + error.message);
    }
  };
  return (
    <div className="main-login"   style={{ backgroundImage: `url(${bgImg})`} }>
<div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="login-input"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="login-input"
          required
        />
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
    </div>
  );
}


export default Login
