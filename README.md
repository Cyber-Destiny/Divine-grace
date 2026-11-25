# Divine Grace Hotel: website

A fast, static hotel website (plain HTML, CSS and JavaScript, no build step) built around the hotel's own photos.

**Live site:** https://divine-grace-blue.vercel.app

The Vercel project `divine-grace` is connected to this repository, so every push redeploys the site automatically.

## What's on the site

- **Hero** with drifting photo columns and a quick booking bar
- **Suites**: Standard, Executive and Presidential. Each has a hover slideshow and a full photo viewer with amenities and price
- **Set the Mood**: an interactive viewer that shows the same room lit in different LED colours
- **360° virtual tour**: drag (or move your phone) to look around the Standard Suite, its bathroom, the Executive Suite and the Presidential Suite bedroom, with labelled hotspots and doorways between rooms
- **Event Hall**, with an enquiry form for weddings, conferences and other events
- **Restaurant**, **Velvet Lounge** and **Pearl Lounge**
- **Safety**: key-card locks, video intercom, CCTV, steel doors
- **Our people**, a filterable **Gallery** with a lightbox, and **Contact**
- Bookings, event enquiries and messages are sent to the hotel on **WhatsApp** (or by email), already filled in with dates, suite, guests and an estimated total. No backend is needed.

## Edit the hotel's details

Everything you'll want to change is in **`js/config.js`**:

| Setting | What it does |
| --- | --- |
| `phoneDisplay`, `phone` | Reception number shown on the site and used for tap-to-call |
| `whatsapp` | WhatsApp number in international format, digits only (e.g. `2348031234567`) |
| `email`, `address` | Contact details |
| `mapQuery` | Fill in (e.g. `"Divine Grace Hotel, Ibadan"`) to show a live Google map |
| `social` | Instagram / Facebook / TikTok links (icons stay hidden until you add a link) |
| `ROOMS[].price` | Nightly rate for each suite |
| `ROOMS[]` | Suite names, descriptions, amenities and which photos to show |
| `GALLERY` | Photos and captions in the gallery |

> The phone, WhatsApp, email, address and suite prices are **placeholders**. Replace them before going live.

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

## Adding a room or outdoor view to the 360° tour

1. Get a 2:1 panorama image: from a 360 camera, a phone's panorama/photo-sphere mode, or generated from photos.
2. Run `python3 tools/process_panorama.py path/to/panorama.jpg my-scene` (add `--partial` if the left and right edges don't join up). It writes `assets/tour/my-scene.jpg` and prints a `haov` value.
3. Add a scene to `TOUR.scenes` in `js/config.js` with that image name and `haov`. Add `hotspots` with `go: "<scene id>"` to link doorways between scenes.

The current 360° views were generated with AI from the hotel's own photos, and the site says so under the viewer.

## Adding or replacing photos

Put the new originals in a folder, add them to the `MAP` in `tools/optimize_images.py`, then run:

```bash
python3 tools/optimize_images.py path/to/originals
```

This writes a full-size and a thumbnail WebP version of each photo into `assets/img/`.
