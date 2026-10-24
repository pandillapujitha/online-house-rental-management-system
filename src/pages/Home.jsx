import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { HOUSE_TYPES } from "../data/houses.js";
import HouseCard from "../components/HouseCard.jsx";
import HouseImage from "../components/HouseImage.jsx";

export default function Home() {
  const { houses } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [max, setMax] = useState("");

  const featured = houses.filter((h) => h.status === "available").slice(0, 6);
  const localities = [...new Set(houses.map((h) => h.locality))].slice(0, 6);

  const search = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (type) p.set("type", type);
    if (max) p.set("max", max);
    navigate(`/houses?${p.toString()}`);
  };

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1>Find a home you can move into next month.</h1>
            <p className="lead">Browse verified rentals, book a move-in date online and track your request without calling a single broker.</p>
            <form className="search-panel" onSubmit={search}>
              <label>
                Locality or title
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Gachibowli" />
              </label>
              <label>
                Type
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="">Any type</option>
                  {HOUSE_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
              <label>
                Max rent (₹/month)
                <input type="number" min="0" step="1000" value={max} onChange={(e) => setMax(e.target.value)} placeholder="30000" />
              </label>
              <button className="btn btn-primary" type="submit">Search homes</button>
            </form>
            <p className="muted small chips-row">
              Popular:&nbsp;
              {localities.map((l) => (
                <Link key={l} className="chip" to={`/houses?q=${encodeURIComponent(l)}`}>{l}</Link>
              ))}
            </p>
          </div>
          <div className="hero-collage" aria-hidden="true">
            <HouseImage className="c1" src={featured[0]?.images[0]} alt="" />
            <HouseImage className="c2" src={featured[2]?.images[0]} alt="" />
            <div className="c3">
              <strong>{houses.length}</strong> homes listed
              <span>{houses.filter((h) => h.status === "available").length} available now</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Available this week</h2>
            <Link to="/houses" className="link">See all houses</Link>
          </div>
          <div className="grid">
            {featured.map((h) => <HouseCard key={h.id} house={h} />)}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2>How renting works</h2>
          <ol className="steps">
            <li><h3>Search and shortlist</h3><p>Filter by rent, bedrooms and furnishing, then save the homes you like.</p></li>
            <li><h3>Request a booking</h3><p>Choose a move-in date and lease length. You see the deposit and total before you send.</p></li>
            <li><h3>Get approval</h3><p>The admin reviews your request. Track the status from your dashboard.</p></li>
          </ol>
        </div>
      </section>
    </>
  );
}
