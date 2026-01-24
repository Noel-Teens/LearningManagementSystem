import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // 🔒 KEEP YOUR EXISTING REGISTER RULES HERE
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Register to Knowledge Base</p>

        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email address"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-btn">Register</button>
        </form>

        <div className="auth-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </div>
      </div>
    </div>
  );
}

export default Register;