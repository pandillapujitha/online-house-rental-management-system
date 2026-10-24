import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="brand"><span className="brand-mark" aria-hidden="true">K</span>KeyNest</div>
          <p className="muted">Rent verified homes online, from search to move-in.</p>
        </div>
        <div className="footer-links">
          <Link to="/houses">Browse houses</Link>
          <Link to="/register">Create account</Link>
          <Link to="/login">Log in</Link>
        </div>
        <p className="muted small">© {new Date().getFullYear()} KeyNest. Academic demo project with mock data.</p>
      </div>
    </footer>
  );
}
