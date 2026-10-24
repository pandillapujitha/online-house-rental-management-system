import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp, money } from "../context/AppContext.jsx";
import HouseImage from "../components/HouseImage.jsx";

const today = () => new Date().toISOString().slice(0, 10);

export default function HouseDetails() {
  const { id } = useParams();
  const { houses, currentUser, createBooking, toast, bookings, myFavorites, toggleFavorite } = useApp();
  const navigate = useNavigate();
  const house = houses.find((h) => h.id === id);

  const [active, setActive] = useState(0);
  const [moveIn, setMoveIn] = useState("");
  const [months, setMonths] = useState(11);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  if (!house) {
    return (
      <div className="container page empty card">
        <h2>This house is no longer listed</h2>
        <Link className="btn btn-primary" to="/houses">Back to listings</Link>
      </div>
    );
  }

  const deposit = house.rent * 2;
  const total = house.rent * Number(months || 0) + deposit;
  const existing = currentUser && bookings.find((b) => b.houseId === house.id && b.userId === currentUser.id && ["pending", "approved"].includes(b.status));
  const liked = myFavorites.includes(house.id);

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!moveIn) return setError("Choose a move-in date.");
    if (moveIn < today()) return setError("Move-in date cannot be in the past.");
    if (months < 1 || months > 36) return setError("Lease length must be between 1 and 36 months.");
    createBooking({ houseId: house.id, moveIn, months, note });
    toast("Booking request sent. Track it in your dashboard.");
    navigate("/dashboard");
  };

  return (
    <div className="container page">
      <p className="crumbs"><Link to="/houses">Houses</Link> / {house.locality}</p>
      <div className="detail-layout">
        <div>
          <div className="gallery">
            <HouseImage className="gallery-main" src={house.images[active]} alt={`${house.title}, photo ${active + 1}`} />
            {house.images.length > 1 && (
              <div className="thumbs">
                {house.images.map((src, i) => (
                  <button key={i} className={i === active ? "on" : ""} onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`}>
                    <HouseImage src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="detail-head">
            <div>
              <h1>{house.title}</h1>
              <p className="muted">{house.locality}, {house.city} · {house.type}</p>
            </div>
            <span className={`status inline status-${house.status}`}>{house.status === "available" ? "Available" : "Rented"}</span>
          </div>

          <div className="spec-grid">
            <div><strong>{house.bedrooms}</strong><span>Bedrooms</span></div>
            <div><strong>{house.bathrooms}</strong><span>Bathrooms</span></div>
            <div><strong>{house.area}</strong><span>Sq ft</span></div>
            <div><strong>{house.furnished}</strong><span>Furnishing</span></div>
          </div>

          <h2>About this home</h2>
          <p className="prose">{house.description}</p>

          <h2>Amenities</h2>
          <ul className="amenities">
            {house.amenities.map((a) => <li key={a}>{a}</li>)}
          </ul>

          <h2>Owner</h2>
          <p>{house.owner} · <a href={`tel:${house.phone.replace(/\s/g, "")}`}>{house.phone}</a></p>
        </div>

        <aside className="card booking">
          <p className="booking-price">{money(house.rent)}<small> / month</small></p>
          {house.status !== "available" ? (
            <p className="notice">This home is currently rented. Check similar homes in <Link to={`/houses?q=${encodeURIComponent(house.locality)}`}>{house.locality}</Link>.</p>
          ) : existing ? (
            <p className="notice">You already have a {existing.status} request for this home. See it in your <Link to="/dashboard">dashboard</Link>.</p>
          ) : currentUser?.role === "admin" ? (
            <p className="notice">Admins cannot book homes. Log in with a tenant account to test bookings.</p>
          ) : !currentUser ? (
            <>
              <p className="muted">Log in to request a booking for this home.</p>
              <Link className="btn btn-primary block" to="/login" state={{ from: `/houses/${house.id}` }}>Log in to book</Link>
              <Link className="btn btn-ghost block" to="/register">Create account</Link>
            </>
          ) : (
            <form onSubmit={submit} noValidate>
              <label>Move-in date
                <input type="date" min={today()} value={moveIn} onChange={(e) => setMoveIn(e.target.value)} />
              </label>
              <label>Lease length (months)
                <input type="number" min="1" max="36" value={months} onChange={(e) => setMonths(e.target.value)} />
              </label>
              <label>Message to owner (optional)
                <textarea rows="3" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Family of 3, need parking for 1 car." />
              </label>
              <dl className="cost">
                <div><dt>Rent × {months || 0} months</dt><dd>{money(house.rent * Number(months || 0))}</dd></div>
                <div><dt>Refundable deposit (2 months)</dt><dd>{money(deposit)}</dd></div>
                <div className="total"><dt>Total due on approval</dt><dd>{money(total)}</dd></div>
              </dl>
              {error && <p className="error" role="alert">{error}</p>}
              <button className="btn btn-primary block" type="submit">Send booking request</button>
            </form>
          )}
          {currentUser?.role !== "admin" && (
            <button className="btn btn-ghost block" onClick={() => (toggleFavorite(house.id) ? null : navigate("/login"))}>
              {liked ? "Remove from shortlist" : "Save to shortlist"}
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
