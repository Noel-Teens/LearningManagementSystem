import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("learner");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegister) {
        // ✅ REGISTER API CALL
        await axios.post("http://localhost:5000/api/auth/register", {
          email,
          password,
          role
        });

        alert("Registration successful! Please login.");
        setIsRegister(false); // switch to login
        setEmail("");
        setPassword("");

      } else {
        // ✅ LOGIN API CALL
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password
        });

        // Save token & role
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        navigate("/search");
      }
    } catch (err) {
      alert(err.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">
          {isRegister ? "Create Account" : "Welcome 👋"}
        </h1>

        <p className="auth-subtitle">
          {isRegister ? "Register to Knowledge Base" : "Login to Knowledge Base"}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isRegister && (
            <select
              className="auth-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="learner">Learner</option>
              <option value="trainer">Trainer</option>
              <option value="admin">Admin</option>
            </select>
          )}

          <button className="auth-btn">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div className="auth-link">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <span onClick={() => setIsRegister(false)}>Login</span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span onClick={() => setIsRegister(true)}>Register</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
