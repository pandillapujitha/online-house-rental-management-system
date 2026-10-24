import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { seedHouses, seedUsers } from "../data/houses.js";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

// Safe localStorage helpers so the app also works in private mode
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
};

export const money = (n) => "₹" + Number(n).toLocaleString("en-IN");
export const uid = (p) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export function AppProvider({ children }) {
  const [houses, setHouses] = useState(() => load("kn_houses", seedHouses));
  const [users, setUsers] = useState(() => load("kn_users", seedUsers));
  const [bookings, setBookings] = useState(() => load("kn_bookings", []));
  const [favorites, setFavorites] = useState(() => load("kn_favs", {}));
  const [currentUser, setCurrentUser] = useState(() => load("kn_session", null));
  const [toasts, setToasts] = useState([]);

  useEffect(() => save("kn_houses", houses), [houses]);
  useEffect(() => save("kn_users", users), [users]);
  useEffect(() => save("kn_bookings", bookings), [bookings]);
  useEffect(() => save("kn_favs", favorites), [favorites]);
  useEffect(() => save("kn_session", currentUser), [currentUser]);

  const toast = useCallback((message, kind = "ok") => {
    const id = uid("t");
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  // ---------- Auth ----------
  const login = (email, password) => {
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
    if (!user) return { ok: false, error: "Email or password is incorrect." };
    const { password: _pw, ...safe } = user;
    setCurrentUser(safe);
    return { ok: true, user: safe };
  };

  const register = ({ name, email, phone, password }) => {
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase()))
      return { ok: false, error: "An account with this email already exists." };
    const user = { id: uid("u"), name: name.trim(), email: email.trim(), phone: phone.trim(), password, role: "user" };
    setUsers((u) => [...u, user]);
    const { password: _pw, ...safe } = user;
    setCurrentUser(safe);
    return { ok: true, user: safe };
  };

  const logout = () => setCurrentUser(null);

  const updateProfile = (changes) => {
    setUsers((list) => list.map((u) => (u.id === currentUser.id ? { ...u, ...changes } : u)));
    setCurrentUser((u) => ({ ...u, ...changes }));
  };

  // ---------- Houses ----------
  const addHouse = (house) => setHouses((h) => [{ ...house, id: uid("h"), status: "available" }, ...h]);
  const deleteHouse = (id) => {
    setHouses((h) => h.filter((x) => x.id !== id));
    setBookings((b) => b.filter((x) => x.houseId !== id));
  };
  const setHouseStatus = (id, status) => setHouses((h) => h.map((x) => (x.id === id ? { ...x, status } : x)));

  // ---------- Favorites ----------
  const myFavorites = currentUser ? favorites[currentUser.id] || [] : [];
  const toggleFavorite = (houseId) => {
    if (!currentUser) return false;
    setFavorites((f) => {
      const list = f[currentUser.id] || [];
      return { ...f, [currentUser.id]: list.includes(houseId) ? list.filter((x) => x !== houseId) : [...list, houseId] };
    });
    return true;
  };

  // ---------- Bookings ----------
  const createBooking = ({ houseId, moveIn, months, note }) => {
    const house = houses.find((h) => h.id === houseId);
    const deposit = house.rent * 2;
    const booking = {
      id: uid("b"), houseId, userId: currentUser.id, moveIn, months: Number(months), note,
      rent: house.rent, deposit, total: house.rent * Number(months) + deposit,
      status: "pending", createdAt: new Date().toISOString(),
    };
    setBookings((b) => [booking, ...b]);
    return booking;
  };

  const updateBookingStatus = (id, status) => {
    const booking = bookings.find((b) => b.id === id);
    setBookings((list) => list.map((b) => (b.id === id ? { ...b, status } : b)));
    if (!booking) return;
    if (status === "approved") setHouseStatus(booking.houseId, "rented");
    if (status === "rejected" || status === "cancelled") {
      const stillApproved = bookings.some((b) => b.id !== id && b.houseId === booking.houseId && b.status === "approved");
      if (!stillApproved) setHouseStatus(booking.houseId, "available");
    }
  };

  const resetDemoData = () => {
    setHouses(seedHouses);
    setUsers(seedUsers);
    setBookings([]);
    setFavorites({});
    setCurrentUser(null);
  };

  const value = {
    houses, users, bookings, currentUser, toasts, myFavorites,
    login, register, logout, updateProfile,
    addHouse, deleteHouse, setHouseStatus,
    toggleFavorite, createBooking, updateBookingStatus,
    toast, resetDemoData,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
