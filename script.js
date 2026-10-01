// =========================================================
// Setup dasar
// =========================================================
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Tandai bahwa JS aktif — dipakai untuk animasi reveal saat scroll.
// Kalau JS gagal/dimatikan, konten tetap tampil normal tanpa animasi.
document.documentElement.classList.add("js-armed");

// =========================================================
// Role word rotator — transisi fade sederhana.
// Kata aktif fade-out, kata berikutnya fade-in, tanpa geser.
// =========================================================
const roleLines = Array.from(document.querySelectorAll(".role-line"));
let roleIdx = 0;

const ROLE_HOLD = 2600; // kata diam terlihat
const ROLE_FADE = 400;  // durasi fade (sinkron dgn CSS)

function activateRole(idx) {
  roleLines.forEach((el, i) => el.classList.toggle("is-active", i === idx));
}

if (roleLines.length > 1) {
  if (prefersReducedMotion) {
    activateRole(0); // versi statis, tanpa pergantian
  } else {
    setInterval(() => {
      const current = roleLines[roleIdx];
      roleIdx = (roleIdx + 1) % roleLines.length;
      const next = roleLines[roleIdx];

      current.classList.remove("is-active");
      // Fade-out singkat sebelum kata berikutnya muncul
      setTimeout(() => activateRole(roleLines.indexOf(next)), ROLE_FADE);
    }, ROLE_HOLD + ROLE_FADE);
  }
} else if (roleLines.length === 1) {
  roleLines[0].classList.add("is-active");
}

// =========================================================
// Mobile nav toggle
// =========================================================
const navToggle = document.getElementById("nav-toggle");
const mainNav = document.getElementById("main-nav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// =========================================================
// Contact form — opens a pre-filled Gmail compose window
// (web version, so it works for anyone with a Gmail account;
// no backend needed — visitor just hits Send in Gmail)
// =========================================================
const contactForm = document.getElementById("contact-form");
const formNote = document.getElementById("form-note");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get("name");
    const email = data.get("email");
    const subject = data.get("subject");
    const message = data.get("message");

    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;

    const params = new URLSearchParams({
      view: "cm",
      fs: "1",
      to: "wanstudent60@gmail.com",
      su: subject,
      body: body,
    });

    window.open(`https://mail.google.com/mail/?${params.toString()}`, "_blank", "noopener");
    formNote.textContent = "Gmail kebuka di tab baru dengan pesan kamu udah terisi — tinggal tekan Send.";
  });
}

// =========================================================
// Footer year
// =========================================================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// =========================================================
// Scroll reveal — fade in sections & project cards saat discroll
// =========================================================
if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealEls = document.querySelectorAll(".reveal, [data-reveal]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        // Kartu work: beri jeda bertingkat biar muncul bergiliran
        const group = el.closest(".work-grid");
        if (group) {
          const cards = Array.from(group.querySelectorAll("[data-reveal]"));
          el.style.transitionDelay = `${cards.indexOf(el) * 110}ms`;
        }
        el.classList.add("is-visible");
        observer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  // Fallback / reduced-motion: langsung tampilkan semua
  document.querySelectorAll(".reveal, [data-reveal]").forEach((el) => el.classList.add("is-visible"));
}

// =========================================================
// Globe network interaktif — kanvas 3D di belakang foto hero.
// Titik-titik di permukaan bola + garis plexus, berputar pelan.
// Interaksi: drag untuk memutar, hover untuk tilt & sorot garis.
// Paket data teal mengalir di antara titik yang terhubung.
// =========================================================
(function () {
  const canvas = document.getElementById("net-globe");
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const ACCENT = { r: 59, g: 130, b: 246 };   // --accent (biru)
  const TEAL = { r: 69, g: 179, b: 162 };     // --accent-2 (teal)
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  // Warna tema site
  const css = getComputedStyle(document.documentElement);
  const accRaw = css.getPropertyValue("--accent").trim();
  const tealRaw = css.getPropertyValue("--accent-2").trim();
  if (/^#[0-9a-f]{6}$/i.test(accRaw)) {
    ACCENT.r = parseInt(accRaw.slice(1, 3), 16); ACCENT.g = parseInt(accRaw.slice(3, 5), 16); ACCENT.b = parseInt(accRaw.slice(5, 7), 16);
  }
  if (/^#[0-9a-f]{6}$/i.test(tealRaw)) {
    TEAL.r = parseInt(tealRaw.slice(1, 3), 16); TEAL.g = parseInt(tealRaw.slice(3, 5), 16); TEAL.b = parseInt(tealRaw.slice(5, 7), 16);
  }

  const N = 46;            // jumlah titik di permukaan globe
  const LINK_DIST = 0.78;  // jarak maks relatif utk garis plexus
  const nodes = [];

  // Fibonacci sphere — distribusi titik merata di permukaan bola
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i;
    nodes.push({
      x: Math.cos(th) * rad,
      y: y,
      z: Math.sin(th) * rad,
    });
  }

  // Paket data yang mengalir di antara pasangan titik terdekat
  const packets = [];
  for (let i = 0; i < 6; i++) {
    packets.push({ a: (Math.random() * N) | 0, t: Math.random(), speed: 0.25 + Math.random() * 0.5 });
  }

  // Rotasi & interaksi
  let rotY = 0;          // rotasi otomatis (sumbu Y)
  let dragY = 0;         // offset rotasi dari drag
  let tiltX = 0.28;      // kemiringan dasar (sumbu X)
  let tiltTarget = 0.28;
  let dragging = false;
  let lastPX = 0, lastPY = 0;
  let mouseNX = 10, mouseNY = 10; // posisi mouse dalam koordinat normalisasi (-1..1)
  let hasPointer = false;

  // Pulse sorotan dari luar — dipicu hover card project (event netglobe:pulse).
  // Warna pulse beda per card: biru, teal, putih lembut; meluruh ~4 detik.
  let pulseStart = -1;
  const PULSE_MS = 4200;
  const PULSE_COLORS = [ACCENT, TEAL, { r: 231, g: 236, b: 245 }];
  let pulseColor = ACCENT;
  let glowTimer = 0;
  window.addEventListener("netglobe:pulse", (e) => {
    const idx = (e.detail && e.detail.index) || 0;
    pulseColor = PULSE_COLORS[idx % PULSE_COLORS.length];
    pulseStart = performance.now();
    // glow CSS ikut menguat selama pulse
    canvas.classList.add("glow-boost");
    clearTimeout(glowTimer);
    glowTimer = setTimeout(() => canvas.classList.remove("glow-boost"), PULSE_MS);
  });

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;
    canvas.width = Math.round(rect.width * DPR);
    canvas.height = Math.round(rect.height * DPR);
  }
  resize();
  window.addEventListener("resize", resize);

  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastPX = e.clientX; lastPY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseNX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseNY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    hasPointer = true;
    if (dragging) {
      dragY += (e.clientX - lastPX) * 0.006;
      tiltTarget = Math.max(-0.9, Math.min(0.9, tiltTarget + (e.clientY - lastPY) * 0.004));
      lastPX = e.clientX; lastPY = e.clientY;
    }
  });
  const endDrag = () => { dragging = false; };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("pointerleave", () => { hasPointer = false; endDrag(); });

  const rgba = (c, a) => `rgba(${c.r},${c.g},${c.b},${a})`;

  function frame() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (!w || !h) { requestAnimationFrame(frame); return; }

    // umur pulse sorotan (0 = baru dipicu .. menghilang)
    const pulse = pulseStart >= 0 ? Math.max(0, 1 - (performance.now() - pulseStart) / PULSE_MS) : 0;

    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.45; // radius globe — sedikit lebih besar dari foto biar menyelimuti

    if (!dragging) tiltTarget += ((mouseNY * 0.3 + 0.28) - tiltTarget) * 0.04;
    tiltX += (tiltTarget - tiltX) * 0.08;
    rotY += 0.0016;
    const ry = rotY + dragY;

    const cosY = Math.cos(ry), sinY = Math.sin(ry);
    const cosX = Math.cos(tiltX), sinX = Math.sin(tiltX);

    // halo ambient di belakang globe — radius DI-CLAMP ke dalam kanvas.
    // Kalau lingkaran glow lebih besar dari kanvas, tepi persegi kanvas
    // akan memotongnya dan kelihatan seperti "kotak" di sekeliling globe.
    const haloMax = Math.min(w, h) * 0.48; // sedikit di dalam tepi kanvas
    const haloR = Math.min(R * 1.35, haloMax);
    const halo = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, haloR);
    halo.addColorStop(0, rgba(ACCENT, 0.15 + pulse * 0.12));
    halo.addColorStop(1, rgba(ACCENT, 0));
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
    ctx.fill();

    // proyeksi 3D -> 2D
    const proj = nodes.map((n) => {
      const x1 = n.x * cosY + n.z * sinY;
      const z1 = -n.x * sinY + n.z * cosY;
      const y2 = n.y * cosX - z1 * sinX;
      const z2 = n.y * sinX + z1 * cosX;
      const scale = 1 / (1 - z2 * 0.18); // perspektif ringan
      return { x: cx + x1 * R * scale, y: cy + y2 * R * scale, z: z2 };
    });

    // garis plexus antar titik yang berdekatan
    const linkPx = LINK_DIST * R;
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const a = proj[i], b = proj[j];
        if (a.z + b.z < -0.9) continue; // dua2nya di sisi belakang: skip
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d > linkPx) continue;
        const depth = ((a.z + b.z) / 2 + 1) / 2; // 0 belakang .. 1 depan
        const base = (1 - d / linkPx) * (0.11 + depth * 0.46); // lebih terang dari sebelumnya

        // sorot: garis dekat kursor menyala lebih terang
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        let glow = 0;
        if (hasPointer && !dragging) {
          const md = Math.hypot(mx - cx - mouseNX * R * 0.55, my - cy - mouseNY * R * 0.55);
          glow = Math.max(0, 1 - md / (R * 0.5));
        }
        const boost = pulse * 0.35;
        ctx.strokeStyle = rgba(pulse > 0.05 ? pulseColor : ACCENT, Math.min(0.95, base + glow * 0.6 + boost));
        ctx.lineWidth = (glow > 0.25 ? 1.9 : 1.2 + pulse * 0.6) * DPR;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // titik globe
    for (let i = 0; i < N; i++) {
      const p = proj[i];
      const depth = (p.z + 1) / 2;
      const size = (1.3 + depth * 2.1 + pulse * 0.9) * DPR;
      // bloom asli: tiap titik punya shadow glow sendiri
      ctx.save();
      ctx.shadowColor = rgba(pulse > 0.05 ? pulseColor : ACCENT, 0.85);
      ctx.shadowBlur = (5 + depth * 8) * DPR;
      ctx.fillStyle = rgba(pulse > 0.05 ? pulseColor : ACCENT, Math.min(1, 0.4 + depth * 0.6 + pulse * 0.25));
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // gelombang pulse — lingkaran mengembang & memudar dari globe
    // (radius juga di-clamp biar tidak menyentuh tepi kanvas)
    if (pulse > 0.01) {
      const t = 1 - pulse;
      const rr = Math.min(R * (0.9 + t * 1.15), Math.min(w, h) * 0.48);
      ctx.strokeStyle = rgba(pulseColor, pulse * 0.4);
      ctx.lineWidth = 1.5 * DPR;
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx.stroke();
    }

    // paket data teal mengalir di antara node
    for (const pk of packets) {
      pk.t += pk.speed * 0.008;
      if (pk.t >= 1) {
        pk.t = 0;
        pk.a = (Math.random() * N) | 0;
      }
      // cari tetangga terdekat yang sedang terlihat
      let best = -1, bestD = Infinity;
      const a = proj[pk.a];
      for (let j = 0; j < N; j++) {
        if (j === pk.a) continue;
        const d = Math.hypot(a.x - proj[j].x, a.y - proj[j].y);
        if (d < bestD) { bestD = d; best = j; }
      }
      if (best < 0) continue;
      const b = proj[best];
      const px = a.x + (b.x - a.x) * pk.t;
      const py = a.y + (b.y - a.y) * pk.t;
      const fade = Math.sin(pk.t * Math.PI); // halus di ujung
      ctx.save();
      ctx.shadowColor = rgba(TEAL, 0.9);
      ctx.shadowBlur = 10 * DPR;
      ctx.fillStyle = rgba(TEAL, 0.95 * fade);
      ctx.beginPath();
      ctx.arc(px, py, 2.4 * DPR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      // ekor kecil
      const tx = a.x + (b.x - a.x) * Math.max(0, pk.t - 0.06);
      const ty = a.y + (b.y - a.y) * Math.max(0, pk.t - 0.06);
      ctx.strokeStyle = rgba(TEAL, 0.35 * fade);
      ctx.lineWidth = 1.2 * DPR;
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(px, py); ctx.stroke();
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

// =========================================================
// Sorotan globe dari card project — hover card kirim "pulse" ke globe.
// Warnanya beda per card (biru, teal, putih lembut) biar kelihatan
// card mana yang sedang disorot. Globe memang tidak terlihat dari
// section Work — pulse meluruh ~4 detik, jadi masih menyala saat
// pengunjung scroll balik ke hero.
// =========================================================
if (!prefersReducedMotion) {
  document.querySelectorAll(".work-card").forEach((card, i) => {
    card.addEventListener("mouseenter", () => {
      window.dispatchEvent(new CustomEvent("netglobe:pulse", { detail: { index: i } }));
    });
  });
}

// =========================================================
// Scroll-spy — garis nav mengikuti section yang sedang dilihat.
// Hero dianggap "Home".
// =========================================================
const navLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));

if (navLinks.length && "IntersectionObserver" in window) {
  const idToLink = new Map(
    navLinks.map((link) => [link.getAttribute("href").slice(1), link])
  );
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((l) => l.classList.remove("is-active"));
        const link = idToLink.get(entry.target.id);
        if (link) link.classList.add("is-active");
      });
    },
    // Section dianggap "aktif" saat menempati bagian tengah viewport
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );

  // Pantau hero (#home) dan semua section ber-id
  document.querySelectorAll("main [id]").forEach((sec) => {
    if (sec.tagName === "SECTION") spy.observe(sec);
  });

  // Klik nav: langsung set aktif tanpa menunggu scroll
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((l) => l.classList.remove("is-active"));
      link.classList.add("is-active");
    });
  });
}
