import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export default function Register() {
  const { register, toast } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});

  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!/^[+\d\s-]{10,15}$/.test(form.phone)) e.phone = "Enter a valid phone number.";
    if (form.password.length < 6) e.password = "Use at least 6 characters.";
    if (form.confirm !== form.password) e.confirm = "Passwords do not match.";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    const res = register(form);
    if (!res.ok) return setErrors({ email: res.error });
    toast("Account created. You are logged in.");
    navigate("/dashboard");
  };

  const field = (k, label, type = "text", auto) => (
    <label>{label}
      <input type={type} autoComplete={auto} value={form[k]} onChange={change(k)} aria-invalid={!!errors[k]} />
      {errors[k] && <span className="error">{errors[k]}</span>}
    </label>
  );

  return (
    <div className="container auth">
      <form className="card auth-card" onSubmit={submit} noValidate>
        <h1>Create your account</h1>
        {field("name", "Full name", "text", "name")}
        {field("email", "Email", "email", "email")}
        {field("phone", "Phone number", "tel", "tel")}
        {field("password", "Password", "password", "new-password")}
        {field("confirm", "Confirm password", "password", "new-password")}
        <button className="btn btn-primary block" type="submit">Create account</button>
        <p className="muted small">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
