/* ==========================================================================
   DIVINE GRACE HOTEL: SITE SETTINGS
   Change the hotel's details, prices and suite information here.
   The whole website reads from this file.
   ========================================================================== */

window.HOTEL = {
  name: "Divine Grace",
  fullName: "Divine Grace Hotel and Suites",   // as on the Google listing (there is another one in Ibadan)
  tagline: "Lodging · Dining · Events",

  /* ---- Contact details (PLACEHOLDERS: replace with the real ones) ---- */
  phoneDisplay: "+234 800 000 0000",
  phone: "+2348000000000",          // used for tap-to-call
  whatsapp: "2348000000000",        // country code + number, digits only, no "+" or spaces
  email: "info@divinegracehotel.com",
  address: "Ifeoluwa GRA Phase 2, beside Adekunle Babatunde Street, Abuja–Kaba Expressway, Omu-Aran, Kwara State",
  mapQuery: "Divine Grace Hotel and Suites - Omu-Aran",   // the Google listing name, so the map finds this hotel and not the Ibadan one
  googleListing: "https://www.google.com/search?kgmid=/g/11_0k4b53y",   // "See our reviews on Google" link; "" hides it

  checkIn: "2:00 PM",
  checkOut: "12:00 noon",
  frontDesk: "open 24 hours",
  restaurantHours: "",              // e.g. "7:00 AM – 10:00 PM daily". Leave "" to hide the line

  currency: "₦",

  /* Leave as "" to hide an icon */
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },
};

/* ---- Suites ----------------------------------------------------------------
   price  : nightly rate in Naira (also written in the FAQ and description in index.html)
   images : photo names from assets/img (without .webp). The first is the cover.
   -------------------------------------------------------------------------- */
window.ROOMS = [
  {
    id: "standard",
    name: "Standard Suite",
    tag: "Simple, clean and comfortable",
    price: 50000,
    blurb:
      "Everything you need for a good night. A king-size bed with a padded headboard, a work desk, a TV on the wall and a wardrobe with a full-length mirror. The ceiling lights can also change colour if you want a softer mood at night.",
    highlights: ["King-size bed", "Work desk", "Air-conditioning"],
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
    images: ["standard-blue", "standard-bed-violet", "standard-desk", "wardrobe", "bath-shower", "standard-blinds"],
  },
  {
    id: "executive",
    name: "Executive Suite",
    tag: "Bedroom and sitting area in one big room",
    price: 70000,
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
    images: ["studio-sapphire", "studio-wide-ruby", "studio-blue", "bath-shower"],
  },
  {
    id: "presidential",
    name: "Presidential Suite",
    tag: "Your own living room and a separate bedroom",
    price: 90000,
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
    images: ["suite-living", "executive-1", "suite-living-door", "executive-bed", "suite-living-2", "suite-entrance", "bath-shower"],
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
  { img: "outside-compound", cat: "outside", caption: "The hotel and courtyard in Omu-Aran", wide: true },
  { img: "executive-1", cat: "suites", caption: "Presidential Suite bedroom" },
  { img: "hall-wide", cat: "events", caption: "The event hall" },
  { img: "outside-front", cat: "outside", caption: "The rotunda from the road" },
  { img: "studio-sapphire", cat: "suites", caption: "Executive Suite" },
  { img: "pearl-blue", cat: "lounges", caption: "Pearl Lounge" },
  { img: "dining-2", cat: "dining", caption: "The restaurant" },
  { img: "outside-fountain", cat: "outside", caption: "The rotunda and fountain" },
  { img: "standard-blue", cat: "suites", caption: "Standard Suite" },
  { img: "lounge-violet", cat: "lounges", caption: "Velvet Club" },
  { img: "hall-stage", cat: "events", caption: "The stage" },
  { img: "suite-living", cat: "suites", caption: "Presidential Suite living room" },
  { img: "outside-courtyard", cat: "outside", caption: "The courtyard fountain", wide: true },
  { img: "outside-rotunda", cat: "outside", caption: "Main entrance" },
  { img: "sec-card", cat: "security", caption: "Key-card lock" },
  { img: "studio-wide-ruby", cat: "suites", caption: "Executive Suite sitting area" },
  { img: "dining-1", cat: "dining", caption: "Restaurant tables and drinks chiller" },
  { img: "hall-side", cat: "events", caption: "Hall and upper gallery" },
  { img: "outside-side", cat: "outside", caption: "The suites block and front gate" },
  { img: "executive-bed", cat: "suites", caption: "Presidential Suite bed" },
  { img: "pearl-violet", cat: "lounges", caption: "Pearl Lounge seating" },
  { img: "door-301", cat: "security", caption: "Steel door to Room 301" },
  { img: "suite-living-door", cat: "suites", caption: "Presidential Suite, door to the bedroom" },
  { img: "outside-sign", cat: "outside", caption: "Divine's Grace Hotel & Suites" },
  { img: "hall-gallery-view", cat: "events", caption: "View from the upper gallery" },
  { img: "standard-bed-violet", cat: "suites", caption: "Standard Suite bed" },
  { img: "lounge-blue", cat: "lounges", caption: "Velvet Club booths" },
  { img: "sec-intercom", cat: "security", caption: "Video intercom inside a suite" },
  { img: "bath-shower", cat: "suites", caption: "Shower cabin" },
  { img: "studio-blue", cat: "suites", caption: "Executive Suite bed and sofas" },
  { img: "hall-wide-2", cat: "events", caption: "Lighting rig and marble floor" },
  { img: "suite-entrance", cat: "suites", caption: "Presidential Suite living room" },
  { img: "sec-cctv", cat: "security", caption: "CCTV camera" },
  { img: "standard-desk", cat: "suites", caption: "Standard Suite desk and TV" },
];
