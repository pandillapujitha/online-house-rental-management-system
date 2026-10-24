import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp, money } from "../context/AppContext.jsx";
import HouseCard from "../components/HouseCard.jsx";

const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function Dashboard() {
  const { currentUser, bookings, houses, myFavorites, updateBookingStatus, updateProfile, toast } = useApp();
  const [tab, setTab] = useState("bookings");
  const [profile, setProfile] = useState({ name: currentUser.name, phone: currentUser.phone });

  const mine = bookings.filter((b) => b.userId === currentUser.id);
  const saved = houses.filter((h) => myFavorites.includes(h.id));
  const count = (s) => mine.filter((b) => b.status === s).length;

  const saveProfile = (e) => {
    e.preventDefault();
    if (profile.name.trim().length < 2) return toast("Enter your name.", "warn");
    updateProfile({ name: profile.name.trim(), phone: profile.phone.trim() });
    toast("Profile saved.");
  };

  return (
    <div className="container page">
      <h1 className="page-title">Hello, {currentUser.name.split(" ")[0]}</h1>

      <div className="stat-row">
        <div className="stat"><strong>{mine.length}</strong><span>Total requests</span></div>
        <div className="stat"><strong>{count("pending")}</strong><span>Waiting for approval</span></div>
        <div className="stat"><strong>{count("approved")}</strong><span>Approved</span></div>
        <div className="stat"><strong>{saved.length}</strong><span>Shortlisted</span></div>
      </div>

      <div className="tabs" role="tablist">
        {[["bookings", "My bookings"], ["saved", "Shortlist"], ["profile", "Profile"]].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === "bookings" && (
        mine.length ? (
          <div className="table-wrap card">
            <table>
              <thead><tr><th>Home</th><th>Move-in</th><th>Lease</th><th>Total</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {mine.map((b) => {
                  const h = houses.find((x) => x.id === b.houseId);
                  return (
                    <tr key={b.id}>
                      <td data-label="Home">{h ? <Link to={`/houses/${h.id}`}>{h.title}</Link> : "Removed listing"}<br /><span className="muted small">{h?.locality}</span></td>
                      <td data-label="Move-in">{fmt(b.moveIn)}</td>
                      <td data-label="Lease">{b.months} months</td>
                      <td data-label="Total">{money(b.total)}</td>
                      <td data-label="Status"><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                      <td>
                        {["pending", "approved"].includes(b.status) && (
                          <button className="btn btn-ghost small-btn" onClick={() => { updateBookingStatus(b.id, "cancelled"); toast("Booking cancelled."); }}>Cancel</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty card">
            <h3>No booking requests yet</h3>
            <p className="muted">Pick a home and send your first request.</p>
            <Link className="btn btn-primary" to="/houses">Browse houses</Link>
          </div>
        )
      )}

      {tab === "saved" && (
        saved.length ? (
          <div className="grid">{saved.map((h) => <HouseCard key={h.id} house={h} />)}</div>
        ) : (
          <div className="empty card">
            <h3>Your shortlist is empty</h3>
            <p className="muted">Tap the heart on any home to save it here.</p>
            <Link className="btn btn-primary" to="/houses">Browse houses</Link>
          </div>
        )
      )}

      {tab === "profile" && (
        <form className="card profile" onSubmit={saveProfile}>
          <label>Full name<input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label>
          <label>Phone<input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></label>
          <label>Email<input value={currentUser.email} disabled /></label>
          <button className="btn btn-primary" type="submit">Save changes</button>
        </form>
      )}
    </div>
  );
}
