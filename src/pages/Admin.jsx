import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp, money } from "../context/AppContext.jsx";
import { AMENITY_LIST, HOUSE_TYPES, FURNISHING } from "../data/houses.js";

const blank = { title: "", locality: "", city: "Hyderabad", type: "Apartment", rent: "", bedrooms: 2, bathrooms: 2, area: "", furnished: "Unfurnished", image: "", owner: "", phone: "", description: "", amenities: [] };
const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function Admin() {
  const { houses, bookings, users, addHouse, deleteHouse, setHouseStatus, updateBookingStatus, toast, resetDemoData } = useApp();
  const [tab, setTab] = useState("overview");
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  const tenants = users.filter((u) => u.role === "user");
  const pending = bookings.filter((b) => b.status === "pending");
  const revenue = bookings.filter((b) => b.status === "approved").reduce((s, b) => s + b.rent * b.months, 0);

  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const toggleAmenity = (a) =>
    setForm((f) => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a] }));

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (form.title.trim().length < 5) er.title = "Enter a title of at least 5 characters.";
    if (!form.locality.trim()) er.locality = "Enter the locality.";
    if (!(Number(form.rent) > 0)) er.rent = "Enter a monthly rent above 0.";
    if (!(Number(form.area) > 0)) er.area = "Enter the area in sq ft.";
    if (!form.owner.trim()) er.owner = "Enter the owner's name.";
    if (!form.description.trim()) er.description = "Add a short description.";
    setErrors(er);
    if (Object.keys(er).length) return;
    addHouse({
      title: form.title.trim(), locality: form.locality.trim(), city: form.city.trim(), type: form.type,
      rent: Number(form.rent), bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms), area: Number(form.area),
      furnished: form.furnished, images: form.image.trim() ? [form.image.trim()] : [], owner: form.owner.trim(),
      phone: form.phone.trim() || "Not provided", description: form.description.trim(), amenities: form.amenities,
    });
    toast("House added to listings.");
    setForm(blank);
    setTab("houses");
  };

  const remove = (h) => {
    if (window.confirm(`Delete "${h.title}"? Its bookings will also be removed.`)) {
      deleteHouse(h.id);
      toast("House deleted.");
    }
  };

  const tabs = [["overview", "Overview"], ["bookings", `Bookings${pending.length ? ` (${pending.length})` : ""}`], ["houses", "Houses"], ["add", "Add house"], ["users", "Users"]];

  return (
    <div className="container page">
      <div className="section-head">
        <h1 className="page-title">Admin dashboard</h1>
        <button className="btn btn-ghost" onClick={() => { if (window.confirm("Reset all houses, users and bookings to the demo data?")) { resetDemoData(); toast("Demo data restored."); } }}>Reset demo data</button>
      </div>

      <div className="tabs" role="tablist">
        {tabs.map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <div className="stat-row">
            <div className="stat"><strong>{houses.length}</strong><span>Houses listed</span></div>
            <div className="stat"><strong>{houses.filter((h) => h.status === "rented").length}</strong><span>Currently rented</span></div>
            <div className="stat"><strong>{pending.length}</strong><span>Requests to review</span></div>
            <div className="stat"><strong>{tenants.length}</strong><span>Registered tenants</span></div>
          </div>
          <div className="card pad">
            <h2>Approved rent value</h2>
            <p className="big">{money(revenue)}</p>
            <p className="muted">Sum of rent over the lease length of all approved bookings, excluding deposits.</p>
          </div>
          <h2 className="mt">Latest requests</h2>
          <BookingTable bookings={bookings.slice(0, 5)} houses={houses} users={users} onStatus={updateBookingStatus} toast={toast} />
        </>
      )}

      {tab === "bookings" && <BookingTable bookings={bookings} houses={houses} users={users} onStatus={updateBookingStatus} toast={toast} />}

      {tab === "houses" && (
        <div className="table-wrap card">
          <table>
            <thead><tr><th>Home</th><th>Rent</th><th>Type</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {houses.map((h) => (
                <tr key={h.id}>
                  <td data-label="Home"><Link to={`/houses/${h.id}`}>{h.title}</Link><br /><span className="muted small">{h.locality}</span></td>
                  <td data-label="Rent">{money(h.rent)}</td>
                  <td data-label="Type">{h.type}</td>
                  <td data-label="Status">
                    <select value={h.status} onChange={(e) => { setHouseStatus(h.id, e.target.value); toast("Status updated."); }} aria-label={`Status of ${h.title}`}>
                      <option value="available">Available</option>
                      <option value="rented">Rented</option>
                    </select>
                  </td>
                  <td><button className="btn btn-danger small-btn" onClick={() => remove(h)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "add" && (
        <form className="card pad form-grid" onSubmit={submit} noValidate>
          <Field label="Title" error={errors.title} full><input value={form.title} onChange={change("title")} placeholder="Spacious 2BHK near metro" /></Field>
          <Field label="Locality" error={errors.locality}><input value={form.locality} onChange={change("locality")} /></Field>
          <Field label="City"><input value={form.city} onChange={change("city")} /></Field>
          <Field label="Type"><select value={form.type} onChange={change("type")}>{HOUSE_TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Furnishing"><select value={form.furnished} onChange={change("furnished")}>{FURNISHING.map((t) => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Monthly rent (₹)" error={errors.rent}><input type="number" min="0" value={form.rent} onChange={change("rent")} /></Field>
          <Field label="Area (sq ft)" error={errors.area}><input type="number" min="0" value={form.area} onChange={change("area")} /></Field>
          <Field label="Bedrooms"><input type="number" min="1" max="10" value={form.bedrooms} onChange={change("bedrooms")} /></Field>
          <Field label="Bathrooms"><input type="number" min="1" max="10" value={form.bathrooms} onChange={change("bathrooms")} /></Field>
          <Field label="Owner name" error={errors.owner}><input value={form.owner} onChange={change("owner")} /></Field>
          <Field label="Owner phone"><input value={form.phone} onChange={change("phone")} /></Field>
          <Field label="Photo URL (optional)" full><input value={form.image} onChange={change("image")} placeholder="https://..." /></Field>
          <Field label="Description" error={errors.description} full><textarea rows="4" value={form.description} onChange={change("description")} /></Field>
          <fieldset className="full">
            <legend>Amenities</legend>
            <div className="amenity-pick">
              {AMENITY_LIST.map((a) => (
                <label key={a} className="check"><input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} />{a}</label>
              ))}
            </div>
          </fieldset>
          <div className="full"><button className="btn btn-primary" type="submit">Add house</button></div>
        </form>
      )}

      {tab === "users" && (
        <div className="table-wrap card">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Bookings</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td data-label="Name">{u.name}</td>
                  <td data-label="Email">{u.email}</td>
                  <td data-label="Phone">{u.phone}</td>
                  <td data-label="Role"><span className="badge">{u.role}</span></td>
                  <td data-label="Bookings">{bookings.filter((b) => b.userId === u.id).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Field({ label, error, full, children }) {
  return (
    <label className={full ? "full" : ""}>{label}
      {children}
      {error && <span className="error">{error}</span>}
    </label>
  );
}

function BookingTable({ bookings, houses, users, onStatus, toast }) {
  if (!bookings.length)
    return <div className="empty card"><h3>No booking requests yet</h3><p className="muted">New requests from tenants will appear here.</p></div>;

  const act = (id, status, msg) => { onStatus(id, status); toast(msg); };

  return (
    <div className="table-wrap card">
      <table>
        <thead><tr><th>Tenant</th><th>Home</th><th>Move-in</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {bookings.map((b) => {
            const h = houses.find((x) => x.id === b.houseId);
            const u = users.find((x) => x.id === b.userId);
            return (
              <tr key={b.id}>
                <td data-label="Tenant">{u?.name || "Unknown"}<br /><span className="muted small">{u?.phone}</span></td>
                <td data-label="Home">{h?.title || "Removed listing"}</td>
                <td data-label="Move-in">{fmt(b.moveIn)}<br /><span className="muted small">{b.months} months</span></td>
                <td data-label="Total">{money(b.total)}</td>
                <td data-label="Status"><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                <td className="actions">
                  {b.status === "pending" && (
                    <>
                      <button className="btn btn-primary small-btn" onClick={() => act(b.id, "approved", "Booking approved.")}>Approve</button>
                      <button className="btn btn-danger small-btn" onClick={() => act(b.id, "rejected", "Booking rejected.")}>Reject</button>
                    </>
                  )}
                  {b.status === "approved" && (
                    <button className="btn btn-ghost small-btn" onClick={() => act(b.id, "cancelled", "Booking cancelled.")}>Cancel</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
