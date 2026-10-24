const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=70`;

export const AMENITY_LIST = ["Parking", "Lift", "Power backup", "Gym", "Swimming pool", "24x7 security", "Balcony", "Garden", "Wi-Fi ready", "Pet friendly"];
export const HOUSE_TYPES = ["Apartment", "Studio", "Villa", "Independent House"];
export const FURNISHING = ["Unfurnished", "Semi-furnished", "Fully furnished"];

export const seedHouses = [
  { id: "h1", title: "Sunlit 3BHK near Financial District", locality: "Gachibowli", city: "Hyderabad", type: "Apartment", rent: 42000, bedrooms: 3, bathrooms: 3, area: 1650, furnished: "Semi-furnished", status: "available", owner: "Ravi Teja", phone: "+91 98480 12345",
    images: [img("photo-1545324418-cc1a3fa10c00"), img("photo-1560448204-e02f11c3d0e2"), img("photo-1502672260266-1c1ef2d93688")],
    amenities: ["Parking", "Lift", "Power backup", "Gym", "24x7 security"],
    description: "A bright east-facing flat on the 9th floor with a wide balcony, modular kitchen and wardrobes in every bedroom. Ten minutes from the IT corridor, with a supermarket and a metro feeder stop inside the community." },
  { id: "h2", title: "Compact studio for working professionals", locality: "Madhapur", city: "Hyderabad", type: "Studio", rent: 18500, bedrooms: 1, bathrooms: 1, area: 520, furnished: "Fully furnished", status: "available", owner: "Sneha Reddy", phone: "+91 99890 54321",
    images: [img("photo-1522708323590-d24dbb6b0267"), img("photo-1493809842364-78817add7ffb")],
    amenities: ["Lift", "Wi-Fi ready", "Power backup", "24x7 security"],
    description: "Move-in ready studio with a bed, wardrobe, induction cooktop, fridge and AC. Walking distance to cafes and the Hitec City metro station." },
  { id: "h3", title: "Independent villa with private garden", locality: "Jubilee Hills", city: "Hyderabad", type: "Villa", rent: 125000, bedrooms: 4, bathrooms: 5, area: 3800, furnished: "Fully furnished", status: "available", owner: "Anand Rao", phone: "+91 90000 11122",
    images: [img("photo-1564013799919-ab600027ffc6"), img("photo-1512917774080-9991f1c4c750"), img("photo-1568605114967-8130f3a36994")],
    amenities: ["Parking", "Garden", "Swimming pool", "Power backup", "24x7 security", "Pet friendly"],
    description: "A quiet gated villa on a tree-lined road with a lawn, covered parking for three cars, a home office and a servant room. Suitable for families who want space and privacy." },
  { id: "h4", title: "2BHK in a gated community", locality: "Kondapur", city: "Hyderabad", type: "Apartment", rent: 28000, bedrooms: 2, bathrooms: 2, area: 1180, furnished: "Unfurnished", status: "available", owner: "Meena Kumari", phone: "+91 97000 88776",
    images: [img("photo-1502672260266-1c1ef2d93688"), img("photo-1560448204-e02f11c3d0e2")],
    amenities: ["Parking", "Lift", "Gym", "Swimming pool", "Balcony"],
    description: "Well-ventilated 2BHK with a clubhouse, children's play area and a jogging track. School bus pickup is available at the gate." },
  { id: "h5", title: "Budget 1BHK close to the metro", locality: "Miyapur", city: "Hyderabad", type: "Apartment", rent: 11500, bedrooms: 1, bathrooms: 1, area: 640, furnished: "Unfurnished", status: "available", owner: "Suresh Babu", phone: "+91 96660 22334",
    images: [img("photo-1493809842364-78817add7ffb"), img("photo-1522708323590-d24dbb6b0267")],
    amenities: ["Parking", "Power backup", "24x7 security"],
    description: "Simple, clean 1BHK five minutes from Miyapur metro. Ideal for students and early-career professionals commuting across the city." },
  { id: "h6", title: "Luxury 3BHK with city view", locality: "Banjara Hills", city: "Hyderabad", type: "Apartment", rent: 68000, bedrooms: 3, bathrooms: 4, area: 2100, furnished: "Fully furnished", status: "available", owner: "Farah Khan", phone: "+91 98491 66778",
    images: [img("photo-1512917774080-9991f1c4c750"), img("photo-1545324418-cc1a3fa10c00"), img("photo-1560448204-e02f11c3d0e2")],
    amenities: ["Parking", "Lift", "Gym", "Swimming pool", "Balcony", "Power backup", "24x7 security"],
    description: "Top-floor apartment with floor-to-ceiling windows, imported fittings and two covered parking slots. The building has a rooftop lounge and a concierge desk." },
  { id: "h7", title: "Family house with terrace", locality: "Kukatpally", city: "Hyderabad", type: "Independent House", rent: 32000, bedrooms: 3, bathrooms: 3, area: 1800, furnished: "Semi-furnished", status: "available", owner: "Venkat Naidu", phone: "+91 98850 99001",
    images: [img("photo-1568605114967-8130f3a36994"), img("photo-1570129477492-45c003edd2be")],
    amenities: ["Parking", "Garden", "Balcony", "Pet friendly"],
    description: "Ground-plus-one independent house with an open terrace and a small front yard. The owner lives in the same lane and handles repairs quickly." },
  { id: "h8", title: "Modern 2BHK, ready to move in", locality: "Manikonda", city: "Hyderabad", type: "Apartment", rent: 24000, bedrooms: 2, bathrooms: 2, area: 1050, furnished: "Semi-furnished", status: "available", owner: "Lakshmi Prasad", phone: "+91 99120 33445",
    images: [img("photo-1560448204-e02f11c3d0e2"), img("photo-1502672260266-1c1ef2d93688")],
    amenities: ["Lift", "Parking", "Gym", "Wi-Fi ready", "Power backup"],
    description: "Newly painted 2BHK with wardrobes, chimney and geysers installed. Close to the Lanco Hills offices and several restaurants." },
  { id: "h9", title: "Cozy 2BHK with garden balcony", locality: "Hitech City", city: "Hyderabad", type: "Apartment", rent: 35000, bedrooms: 2, bathrooms: 2, area: 1300, furnished: "Fully furnished", status: "available", owner: "Rohit Verma", phone: "+91 98765 43210",
    images: [img("photo-1570129477492-45c003edd2be"), img("photo-1564013799919-ab600027ffc6")],
    amenities: ["Parking", "Lift", "Balcony", "Garden", "Wi-Fi ready", "24x7 security"],
    description: "A calm flat overlooking the community garden, fully furnished with a sofa set, dining table, washing machine and two ACs." },
];

export const seedUsers = [
  { id: "u-admin", name: "Admin", email: "admin@keynest.com", phone: "+91 90000 00000", password: "admin123", role: "admin" },
  { id: "u-demo", name: "Demo Tenant", email: "user@keynest.com", phone: "+91 91111 11111", password: "user123", role: "user" },
];
