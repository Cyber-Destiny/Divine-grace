/* ==========================================================================
   DIVINE GRACE — SITE SETTINGS
   Edit this file to change the hotel's details, prices and room content.
   Everything on the website reads from here.
   ========================================================================== */

window.HOTEL = {
  name: "Divine Grace",
  fullName: "Divine Grace Hotel",
  descriptor: "Hotel · Suites · Events",

  /* ---- Contact (REPLACE THESE PLACEHOLDERS) ---- */
  phoneDisplay: "+234 800 000 0000",
  phone: "+2348000000000",          // used for tap-to-call
  whatsapp: "2348000000000",        // international format, digits only, no "+"
  email: "reservations@divinegracehotel.com",
  address: "Your street address, City, State, Nigeria",
  mapQuery: "",                     // e.g. "Divine Grace Hotel, Ibadan" — shows a live Google map when filled in

  checkIn: "2:00 PM",
  checkOut: "12:00 noon",
  frontDesk: "open 24 hours",

  currency: "₦",

  social: {
    instagram: "#",
    facebook: "#",
    tiktok: "#",
  },
};

/* ---- Rooms & suites -------------------------------------------------------
   price  : nightly rate in Naira (PLACEHOLDERS — set your real rates)
   images : file names from assets/img (without .webp), first one is the cover
   -------------------------------------------------------------------------- */
window.ROOMS = [
  {
    id: "standard",
    name: "Standard Room",
    tag: "Calm, complete and beautifully lit",
    price: 35000,
    bed: "King-size bed",
    blurb:
      "Everything you need for a restful night: a deep king-size bed with a tufted headboard, soft white linens, cool air-conditioning and ambient ceiling lighting you can switch to suit your mood.",
    highlights: ["King bed", "Mood lighting", "Shower cabin"],
    amenities: [
      "King-size tufted bed",
      "Colour-changing mood lighting",
      "Split-unit air-conditioning",
      "Flat-screen TV",
      "Work desk",
      "Mirrored wardrobe",
      "Shower cabin with massage jets",
      "Card-key door & video intercom",
    ],
    images: ["standard-blue", "standard-ruby", "standard-bed-violet", "standard-desk", "wardrobe", "bath-shower", "standard-blinds"],
  },
  {
    id: "executive",
    name: "Executive Room",
    tag: "More space, more storage, more ease",
    price: 50000,
    bed: "King-size bed",
    blurb:
      "A generous room for longer stays and business trips. A full-height wardrobe with a mirror, a lounge armchair, blackout blinds on every window and glossy marble-effect floors.",
    highlights: ["King bed", "Lounge chair", "Blackout blinds"],
    amenities: [
      "King-size tufted bed",
      "Full-height mirrored wardrobe",
      "Lounge armchair",
      "Blackout roller blinds",
      "Marble-effect floors",
      "Split-unit air-conditioning",
      "Bedside intercom phone",
      "Card-key door & video intercom",
    ],
    images: ["executive-1", "executive-bed", "executive-2", "executive-3", "bath-shower"],
  },
  {
    id: "studio",
    name: "Deluxe Studio",
    tag: "Bedroom and lounge in one open space",
    price: 75000,
    bed: "King-size bed",
    blurb:
      "An open-plan studio where the bedroom flows into a private lounge. A quilted leather sofa set around a marble-top table, an illuminated feature wall and swirling stone floors that glow under the lights.",
    highlights: ["Private lounge", "Feature wall", "Stone floors"],
    amenities: [
      "King-size tufted bed",
      "Quilted leather sofa set",
      "Marble-top coffee table",
      "Illuminated feature wall",
      "Swirl-pattern stone floors",
      "Work desk",
      "Colour-changing mood lighting",
      "Card-key door & video intercom",
    ],
    images: ["studio-emerald", "studio-sapphire", "studio-wide-emerald", "studio-wide-ruby", "studio-blue", "studio-ruby"],
  },
  {
    id: "suite",
    name: "Grace Suite",
    tag: "A separate living room, just for you",
    price: 120000,
    bed: "King-size bed",
    blurb:
      "Our signature suite. Step into your own living room with plush sofas, a media wall and a marble coffee table, then through to a private bedroom. Room to host, unwind or work in comfort.",
    highlights: ["Living room", "Media wall", "Private bedroom"],
    amenities: [
      "Separate living room",
      "Two plush sofa sets",
      "Media wall with TV console",
      "Marble-top coffee table",
      "Mini fridge",
      "Writing desk",
      "Colour-changing mood lighting",
      "Card-key door & video intercom",
    ],
    images: ["suite-living", "suite-living-door", "suite-living-2", "suite-entrance", "bath-shower"],
  },
];

/* ---- "Set the mood" viewer: same room, different light ------------------- */
window.MOODS = [
  {
    space: "Deluxe Studio",
    moods: [
      { name: "Sapphire", color: "#4c63ff", img: "studio-sapphire" },
      { name: "Emerald", color: "#1fd1a5", img: "studio-emerald" },
    ],
  },
  {
    space: "Standard Room",
    moods: [
      { name: "Sapphire", color: "#4c63ff", img: "standard-blue" },
      { name: "Ruby", color: "#ff3b5c", img: "standard-ruby" },
    ],
  },
  {
    space: "King Bedroom",
    moods: [
      { name: "Amethyst", color: "#a35bff", img: "standard-bed-violet" },
      { name: "Sapphire", color: "#4c63ff", img: "standard-bed-blue" },
    ],
  },
  {
    space: "Velvet Lounge",
    moods: [
      { name: "Ruby", color: "#ff3b5c", img: "lounge-violet" },
      { name: "Sapphire", color: "#4c63ff", img: "lounge-blue" },
    ],
  },
];

/* ---- Gallery ------------------------------------------------------------- */
window.GALLERY = [
  { img: "executive-1", cat: "rooms", caption: "Executive Room" },
  { img: "hall-wide", cat: "events", caption: "The Grand Hall" },
  { img: "lounge-violet", cat: "lounges", caption: "Velvet Lounge" },
  { img: "studio-emerald", cat: "suites", caption: "Deluxe Studio in emerald light" },
  { img: "dining-2", cat: "dining", caption: "Restaurant & Café" },
  { img: "standard-blue", cat: "rooms", caption: "Standard Room" },
  { img: "pearl-blue", cat: "lounges", caption: "Pearl Lounge" },
  { img: "suite-living", cat: "suites", caption: "Grace Suite living room" },
  { img: "hall-stage", cat: "events", caption: "The Grand Hall stage" },
  { img: "sec-card", cat: "security", caption: "Card-key room access" },
  { img: "executive-bed", cat: "rooms", caption: "Executive Room bed" },
  { img: "dining-6", cat: "dining", caption: "Café seating by the windows" },
  { img: "studio-wide-ruby", cat: "suites", caption: "Deluxe Studio in ruby light" },
  { img: "hall-side", cat: "events", caption: "Hall and mezzanine gallery" },
  { img: "standard-ruby", cat: "rooms", caption: "Standard Room in ruby light" },
  { img: "lounge-deep-ruby", cat: "lounges", caption: "Velvet Lounge after dark" },
  { img: "suite-living-door", cat: "suites", caption: "Grace Suite, through to the bedroom" },
  { img: "door-301", cat: "security", caption: "Steel-finish room doors" },
  { img: "dining-8", cat: "dining", caption: "Restaurant with chandelier" },
  { img: "bath-shower", cat: "rooms", caption: "Shower cabin with massage jets" },
  { img: "pearl-green", cat: "lounges", caption: "Pearl Lounge in green" },
  { img: "hall-gallery-view", cat: "events", caption: "View from the hall gallery" },
  { img: "studio-sapphire", cat: "suites", caption: "Deluxe Studio feature wall" },
  { img: "sec-intercom", cat: "security", caption: "In-room video intercom" },
  { img: "standard-bed-violet", cat: "rooms", caption: "King bed in amethyst light" },
  { img: "dining-1", cat: "dining", caption: "Café tables" },
  { img: "executive-2", cat: "rooms", caption: "Executive Room wardrobe" },
  { img: "pearl-violet", cat: "lounges", caption: "Pearl Lounge seating" },
  { img: "hall-wide-2", cat: "events", caption: "Lighting truss and marble floors" },
  { img: "sec-cctv", cat: "security", caption: "CCTV coverage" },
  { img: "suite-entrance", cat: "suites", caption: "Grace Suite entrance" },
  { img: "standard-desk", cat: "rooms", caption: "Desk and TV" },
];
