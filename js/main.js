/* ==========================================================================
   Divine Grace Hotel: interactions
   ========================================================================== */
(() => {
  "use strict";

  const H = window.HOTEL;
  const ROOMS = window.ROOMS;
  const MOODS = window.MOODS;
  const GALLERY = window.GALLERY;
  const IMG = (name, small) => `assets/img/${name}${small ? "-sm" : ""}.webp`;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const money = (n) => H.currency + Number(n).toLocaleString("en-NG");

  // Never leave content hidden if something goes wrong
  const showAll = () => $$(".reveal").forEach((el) => el.classList.add("is-in"));
  window.addEventListener("error", showAll);

  /* ------------------------------------------------------------------
     Contact details from config
     ------------------------------------------------------------------ */
  const waLink = (text) => `https://wa.me/${H.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}`;
  const mailLink = (subject, body) =>
    `mailto:${H.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  // Open a WhatsApp link in a new tab, or an email in the visitor's mail app
  const openUrl = (url, newTab) => {
    const a = document.createElement("a");
    a.href = url;
    if (newTab) { a.target = "_blank"; a.rel = "noopener"; }
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  const mapLink = () =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(H.mapQuery || H.fullName + " " + H.address)}`;

  $$("[data-bind]").forEach((el) => {
    const v = H[el.dataset.bind];
    if (v) el.textContent = v;
  });
  $$("[data-link]").forEach((el) => {
    const t = el.dataset.link;
    if (t === "tel") el.href = `tel:${H.phone}`;
    if (t === "wa") el.href = waLink(`Hello ${H.fullName}, I'd like to make an enquiry.`);
    if (t === "mail") el.href = `mailto:${H.email}`;
    if (t === "map") el.href = mapLink();
  });
  $$("[data-social]").forEach((el) => {
    const url = H.social[el.dataset.social];
    if (url && url !== "#") { el.href = url; el.target = "_blank"; el.rel = "noopener"; }
    else el.hidden = true;
  });
  if (!$$("[data-social]").some((el) => !el.hidden)) $("#socials").hidden = true;
  $("#year").textContent = new Date().getFullYear();

  if (H.mapQuery) {
    const wrap = $("#map-wrap");
    wrap.innerHTML = `<iframe title="Map showing ${H.fullName}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
      src="https://www.google.com/maps?q=${encodeURIComponent(H.mapQuery)}&output=embed"></iframe>`;
  }

  /* ------------------------------------------------------------------
     Header: scrolled state, active link, mobile menu
     ------------------------------------------------------------------ */
  const header = $(".site-header");
  const waFloat = $(".wa-float");
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    waFloat.classList.toggle("is-visible", y > window.innerHeight * 0.6);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const navLinks = $$(".main-nav a");
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  navLinks.forEach((a) => { const s = $(a.getAttribute("href")); if (s) spy.observe(s); });

  const toggle = $(".menu-toggle");
  const menu = $("#mobile-menu");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      menu.hidden = false;
      $$("nav a", menu).forEach((a, i) => (a.style.transitionDelay = `${0.05 + i * 0.04}s`));
      requestAnimationFrame(() => menu.classList.add("is-open"));
    } else {
      menu.classList.remove("is-open");
      setTimeout(() => { if (toggle.getAttribute("aria-expanded") === "false") menu.hidden = true; }, 350);
    }
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  $$("a, button", menu).forEach((el) => el.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) setMenu(false); });

  /* ------------------------------------------------------------------
     Hero: drifting photo columns
     ------------------------------------------------------------------ */
  const heroSets = [
    ["executive-1", "lounge-violet", "outside-night-tall", "studio-emerald", "dining-2"],
    ["standard-blue", "pearl-blue", "suite-living", "hall-wide", "executive-bed"],
    ["studio-wide-ruby", "dining-6", "lounge-deep-ruby", "standard-bed-violet", "door-301"],
  ];
  $$(".hero-col").forEach((col, i) => {
    const imgs = [...heroSets[i], ...heroSets[i]]; // doubled for a seamless loop
    col.innerHTML = imgs
      .map((n, k) => `<figure><img src="${IMG(n, true)}" alt="" width="480" height="640" ${k < 3 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></figure>`)
      .join("");
  });

  /* ------------------------------------------------------------------
     Dates helpers
     ------------------------------------------------------------------ */
  const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const today = new Date();
  const tomorrow = new Date(Date.now() + 864e5);
  const pretty = (s) => s ? new Date(s + "T00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "";
  const nightsBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);

  function linkDates(form) {
    const ci = form.elements.checkin, co = form.elements.checkout;
    ci.min = iso(today);
    co.min = iso(tomorrow);
    if (!ci.value) ci.value = iso(today);
    if (!co.value) co.value = iso(tomorrow);
    ci.addEventListener("change", () => {
      if (!ci.value) return;
      const next = new Date(new Date(ci.value + "T00:00").getTime() + 864e5);
      co.min = iso(next);
      if (!co.value || co.value <= ci.value) co.value = iso(next);
      form.dispatchEvent(new Event("input"));
    });
  }

  /* ------------------------------------------------------------------
     Dialog helpers
     ------------------------------------------------------------------ */
  function openDialog(d) {
    if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
    document.body.style.overflow = "hidden";
  }
  function closeDialog(d) {
    if (typeof d.close === "function") d.close(); else d.removeAttribute("open");
  }
  $$("dialog").forEach((d) => {
    d.addEventListener("close", () => { if (!$("dialog[open]")) document.body.style.overflow = ""; });
    d.addEventListener("click", (e) => {
      if (e.target === d && !d.classList.contains("lightbox")) closeDialog(d); // click on backdrop
      if (e.target.closest("[data-close]")) closeDialog(d);
    });
  });

  /* ------------------------------------------------------------------
     Rooms
     ------------------------------------------------------------------ */
  const grid = $("#room-grid");
  grid.innerHTML = ROOMS.map((r, i) => `
    <article class="room-card reveal" style="--rd:${i * 0.08}s" data-room="${r.id}">
      <div class="room-media" role="button" tabindex="0" aria-label="See photos and details of the ${r.name}">
        ${r.images.slice(0, 4).map((n, k) => `<img src="${IMG(n, k > 0)}" alt="${k === 0 ? r.name : ""}" width="${k ? 480 : 810}" height="${k ? 640 : 1080}" loading="lazy" class="${k === 0 ? "is-on" : ""}">`).join("")}
        <div class="room-dots">${r.images.slice(0, 4).map((_, k) => `<i class="${k === 0 ? "is-on" : ""}"></i>`).join("")}</div>
        <div class="room-price"><small>From</small><strong>${money(r.price)}</strong></div>
        <div class="room-info"><h3>${r.name}</h3><p>${r.tag}</p></div>
      </div>
      <div class="room-foot">
        <div class="room-tags">${r.highlights.map((h) => `<span>${h}</span>`).join("")}</div>
        <div class="room-actions">
          <button class="btn btn-ghost" type="button" data-view="${r.id}">View suite</button>
          <button class="btn btn-gold" type="button" data-book="${r.id}">Book</button>
        </div>
      </div>
    </article>`).join("");

  // Hover slideshow on cards
  $$(".room-card").forEach((card) => {
    const imgs = $$(".room-media img", card);
    const dots = $$(".room-dots i", card);
    let i = 0, timer = null;
    const show = (n) => {
      imgs[i].classList.remove("is-on"); dots[i].classList.remove("is-on");
      i = n % imgs.length;
      imgs[i].classList.add("is-on"); dots[i].classList.add("is-on");
    };
    const start = () => { if (reduceMotion || timer) return; show(i + 1); timer = setInterval(() => show(i + 1), 1300); };
    const stop = () => { clearInterval(timer); timer = null; show(0); };
    card.addEventListener("mouseenter", start);
    card.addEventListener("mouseleave", stop);
    const media = $(".room-media", card);
    media.addEventListener("click", () => openRoom(card.dataset.room));
    media.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openRoom(card.dataset.room); } });
  });
  grid.addEventListener("click", (e) => {
    const v = e.target.closest("[data-view]"); if (v) openRoom(v.dataset.view);
    const b = e.target.closest("[data-book]"); if (b) openBooking(b.dataset.book);
  });

  // Room dialog
  const rm = $("#room-modal");
  let rmRoom = null, rmIndex = 0;
  function rmShow(n) {
    const imgs = rmRoom.images;
    rmIndex = (n + imgs.length) % imgs.length;
    const img = $("#rm-img");
    img.src = IMG(imgs[rmIndex]);
    img.alt = `${rmRoom.name}, photo ${rmIndex + 1}`;
    img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
    $("#rm-count").textContent = `${rmIndex + 1} / ${imgs.length}`;
    $$("#rm-thumbs button").forEach((b, k) => b.classList.toggle("is-on", k === rmIndex));
  }
  function openRoom(id) {
    rmRoom = ROOMS.find((r) => r.id === id);
    if (!rmRoom) return;
    $("#rm-title").textContent = rmRoom.name;
    $("#rm-tag").textContent = rmRoom.tag;
    $("#rm-price").textContent = money(rmRoom.price);
    $("#rm-blurb").textContent = rmRoom.blurb;
    $("#rm-amenities").innerHTML = rmRoom.amenities.map((a) => `<li><svg><use href="#i-check"/></svg>${a}</li>`).join("");
    $("#rm-thumbs").innerHTML = rmRoom.images.map((n, k) => `<button aria-label="Photo ${k + 1}"><img src="${IMG(n, true)}" alt="" loading="lazy"></button>`).join("");
    $$("#rm-thumbs button").forEach((b, k) => b.addEventListener("click", () => rmShow(k)));
    $("#rm-wa").href = waLink(`Hello ${H.fullName}, I have a question about the ${rmRoom.name}.`);
    $("#rm-tour").hidden = !(window.TOUR && (window.TOUR.scenes || []).some((sc) => sc.room === rmRoom.id));
    rmShow(0);
    openDialog(rm);
  }
  $$("[data-room-link]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); openRoom(a.dataset.roomLink); }));
  $(".rm-nav.prev", rm).addEventListener("click", () => rmShow(rmIndex - 1));
  $(".rm-nav.next", rm).addEventListener("click", () => rmShow(rmIndex + 1));
  rm.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") rmShow(rmIndex - 1);
    if (e.key === "ArrowRight") rmShow(rmIndex + 1);
  });
  swipe($(".rm-main", rm), () => rmShow(rmIndex + 1), () => rmShow(rmIndex - 1));
  $("#rm-book").addEventListener("click", () => { closeDialog(rm); openBooking(rmRoom.id); });

  /* ------------------------------------------------------------------
     Booking
     ------------------------------------------------------------------ */
  const bk = $("#booking-modal");
  const bkForm = $("#booking-form");
  $("#bk-room").innerHTML = ROOMS.map((r) => `<option value="${r.id}">${r.name} · from ${money(r.price)}</option>`).join("") +
    `<option value="any">Not sure yet, help me choose</option>`;
  linkDates(bkForm);

  function updateEstimate() {
    const f = bkForm.elements;
    const room = ROOMS.find((r) => r.id === f.room.value);
    const n = f.checkin.value && f.checkout.value ? nightsBetween(f.checkin.value, f.checkout.value) : 0;
    const qty = parseInt(f.qty.value, 10) || 1;
    const box = $("#bk-estimate");
    if (room && n > 0) {
      box.hidden = false;
      $("#bk-nights").textContent = `Estimate for ${n} night${n > 1 ? "s" : ""}, ${qty} suite${qty > 1 ? "s" : ""}`;
      $("#bk-total").textContent = money(room.price * n * qty);
    } else box.hidden = true;
  }
  bkForm.addEventListener("input", updateEstimate);
  bkForm.addEventListener("change", updateEstimate);

  function openBooking(roomId, preset = {}) {
    const f = bkForm.elements;
    if (roomId) f.room.value = roomId;
    if (preset.checkin) { f.checkin.value = preset.checkin; f.checkout.min = iso(new Date(new Date(preset.checkin + "T00:00").getTime() + 864e5)); }
    if (preset.checkout) f.checkout.value = preset.checkout;
    if (preset.guests) f.guests.value = preset.guests;
    $(".form-error", bkForm).hidden = true;
    updateEstimate();
    openDialog(bk);
  }
  $$("[data-open-booking]").forEach((b) => b.addEventListener("click", () => openBooking()));

  // Hero quick-book bar
  const qb = $("#quick-book");
  linkDates(qb);
  qb.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = qb.elements;
    openBooking(null, { checkin: f.checkin.value, checkout: f.checkout.value, guests: f.guests.value });
  });

  function validate(form, names) {
    let ok = true;
    names.forEach((n) => {
      const el = form.elements[n];
      const bad = !el.value.trim();
      el.classList.toggle("is-invalid", bad);
      if (bad) ok = false;
    });
    return ok;
  }
  function showError(form, msg) {
    const p = $(".form-error", form);
    p.textContent = msg; p.hidden = !msg;
  }

  function bookingMessage() {
    const f = bkForm.elements;
    const room = ROOMS.find((r) => r.id === f.room.value);
    const n = nightsBetween(f.checkin.value, f.checkout.value);
    return [
      `Hello ${H.fullName}, I'd like to book a stay.`,
      ``,
      `Suite: ${room ? room.name : "Not sure yet, please help me choose"}`,
      `Check-in: ${pretty(f.checkin.value)}`,
      `Check-out: ${pretty(f.checkout.value)} (${n} night${n > 1 ? "s" : ""})`,
      `Guests: ${f.guests.value}`,
      `Number of suites: ${f.qty.value}`,
      `Name: ${f.name.value.trim()}`,
      `Phone: ${f.phone.value.trim()}`,
      f.notes.value.trim() ? `Requests: ${f.notes.value.trim()}` : "",
    ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n").trim();
  }
  function bookingValid() {
    const f = bkForm.elements;
    if (!validate(bkForm, ["checkin", "checkout", "name", "phone"])) { showError(bkForm, "Please add your dates, name and phone number."); return false; }
    if (nightsBetween(f.checkin.value, f.checkout.value) < 1) { f.checkout.classList.add("is-invalid"); showError(bkForm, "Check-out must be after check-in."); return false; }
    showError(bkForm, ""); return true;
  }
  bkForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (bookingValid()) openUrl(waLink(bookingMessage()), true);
  });
  $("[data-send-email]", bkForm).addEventListener("click", () => {
    if (bookingValid()) openUrl(mailLink(`Booking request: ${bkForm.elements.name.value.trim()}`, bookingMessage()));
  });

  /* ------------------------------------------------------------------
     Event enquiry
     ------------------------------------------------------------------ */
  const ev = $("#event-modal");
  const evForm = $("#event-form");
  evForm.elements.date.min = iso(today);
  $$("[data-open-event]").forEach((b) => b.addEventListener("click", () => { showError(evForm, ""); openDialog(ev); }));
  const eventMessage = () => {
    const f = evForm.elements;
    return [
      `Hello ${H.fullName}, I'd like to ask about booking the event hall.`,
      ``,
      `Event: ${f.type.value}`,
      `Date: ${pretty(f.date.value)}`,
      `Guests: ${f.size.value}`,
      `Suites: ${f.rooms.value}`,
      `Name: ${f.name.value.trim()}`,
      `Phone: ${f.phone.value.trim()}`,
      f.notes.value.trim() ? `Notes: ${f.notes.value.trim()}` : "",
    ].join("\n").trim();
  };
  const eventValid = () => {
    if (!validate(evForm, ["date", "name", "phone"])) { showError(evForm, "Please add the date, your name and phone number."); return false; }
    showError(evForm, ""); return true;
  };
  evForm.addEventListener("submit", (e) => { e.preventDefault(); if (eventValid()) openUrl(waLink(eventMessage()), true); });
  $("[data-send-email]", evForm).addEventListener("click", () => { if (eventValid()) openUrl(mailLink(`Event enquiry: ${evForm.elements.type.value}`, eventMessage())); });

  /* ------------------------------------------------------------------
     Contact form
     ------------------------------------------------------------------ */
  const cf = $("#contact-form");
  const contactMessage = () => {
    const f = cf.elements;
    return `Hello ${H.fullName},\n\n${f.message.value.trim()}\n\nTopic: ${f.topic.value}\nName: ${f.name.value.trim()}\nPhone: ${f.phone.value.trim()}`;
  };
  const contactValid = () => {
    const ok = validate(cf, ["name", "phone", "message"]);
    showError(cf, ok ? "" : "Please add your name, phone number and a message.");
    return ok;
  };
  cf.addEventListener("submit", (e) => { e.preventDefault(); if (contactValid()) openUrl(waLink(contactMessage()), true); });
  $("[data-send-email]", cf).addEventListener("click", () => { if (contactValid()) openUrl(mailLink(`Enquiry: ${cf.elements.topic.value}`, contactMessage())); });
  $$("input, textarea", document).forEach((el) => el.addEventListener("input", () => el.classList.remove("is-invalid")));

  /* ------------------------------------------------------------------
     Set the mood
     ------------------------------------------------------------------ */
  const moodSec = $("#mood");
  const frame = $("#mood-frame");
  const spacesEl = $("#mood-spaces");
  const swatchesEl = $("#mood-swatches");
  let space = 0, mood = 0, autoTimer = null, userTouched = false;

  // Preload every mood photo into the frame (stacked for crossfade)
  frame.innerHTML = MOODS.flatMap((s, si) => s.moods.map((m, mi) =>
    `<img src="${IMG(m.img)}" alt="${s.space} lit in ${m.name.toLowerCase()}" data-key="${si}-${mi}" width="810" height="1080" loading="lazy">`)).join("");
  spacesEl.innerHTML = MOODS.map((s, i) => `<button type="button" aria-pressed="${i === 0}" data-space="${i}">${s.space}</button>`).join("");

  function renderSwatches() {
    swatchesEl.innerHTML = MOODS[space].moods.map((m, i) =>
      `<button type="button" class="swatch" style="--c:${m.color}" aria-pressed="${i === mood}" data-mood="${i}" aria-label="${m.name} light"><span>${m.name}</span></button>`).join("");
  }
  function applyMood() {
    const m = MOODS[space].moods[mood];
    $$("img", frame).forEach((img) => img.classList.toggle("is-on", img.dataset.key === `${space}-${mood}`));
    moodSec.style.setProperty("--glow", m.color);
    $("#mood-label").textContent = `${MOODS[space].space} · ${m.name}`;
    $$("button", spacesEl).forEach((b, i) => b.setAttribute("aria-pressed", String(i === space)));
    $$(".swatch", swatchesEl).forEach((b, i) => b.setAttribute("aria-pressed", String(i === mood)));
  }
  spacesEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-space]"); if (!b) return;
    userTouched = true; stopAuto();
    space = +b.dataset.space; mood = 0; renderSwatches(); applyMood();
  });
  swatchesEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-mood]"); if (!b) return;
    userTouched = true; stopAuto();
    mood = +b.dataset.mood; applyMood();
  });
  // Gentle auto-play while in view until the visitor takes over
  function tick() {
    mood++;
    if (mood >= MOODS[space].moods.length) { mood = 0; space = (space + 1) % MOODS.length; renderSwatches(); }
    applyMood();
  }
  function startAuto() { if (!reduceMotion && !userTouched && !autoTimer) autoTimer = setInterval(tick, 2600); }
  function stopAuto() { clearInterval(autoTimer); autoTimer = null; }
  new IntersectionObserver(([e]) => (e.isIntersecting ? startAuto() : stopAuto()), { threshold: 0.4 }).observe(moodSec);
  renderSwatches(); applyMood();

  /* ------------------------------------------------------------------
     360° virtual tour (Pannellum viewer, loaded only when needed)
     ------------------------------------------------------------------ */
  const TOUR = window.TOUR || { scenes: [] };
  const tourScenes = TOUR.scenes || [];
  const tourSec = $("#tour");
  const tourStage = $("#tour-stage");
  const sceneById = (id) => tourScenes.find((sc) => sc.id === id);
  const roomName = (id) => (ROOMS.find((r) => r.id === id) || {}).name || "";
  const firstSceneFor = (roomId) => tourScenes.find((sc) => sc.room === roomId);
  let viewer = null, pannellumLoading = null, currentScene = tourScenes.length ? tourScenes[0].id : null;

  if (!tourScenes.length) {
    tourSec.hidden = true;
    $$('a[href="#tour"]').forEach((a) => (a.hidden = true));
  }
  $("#tour-list").innerHTML = tourScenes.map((sc) => `
    <button type="button" class="tour-item" data-scene="${sc.id}" aria-pressed="${sc.id === currentScene}">
      <img src="assets/tour/${sc.image}-thumb.jpg" alt="" width="96" height="64" loading="lazy">
      <div><span>${roomName(sc.room)}</span><strong>${sc.title}</strong></div>
    </button>`).join("");

  function loadPannellum() {
    if (window.pannellum) return Promise.resolve();
    if (!pannellumLoading) {
      pannellumLoading = new Promise((resolve, reject) => {
        const tag = document.createElement("script");
        tag.src = "vendor/pannellum/pannellum.js";
        tag.onload = resolve;
        tag.onerror = () => { pannellumLoading = null; reject(); };
        document.head.appendChild(tag);
      });
    }
    return pannellumLoading;
  }

  function hotspotDom(div, hs) {
    div.classList.add("tour-hs", hs.go ? "tour-hs-go" : "tour-hs-info");
    div.innerHTML = `<span class="tour-hs-dot"></span><span class="tour-hs-label">${hs.text}</span>`;
    if (hs.go) {
      div.setAttribute("role", "button");
      div.setAttribute("tabindex", "0");
      div.setAttribute("aria-label", hs.text);
      div.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showScene(hs.go); } });
    }
  }

  function sceneConfig(sc) {
    const partial = sc.haov < 360;
    return {
      type: "equirectangular",
      panorama: `assets/tour/${sc.image}.jpg`,
      haov: sc.haov, vaov: 180,
      minYaw: partial ? -sc.haov / 2 : -180,
      maxYaw: partial ? sc.haov / 2 : 180,
      yaw: sc.yaw || 0, pitch: sc.pitch || 0, hfov: 100,
      minPitch: sc.minPitch !== undefined ? sc.minPitch : -75,
      maxPitch: sc.maxPitch !== undefined ? sc.maxPitch : 75,
      hotSpots: (sc.hotspots || []).map((h) => ({
        pitch: h.pitch, yaw: h.yaw,
        type: h.go ? "scene" : "info", sceneId: h.go,
        cssClass: "tour-hs-base", createTooltipFunc: hotspotDom, createTooltipArgs: h,
      })),
    };
  }

  function updateTourUI() {
    const sc = sceneById(currentScene);
    if (!sc) return;
    $("#tour-room").textContent = roomName(sc.room);
    $("#tour-title").textContent = sc.title;
    $("#tour-poster-img").src = `assets/tour/${sc.image}-thumb.jpg`;
    $$(".tour-item").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.scene === currentScene)));
  }

  let hintTimer = null;
  const hideHint = () => $("#tour-hint").classList.add("is-hidden");

  async function showScene(id) {
    if (id && sceneById(id)) currentScene = id;
    updateTourUI();
    $("#tour-poster").classList.add("is-hidden");
    $("#tour-error").hidden = true;
    if (viewer) {
      if (viewer.getScene() !== currentScene) viewer.loadScene(currentScene);
      return;
    }
    try { await loadPannellum(); } catch (err) { $("#tour-error").hidden = false; return; }
    if (viewer) { if (viewer.getScene() !== currentScene) viewer.loadScene(currentScene); return; }
    const scenes = {};
    tourScenes.forEach((sc) => (scenes[sc.id] = sceneConfig(sc)));
    viewer = window.pannellum.viewer("tour-viewer", {
      default: {
        firstScene: currentScene,
        sceneFadeDuration: 900,
        autoLoad: true,
        showControls: false,
        mouseZoom: "fullscreenonly",
        keyboardZoom: true,
        autoRotate: reduceMotion ? 0 : -1.5,
        autoRotateInactivityDelay: reduceMotion ? -1 : 6000,
        friction: 0.15,
        backgroundColor: [0.04, 0.045, 0.08],
        strings: { loadingLabel: "Loading the room…" },
      },
      scenes,
    });
    window.__tourViewer = viewer;
    viewer.on("scenechange", (sid) => { currentScene = sid; updateTourUI(); });
    viewer.on("error", () => { $("#tour-error").hidden = false; });
    viewer.on("mousedown", hideHint);
    viewer.on("touchstart", hideHint);
    clearTimeout(hintTimer);
    hintTimer = setTimeout(hideHint, 7000);
    if (reduceMotion) $('[data-tour="rotate"]').setAttribute("aria-pressed", "false");
  }

  $("#tour-start").addEventListener("click", () => showScene());
  $("#tour-list").addEventListener("click", (e) => {
    const b = e.target.closest("[data-scene]");
    if (b) showScene(b.dataset.scene);
  });
  $("#tour-book").addEventListener("click", () => {
    const sc = sceneById(currentScene);
    openBooking(sc ? sc.room : null);
  });

  // Toolbar
  const fsEnabled = document.fullscreenEnabled || document.webkitFullscreenEnabled;
  if (!fsEnabled) $('[data-tour="fullscreen"]').hidden = true;
  const canMotion = "DeviceOrientationEvent" in window && window.matchMedia("(pointer: coarse)").matches;
  if (canMotion) $('[data-tour="motion"]').hidden = false;

  $(".tour-tools").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-tour]");
    if (!b) return;
    const act = b.dataset.tour;
    if (act === "fullscreen") {
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      if (fsEl) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else (tourStage.requestFullscreen || tourStage.webkitRequestFullscreen).call(tourStage);
      return;
    }
    if (!viewer) await showScene();
    if (!viewer) return;
    if (act === "zoom-in") viewer.setHfov(viewer.getHfov() - 15);
    if (act === "zoom-out") viewer.setHfov(viewer.getHfov() + 15);
    if (act === "rotate") {
      const on = b.getAttribute("aria-pressed") === "true";
      if (on) viewer.stopAutoRotate(); else viewer.startAutoRotate(-1.5);
      b.setAttribute("aria-pressed", String(!on));
    }
    if (act === "motion") {
      const on = b.getAttribute("aria-pressed") === "true";
      if (on) { viewer.stopOrientation(); b.setAttribute("aria-pressed", "false"); return; }
      try {
        if (typeof DeviceOrientationEvent.requestPermission === "function") {
          const res = await DeviceOrientationEvent.requestPermission();
          if (res !== "granted") return;
        }
        viewer.startOrientation();
        b.setAttribute("aria-pressed", "true");
      } catch (err) { /* motion not available */ }
    }
  });

  // Start loading when the section comes into view
  if (tourScenes.length) {
    new IntersectionObserver(([e], obs) => {
      if (e.isIntersecting) { loadPannellum().catch(() => {}); obs.disconnect(); }
    }, { rootMargin: "600px 0px" }).observe(tourSec);
    new IntersectionObserver(([e], obs) => {
      if (e.isIntersecting) { showScene(); obs.disconnect(); }
    }, { threshold: 0.45 }).observe(tourStage);
  }

  // "360° tour" button inside the suite viewer
  $("#rm-tour").addEventListener("click", () => {
    const sc = rmRoom && firstSceneFor(rmRoom.id);
    closeDialog(rm);
    if (!sc) return;
    tourSec.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    showScene(sc.id);
  });

  /* ------------------------------------------------------------------
     Lounges: tap to swap light on touch devices
     ------------------------------------------------------------------ */
  $$(".lounge-card").forEach((c) => c.addEventListener("click", () => {
    if (window.matchMedia("(hover: none)").matches) {
      const alt = $(".alt", c); alt.style.opacity = alt.style.opacity === "1" ? "0" : "1";
    }
  }));

  /* ------------------------------------------------------------------
     Gallery + lightbox
     ------------------------------------------------------------------ */
  const gGrid = $("#gallery-grid");
  gGrid.innerHTML = GALLERY.map((g, i) => `
    <a class="g-item reveal${g.wide ? " wide" : ""}" href="${IMG(g.img)}" data-cat="${g.cat}" data-index="${i}" style="--rd:${(i % 4) * 0.06}s">
      <img src="${IMG(g.img, !g.wide)}" alt="${g.caption}" width="${g.wide ? 1280 : 480}" height="${g.wide ? 720 : 640}" loading="lazy" decoding="async">
      <span>${g.caption}</span>
    </a>`).join("");

  let lbList = [], lbIndex = 0;
  const lb = $("#lightbox");
  function lbShow(n) {
    lbIndex = (n + lbList.length) % lbList.length;
    const item = lbList[lbIndex];
    const img = $("#lb-img");
    img.src = IMG(item.img); img.alt = item.caption;
    img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
    $("#lb-caption").textContent = item.caption;
    $("#lb-count").textContent = `${lbIndex + 1} / ${lbList.length}`;
    // warm the next image
    const next = new Image(); next.src = IMG(lbList[(lbIndex + 1) % lbList.length].img);
  }
  function openLightbox(list, index) { lbList = list; lbShow(index); openDialog(lb); }

  gGrid.addEventListener("click", (e) => {
    const a = e.target.closest(".g-item"); if (!a) return;
    e.preventDefault();
    const visible = $$(".g-item:not(.is-hidden)", gGrid);
    const list = visible.map((el) => GALLERY[+el.dataset.index]);
    openLightbox(list, visible.indexOf(a));
  });
  $(".lb-nav.prev", lb).addEventListener("click", () => lbShow(lbIndex - 1));
  $(".lb-nav.next", lb).addEventListener("click", () => lbShow(lbIndex + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb-figure")) closeDialog(lb); });
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") lbShow(lbIndex - 1);
    if (e.key === "ArrowRight") lbShow(lbIndex + 1);
  });
  swipe($(".lb-figure", lb), () => lbShow(lbIndex + 1), () => lbShow(lbIndex - 1));

  // Other zoomable photos (hall, dining)
  $$("[data-lightbox]").forEach((fig) => {
    fig.addEventListener("click", () => {
      const box = fig.parentElement;
      if (box.classList.contains("was-dragged")) return;
      const group = $$("[data-lightbox]", box);
      const list = group.map((f) => ({ img: f.dataset.lightbox, caption: f.querySelector("img").alt }));
      openLightbox(list, group.indexOf(fig));
    });
  });

  // Links elsewhere on the page that open the gallery on one category
  $$("[data-gallery-filter]").forEach((a) => a.addEventListener("click", () => {
    const btn = $(`#gallery-filters [data-filter="${a.dataset.galleryFilter}"]`);
    if (btn) btn.click();
  }));

  $("#gallery-filters").addEventListener("click", (e) => {
    const b = e.target.closest("[data-filter]"); if (!b) return;
    $$("#gallery-filters button").forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-pressed", String(x === b)); });
    const f = b.dataset.filter;
    $$(".g-item", gGrid).forEach((el) => {
      el.classList.toggle("is-hidden", f !== "all" && el.dataset.cat !== f);
      el.classList.add("is-in");
    });
  });

  /* ------------------------------------------------------------------
     Dining strip: drag to scroll with the mouse
     ------------------------------------------------------------------ */
  const strip = $("#dining-strip");
  let down = false, startX = 0, startScroll = 0, moved = 0;
  strip.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    down = true; moved = 0; startX = e.clientX; startScroll = strip.scrollLeft;
    strip.classList.add("is-dragging"); strip.classList.remove("was-dragged");
  });
  window.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - startX; moved = Math.max(moved, Math.abs(dx));
    strip.scrollLeft = startScroll - dx;
  });
  window.addEventListener("pointerup", () => {
    if (!down) return;
    down = false; strip.classList.remove("is-dragging");
    if (moved > 6) { strip.classList.add("was-dragged"); setTimeout(() => strip.classList.remove("was-dragged"), 50); }
  });

  /* ------------------------------------------------------------------
     Swipe helper (touch)
     ------------------------------------------------------------------ */
  function swipe(el, onLeft, onRight) {
    let x0 = null, y0 = null;
    el.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? onLeft : onRight)();
      x0 = null;
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------ */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  // stagger siblings that reveal together
  $$(".reveal").forEach((el) => {
    if (!el.style.getPropertyValue("--rd")) {
      const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
      const k = sibs.indexOf(el);
      if (k > 0) el.style.setProperty("--rd", `${Math.min(k, 6) * 0.07}s`);
    }
    io.observe(el);
  });
})();
