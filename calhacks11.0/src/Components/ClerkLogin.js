import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ClerkLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const clerkCredentials = { email, password };

    try {
      const response = await fetch("/api/clerk/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clerkCredentials),
      });

      if (response.ok) {
        navigate("/clerk-dashboard"); // Redirect after successful login
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <h2>Clerk Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default ClerkLogin;
