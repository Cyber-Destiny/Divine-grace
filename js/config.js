/* ==========================================================================
   DIVINE GRACE HOTEL: SITE SETTINGS
   Change the hotel's details, prices and suite information here.
   The whole website reads from this file.
   ========================================================================== */

window.HOTEL = {
  name: "Divine Grace",
  fullName: "Divine Grace Hotel",

  /* ---- Contact details (PLACEHOLDERS: replace with the real ones) ---- */
  phoneDisplay: "+234 800 000 0000",
  phone: "+2348000000000",          // used for tap-to-call
  whatsapp: "2348000000000",        // country code + number, digits only, no "+" or spaces
  email: "info@divinegracehotel.com",
  address: "Omu-Aran, Kwara State, Nigeria",       // add the street when ready, written exactly as on your Google Business Profile
  mapQuery: "",                     // e.g. "Divine Grace Hotel, Ibadan". When filled in, a live Google map appears

  checkIn: "2:00 PM",
  checkOut: "12:00 noon",
  frontDesk: "open 24 hours",

  currency: "₦",

  /* Leave as "" to hide an icon */
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },
};

/* ---- Suites ----------------------------------------------------------------
   price  : nightly rate in Naira (PLACEHOLDERS: set your real prices)
   images : photo names from assets/img (without .webp). The first is the cover.
   -------------------------------------------------------------------------- */
window.ROOMS = [
  {
    id: "standard",
    name: "Standard Suite",
    tag: "Simple, clean and comfortable",
    price: 35000,
    blurb:
      "Everything you need for a good night. A king-size bed with a padded headboard, a work desk, a TV on the wall and a wardrobe with a full-length mirror. The ceiling lights change colour too, so you can keep the room bright or make it cosy.",
    highlights: ["King-size bed", "Work desk", "Colour lights"],
    amenities: [
      "King-size bed",
      "Air-conditioning",
      "Wall-mounted TV",
      "Work desk",
      "Wardrobe with mirror",
      "Colour-changing ceiling lights",
      "Shower cabin",
      "Key-card door and video intercom",
    ],
    images: ["standard-blue", "standard-ruby", "standard-bed-violet", "standard-desk", "wardrobe", "bath-shower", "standard-blinds"],
  },
  {
    id: "executive",
    name: "Executive Suite",
    tag: "Bedroom and sitting area in one big room",
    price: 60000,
    blurb:
      "More room to spread out. The bed is at one end and a leather sofa set is at the other, around a marble-top table, so you can have a visitor over or work away from the bed. The lit feature wall and the swirled stone floor make this one of our best-looking rooms.",
    highlights: ["Sitting area", "Leather sofas", "Feature wall"],
    amenities: [
      "King-size bed",
      "Leather sofa set",
      "Marble-top coffee table",
      "Lit feature wall",
      "Work desk",
      "Colour-changing ceiling lights",
      "Air-conditioning",
      "Key-card door and video intercom",
    ],
    images: ["studio-emerald", "studio-sapphire", "studio-wide-emerald", "studio-wide-ruby", "studio-blue", "studio-ruby", "bath-shower"],
  },
  {
    id: "presidential",
    name: "Presidential Suite",
    tag: "Your own living room and a separate bedroom",
    price: 120000,
    blurb:
      "Our biggest suite. You walk into a private living room with two sofas, a TV wall, a mini fridge and a desk. The bedroom is through its own door, with a king-size bed, a full-height wardrobe and an armchair by the window. Good for families, long stays or anyone who wants to host in private.",
    highlights: ["Living room", "Separate bedroom", "Mini fridge"],
    amenities: [
      "Private living room",
      "Separate bedroom",
      "King-size bed",
      "Two sofas and a TV wall",
      "Mini fridge",
      "Writing desk",
      "Full-height wardrobe",
      "Blackout blinds",
      "Colour-changing ceiling lights",
      "Key-card door and video intercom",
    ],
    images: ["suite-living", "executive-1", "suite-living-door", "executive-bed", "suite-living-2", "executive-2", "suite-entrance", "bath-shower"],
  },
];

/* ---- Mood lighting viewer: the same room in different colours ---------- */
window.MOODS = [
  {
    space: "Executive Suite",
    moods: [
      { name: "Blue", color: "#4c63ff", img: "studio-sapphire" },
      { name: "Green", color: "#1fd1a5", img: "studio-emerald" },
    ],
  },
  {
    space: "Standard Suite",
    moods: [
      { name: "Blue", color: "#4c63ff", img: "standard-blue" },
      { name: "Red", color: "#ff3b5c", img: "standard-ruby" },
    ],
  },
  {
    space: "Velvet Lounge",
    moods: [
      { name: "Red", color: "#ff3b5c", img: "lounge-violet" },
      { name: "Blue", color: "#4c63ff", img: "lounge-blue" },
    ],
  },
];

/* ---- 360° virtual tour ---------------------------------------------------
   image    : file name in assets/tour (without .jpg). Make one with
              tools/process_panorama.py, which also prints the haov value.
   room     : suite id from ROOMS above, so "Book this suite" picks the right one
   haov     : how far round the picture goes, in degrees (360 = all the way)
   yaw/pitch: where the view starts (yaw: left/right, pitch: up/down)
   hotspots : doorways: a gold arrow at yaw/pitch that walks to scene "go"
   -------------------------------------------------------------------------- */
window.TOUR = {
  scenes: [
    {
      id: "standard",
      title: "Bedroom",
      room: "standard",
      image: "standard-suite",
      haov: 360,
      yaw: 10,
      pitch: -6,
      hotspots: [
        { yaw: 116, pitch: -8, go: "bathroom", text: "Bathroom" },
      ],
    },
    {
      id: "bathroom",
      title: "Bathroom",
      room: "standard",
      image: "bathroom",
      haov: 358,
      yaw: -55,
      pitch: 0,
      minPitch: -38,
      hotspots: [
        { yaw: 93, pitch: -6, go: "standard", text: "Back to the bedroom" },
      ],
    },
    {
      id: "executive",
      title: "Bedroom and lounge",
      room: "executive",
      image: "executive-suite",
      haov: 244.8,
      yaw: -15,
      pitch: -6,
    },
    {
      id: "presidential-bedroom",
      title: "Bedroom",
      room: "presidential",
      image: "presidential-bedroom",
      haov: 358,
      yaw: 4,
      pitch: -8,
    },
  ],
};

/* ---- Gallery --------------------------------------------------------------
   cat must be one of: outside, suites, events, dining, lounges, security
   wide: true shows a landscape photo across two columns
   -------------------------------------------------------------------------- */
window.GALLERY = [
  { img: "outside-night", cat: "outside", caption: "The hotel at night", wide: true },
  { img: "executive-1", cat: "suites", caption: "Presidential Suite bedroom" },
  { img: "hall-wide", cat: "events", caption: "The event hall" },
  { img: "lounge-violet", cat: "lounges", caption: "Velvet Lounge" },
  { img: "studio-emerald", cat: "suites", caption: "Executive Suite with green lights" },
  { img: "dining-2", cat: "dining", caption: "The restaurant" },
  { img: "standard-blue", cat: "suites", caption: "Standard Suite" },
  { img: "pearl-blue", cat: "lounges", caption: "Pearl Lounge" },
  { img: "outside-night-2", cat: "outside", caption: "The rotunda and courtyard fountain", wide: true },
  { img: "suite-living", cat: "suites", caption: "Presidential Suite living room" },
  { img: "hall-stage", cat: "events", caption: "The stage" },
  { img: "sec-card", cat: "security", caption: "Key-card lock" },
  { img: "executive-bed", cat: "suites", caption: "Presidential Suite bed" },
  { img: "dining-6", cat: "dining", caption: "Tables by the windows" },
  { img: "studio-wide-ruby", cat: "suites", caption: "Executive Suite with red lights" },
  { img: "hall-side", cat: "events", caption: "Hall and upper gallery" },
  { img: "standard-ruby", cat: "suites", caption: "Standard Suite with red lights" },
  { img: "lounge-deep-ruby", cat: "lounges", caption: "Velvet Lounge at night" },
  { img: "suite-living-door", cat: "suites", caption: "Presidential Suite, door to the bedroom" },
  { img: "door-301", cat: "security", caption: "Steel door to Room 301" },
  { img: "dining-8", cat: "dining", caption: "Restaurant and chandelier" },
  { img: "bath-shower", cat: "suites", caption: "Shower cabin" },
  { img: "pearl-green", cat: "lounges", caption: "Pearl Lounge with green lights" },
  { img: "hall-gallery-view", cat: "events", caption: "View from the upper gallery" },
  { img: "studio-sapphire", cat: "suites", caption: "Executive Suite feature wall" },
  { img: "sec-intercom", cat: "security", caption: "Video intercom inside a suite" },
  { img: "standard-bed-violet", cat: "suites", caption: "Standard Suite bed" },
  { img: "dining-1", cat: "dining", caption: "Restaurant tables" },
  { img: "executive-2", cat: "suites", caption: "Presidential Suite wardrobe" },
  { img: "pearl-violet", cat: "lounges", caption: "Pearl Lounge seating" },
  { img: "hall-wide-2", cat: "events", caption: "Lighting rig and marble floor" },
  { img: "sec-cctv", cat: "security", caption: "CCTV camera" },
  { img: "suite-entrance", cat: "suites", caption: "Presidential Suite living room" },
  { img: "standard-desk", cat: "suites", caption: "Standard Suite desk and TV" },
];
