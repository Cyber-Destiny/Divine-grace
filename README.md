# Divine Grace Hotel: website

A fast, static hotel website (plain HTML, CSS and JavaScript, no build step) built around the hotel's own photos.

## What's on the site

- **Hero** with drifting photo columns and a quick booking bar
- **Rooms & Suites**: Standard Room, Executive Room, Deluxe Studio and Grace Suite. Each has a hover slideshow and a full photo viewer with amenities and price
- **Set the Mood**: an interactive viewer that shows the same room lit in different LED colours
- **The Grand Hall** for events, with an event enquiry form
- **Restaurant & Café**, **Velvet Lounge** and **Pearl Lounge**
- **Safety & access**: card-key locks, video intercom, CCTV, steel doors
- **Our people**, a filterable **Gallery** with a lightbox, and **Contact**
- Bookings, event enquiries and messages are sent to the hotel on **WhatsApp** (or by email), already filled in with dates, room, guests and an estimated total. No backend is needed.

## Edit the hotel's details

Everything you'll want to change is in **`js/config.js`**:

| Setting | What it does |
| --- | --- |
| `phoneDisplay`, `phone` | Reception number shown on the site and used for tap-to-call |
| `whatsapp` | WhatsApp number in international format, digits only (e.g. `2348031234567`) |
| `email`, `address` | Contact details |
| `mapQuery` | Fill in (e.g. `"Divine Grace Hotel, Ibadan"`) to show a live Google map |
| `social` | Instagram / Facebook / TikTok links |
| `ROOMS[].price` | Nightly rate for each room type |
| `ROOMS[]` | Room names, descriptions, amenities and which photos to show |
| `GALLERY` | Photos and captions in the gallery |

> The phone, WhatsApp, email, address and room prices are **placeholders**. Replace them before going live.

## Preview locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Publish

Upload the whole folder to any static host:

- **Netlify / Vercel**: drag and drop the folder, or connect this repository
- **GitHub Pages**: Settings → Pages → deploy from the main branch, root folder
- **cPanel / shared hosting**: upload everything into `public_html`

## Adding or replacing photos

Put the new originals in a folder, add them to the `MAP` in `tools/optimize_images.py`, then run:

```bash
python3 tools/optimize_images.py path/to/originals
```

This writes a full-size and a thumbnail WebP version of each photo into `assets/img/`.
