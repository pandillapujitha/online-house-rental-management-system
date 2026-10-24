import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { HOUSE_TYPES, FURNISHING } from "../data/houses.js";
import HouseCard from "../components/HouseCard.jsx";

export default function Listings() {
  const { houses } = useApp();
  const [params, setParams] = useSearchParams();

  const f = {
    q: params.get("q") || "",
    type: params.get("type") || "",
    beds: params.get("beds") || "",
    furnished: params.get("furnished") || "",
    min: params.get("min") || "",
    max: params.get("max") || "",
    available: params.get("available") === "1",
    sort: params.get("sort") || "new",
  };

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === "" || value === false) next.delete(key);
    else next.set(key, value === true ? "1" : value);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    let list = houses.filter((h) => {
      if (q && !`${h.title} ${h.locality} ${h.city} ${h.type}`.toLowerCase().includes(q)) return false;
      if (f.type && h.type !== f.type) return false;
      if (f.beds && (f.beds === "4" ? h.bedrooms < 4 : h.bedrooms !== Number(f.beds))) return false;
      if (f.furnished && h.furnished !== f.furnished) return false;
      if (f.min && h.rent < Number(f.min)) return false;
      if (f.max && h.rent > Number(f.max)) return false;
      if (f.available && h.status !== "available") return false;
      return true;
    });
    if (f.sort === "low") list = [...list].sort((a, b) => a.rent - b.rent);
    if (f.sort === "high") list = [...list].sort((a, b) => b.rent - a.rent);
    if (f.sort === "area") list = [...list].sort((a, b) => b.area - a.area);
    return list;
  }, [houses, params]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container page">
      <h1 className="page-title">Browse houses</h1>
      <div className="listing-layout">
        <aside className="filters card">
          <div className="filters-head">
            <h2>Filters</h2>
            <button className="link-btn" onClick={() => setParams({}, { replace: true })}>Clear all</button>
          </div>
          <label>Search
            <input value={f.q} onChange={(e) => set("q", e.target.value)} placeholder="Locality, title, type" />
          </label>
          <label>Property type
            <select value={f.type} onChange={(e) => set("type", e.target.value)}>
              <option value="">Any</option>
              {HOUSE_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label>Bedrooms
            <select value={f.beds} onChange={(e) => set("beds", e.target.value)}>
              <option value="">Any</option>
              <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4+</option>
            </select>
          </label>
          <label>Furnishing
            <select value={f.furnished} onChange={(e) => set("furnished", e.target.value)}>
              <option value="">Any</option>
              {FURNISHING.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <div className="two">
            <label>Min rent
              <input type="number" min="0" step="1000" value={f.min} onChange={(e) => set("min", e.target.value)} placeholder="0" />
            </label>
            <label>Max rent
              <input type="number" min="0" step="1000" value={f.max} onChange={(e) => set("max", e.target.value)} placeholder="Any" />
            </label>
          </div>
          <label className="check">
            <input type="checkbox" checked={f.available} onChange={(e) => set("available", e.target.checked)} />
            Show available homes only
          </label>
        </aside>

        <section>
          <div className="results-bar">
            <p><strong>{results.length}</strong> {results.length === 1 ? "home" : "homes"} found</p>
            <label className="inline">Sort by
              <select value={f.sort} onChange={(e) => set("sort", e.target.value)}>
                <option value="new">Newest</option>
                <option value="low">Rent: low to high</option>
                <option value="high">Rent: high to low</option>
                <option value="area">Largest area</option>
              </select>
            </label>
          </div>
          {results.length ? (
            <div className="grid two-col">
              {results.map((h) => <HouseCard key={h.id} house={h} />)}
            </div>
          ) : (
            <div className="empty card">
              <h3>No homes match these filters</h3>
              <p className="muted">Try a higher maximum rent or clear a few filters.</p>
              <button className="btn btn-primary" onClick={() => setParams({}, { replace: true })}>Clear filters</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
