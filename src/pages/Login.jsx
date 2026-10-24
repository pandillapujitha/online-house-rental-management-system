import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export default function Login() {
  const { login, toast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) return setError(res.error);
    toast(`Welcome back, ${res.user.name.split(" ")[0]}.`);
    const dest = location.state?.from || (res.user.role === "admin" ? "/admin" : "/dashboard");
    navigate(dest, { replace: true });
  };

  const fill = (e, p) => { setEmail(e); setPassword(p); setError(""); };

  return (
    <div className="container auth">
      <form className="card auth-card" onSubmit={submit} noValidate>
        <h1>Log in</h1>
        <label>Email
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>Password
          <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn btn-primary block" type="submit">Log in</button>
        <p className="muted small">New to KeyNest? <Link to="/register">Create an account</Link></p>
        <div className="demo">
          <p className="small"><strong>Demo accounts</strong> (click to fill)</p>
          <button type="button" className="chip" onClick={() => fill("user@keynest.com", "user123")}>Tenant</button>
          <button type="button" className="chip" onClick={() => fill("admin@keynest.com", "admin123")}>Admin</button>
        </div>
      </form>
    </div>
  );
}
