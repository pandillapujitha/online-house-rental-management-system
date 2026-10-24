import { Link, useNavigate } from "react-router-dom";
import { useApp, money } from "../context/AppContext.jsx";
import HouseImage from "./HouseImage.jsx";

export default function HouseCard({ house }) {
  const { myFavorites, toggleFavorite, currentUser, toast } = useApp();
  const navigate = useNavigate();
  const liked = myFavorites.includes(house.id);

  const onFav = (e) => {
    e.preventDefault();
    if (!toggleFavorite(house.id)) {
      toast("Log in to save houses to your shortlist.", "warn");
      navigate("/login");
    }
  };

  return (
    <Link to={`/houses/${house.id}`} className="card house-card">
      <div className="house-photo">
        <HouseImage src={house.images[0]} alt={house.title} />
        <span className={`status status-${house.status}`}>{house.status === "available" ? "Available" : "Rented"}</span>
        {currentUser?.role !== "admin" && (
          <button className={`fav ${liked ? "on" : ""}`} onClick={onFav} aria-pressed={liked} aria-label={liked ? "Remove from shortlist" : "Save to shortlist"}>
            {liked ? "♥" : "♡"}
          </button>
        )}
        <span className="price-tag">{money(house.rent)}<small>/month</small></span>
      </div>
      <div className="house-body">
        <h3>{house.title}</h3>
        <p className="muted">{house.locality}, {house.city} · {house.type}</p>
        <ul className="facts">
          <li>{house.bedrooms} bed</li>
          <li>{house.bathrooms} bath</li>
          <li>{house.area} sq ft</li>
        </ul>
      </div>
    </Link>
  );
}
