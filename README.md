# KeyNest – Online House Rental Management System

## 🚀 Live Demo

**Live Website:** https://online-house-rental-management-syst-theta.vercel.app/

A responsive single-page app built with **React 18, React Router 6, Hooks, Context API, HTML, CSS and JavaScript** (bundled with Vite).
All data is mock data kept in the browser (`localStorage`), so no backend or database is needed.

## Run it

Requires Node.js 18 or newer.

```bash
npm install
npm run dev        # open the URL shown, usually http://localhost:5173
npm run build      # production build in /dist
```

## Demo logins

| Role   | Email              | Password |
|--------|--------------------|----------|
| Tenant | user@keynest.com   | user123  |
| Admin  | admin@keynest.com  | admin123 |

## Features

- **Home**: hero search, featured homes, how renting works
- **Listings**: filter by text, type, bedrooms, furnishing, rent range, availability; sort; filters live in the URL
- **House details**: photo gallery, specs, amenities, owner contact, booking form with live cost (rent + 2-month deposit)
- **Auth**: register (with validation), login, logout, protected routes, role-based access
- **Rental booking**: request with move-in date and lease length; status flow pending → approved / rejected / cancelled
- **User dashboard**: booking history with cancel, shortlist (favourites), profile edit
- **Admin dashboard**: overview stats, approve/reject bookings, add/delete houses, change availability, user list, reset demo data

## Project structure

```
src/
  main.jsx            entry, Router + provider
  App.jsx             route table
  styles.css          design tokens + responsive layout
  context/AppContext  global state (houses, users, bookings, auth) + localStorage
  data/houses.js      mock houses and seed users
  components/         Navbar, Footer, HouseCard, HouseImage, Toasts, ProtectedRoute
  pages/              Home, Listings, HouseDetails, Login, Register, Dashboard, Admin
```

## Notes

- House photos load from Unsplash, so an internet connection is needed to see them. Without it a placeholder is shown.
- Passwords are stored in plain text in `localStorage` because this is a demo. A real system needs a backend with hashed passwords.
- To reset everything, use **Reset demo data** in the admin dashboard or clear the site's storage.
