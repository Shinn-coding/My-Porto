# Spec — Portfolio Redesign (per-section)

Konkret & implementable untuk @frontend. Token & arahan global: `DESIGN.md`. Halaman saat ini = 1 file `index.html` + `style.css` + `script.js`. Prinsip: **tanpa ubah HTML/JS logika**, murni CSS specificity + class tambahan dekoratif bila perlu (indeks angka, panah, highlight).

## 0. Aturan main

- CSS-only untuk 90% perubahan. Kalau butuh class, tambahkan `class="has-index"`, `has-arrow`, dst. — tidak menyentuh urutan/semantik HTML.
- `script.js` TIDAK diubah: intro (INTRO_MS 2500ms, leave 600ms), role-slider (ROLE_HOLD 2600, swap 450ms), scroll-spy, reveal observer (stagger 110ms). Reveal hanya menambah class `in-view`/`in-view-a/b`, styling dari CSS.
- `prefers-reduced-motion` existing dipertahankan **dan** diperluas ke semua animasi baru (pakai media query yang sama).

---

## 1. Intro overlay

- **Layout**: gap judul ↔ sub 12px → 16px; letter-spacing judul "-0.02em → -0.03em" biar lebih rapat & Fraunces tampil.
- **Tipografi**: "My Porto." Fraunces 600, clamp; dot "." gradient (sudah ada — pertahankan).
- **Motion**: biarkan script. Tambah subtle fade-in data (opacity 0→1, 0.5s) pada barikade teks jika belum, jangan ubah durasi inti.
- **States**: tidak ada interaktif.

## 2. Atmosphere / grain

- Tambah satu layer `grain` di atas atmosfer existing via `body::after`:
  - CSS: `position: fixed; inset: 0; pointer-events: none; opacity: var(--grain-opacity=0.035); z-index: 1;` — gunakan SVG-noise data-uri inline (128×128, trigit 4 levels, jangan blur besar).
  - Boleh pseudo-element `body::after` tanpa sentuh HTML.
- Pastikan z-index di bawah konten interaktif (grain pointer-events:none + z-index kecil).
- **Reduced motion**: grain statis (tanpa animasi) — aman.

## 3. Header & nav

- **Layout**: tetap sticky; tambah `backdrop-filter: blur(10px)` + bg semi-transparan `rgba(5,7,12,0.72)` di `.site-header` agar isi teks yang men-scroll ke belakang tidak nyerempet.
- **States**:
  - link nav: underline `scaleX(0→1)` origin-left, 0.2s `--ease-snap`, akhir underline 2px `--blue-300` (bukan 1px border seragam).
  - `.active` / `.is-active` (scroll-spy): underline permanen + warna `--text` (bukan muted).
- **Brand**: "Portofolio." tetap; hover → warna `--blue-300` transitif 0.2s.

## 4. Hero (Home)

- **Layout**: pertahankan 2 kolom; tambah **asimetri halus**: kolom kiri penuh, kolom foto sedikit `translateY(14px)` + `translateX(6px)` di breakpoint ≥1024 — tidak 50/50 kaku.
- **Status pill**: "● Available for work" → dot live menggunakan `--blue-300`, kasih glow `0 0 0 4px rgba(125,171,251,0.15)` biar "hidup", bukan lingkaran mati.
- **Role-slider**: jarak baris `slider-line` 8px → 10px; pastikan baris aktif tidak berubah tinggi (sudah fixed-height via script — jangan ganggu).
- **Foto**: shadow lebih dalam `0 24px 60px -30px rgba(0,0,0,0.85)` di frame; ring 2px `--border-soft` tetap.
- **Typo**: nama Fraunces 600; kata gradien `aria-hidden` dekoratif ada fallback warna solid.
- **Motion**: CTAs hover panah (bagian 7).
- **States**: link sosial underline scaleX; icon ikut geser 2px saat hover.

## 5. About

- **Layout**: alur editorial dipertahankan; ubah border-top section → garis aksen 48px gradient di bawah judul (`background: var(--gradient-accent); height: 3px; width: 64px; border-radius: 2px;`), hapus kotak pembatas seragam.
- **Highlight kata kunci**: kata penting (mis. "interface", "interaction", "motion") dibungkus `span.hl` → `background: linear-gradient(120deg, rgba(61,130,248,0.18), rgba(183,212,255,0.10));` + `border-radius: 4px; padding: 1px 5px;` — efek "spidol" editorial. (Tambahkan spans di HTML; tanpa ubah struktur paragraf.)
- **Quote**: border-left 3px gradient, italic Fraunces, `padding-left: 1.25rem`, margin kiri asimetris `margin-left: clamp(0px, 4vw, 32px)`.
- **Stats** (jika ada): angka serif italic 2.5rem gradient overlay; label uppercase Hanken 500 0.8rem ls .1em muted.

## 6. Stack

- **Layout**: rapikan pills jadi **flow horizontal + sedikit tilt zig-zag** (nth-child genap `rotate(1deg)`, ganjil `rotate(-0.8deg)`) — hanya di ≥768px; di bawah itu netral (nol rotasi).
- **Pills**: tetap radius-pill; background `--bg-elevated` border `--border-soft`; hover `translateY(-3px)` + border `--blue-700` + shadow card, 0.25s. Jangan ubah konten pills.
- **Motion**: reveal stagger existing cocok untuk kumpulan pills — pertahankan.
- **States**: `:focus-visible` outline `--blue-300` 2px offset 3px.

## 7. Button & CTA (global)

- Primary: `::after` panah "→" (SVG/karakter), `opacity:0; transform: translateX(-6px)` → hover `opacity:1; translateX(4px)`, label geser `translateX(-4px)` 0.2s `--ease-snap`.
- Secondary/ghost: underline scaleX + border light ke `--blue-300`.
- **Reduced motion**: hapus translate (tetap muncul panah tanpa slide).

---

## 8. WORK SECTION — loosening (prioritas, dari DESIGN.md §6)

### 8.1 Feature card (Kopi Senja)

- **Layout**: background `--bg-elevated` + `--shadow-card`; **hapus solid border seragam**; radius `--r-leaf`; body padding kiri 32px / kanan 20px (asimetri).
- **Media**: rasio 4/3; **bleed**: `margin-left: -16px; width: calc(100% + 16px);` di ≥768px → gambar keluar kartu (overhang), bukan terkurung kotak.
- **Indeks**: tambah `span.work-index` "01" di kartu feature → Fraunces italic 600 `clamp(2.6, 5vw, 3.4rem)`, `background: var(--gradient-accent); -webkit-background-clip: text; color: transparent;` `aria-hidden="true"`; duduk kanan-atas media, gambar tumpang tindih.
- **Eyebrow/status**: label uppercase kecil + garis 24px gradient horizontal sebelum judul.
- **Hover**: `translateY(-6px)` + `rotate(-0.4deg)`; media zoom `scale(1.06)` durasi **0.6s** (bukan 0.3s) — terasa hidup, tidak instan.

### 8.2 Pair cards (Anniversary + Simple Website)

- **Grid**: `1.15fr/0.85fr` (asimetri lebih tegas); `card--b` turun **48–56px** (bukan 34px) + `margin-bottom: 48px` biar offset nampak maksud, bukan ketidaksengajaan.
- **Diferensiasi jenis**:
  - `card--a` (Anniversary): media borderless, radius leaf, shadow card — kartu gambar.
  - `card--b` (Simple Website): **tanpa media**; jadi "kartu catatan" — `background: rgba(13,18,27,0.4); border: 1px dashed var(--border-soft); border-radius: var(--r-soft);` — DUA kartu ini terlihat beda jenis, bukan dua kotak mirip.
- **Tag list**: ganti pill seragam → `li` dengan bullet "·" warna `--blue-300` di kiri, teks muted; line-height nyaman 1.9. (Jika tag di dalam kartu adalah inline codes, cukup tambahkan bullet kiri via `::before`.)
- **Hover**: angkat + rotasi kecil utama (8.1); kartu catatan hover → border dashed jadi solid `--blue-700` + bg naik sedikit.

### 8.3 Layout work-flow

- `work-flow` margin asimetris: feature mepet kanan (`margin-right: 0; margin-left: auto` hingga bounded), pair mepet kiri → section "diatur tangan".
- Vertical gap antar baris: `48px` (bukan 28px seragam).
- Mobile (≤860px): semua offset/rotasi/bleed dinolkan; grid jadi 1 kolom; urutan DOM tetap.

---

## 9. Contact

- **Layout**: 2 kolom tetap namun ratio `1/1.1` (konten kiri sedikit lebih sempit); email besar Fraunces 600 dengan underline gradient hover (scaleX).
- **Form** (jika ada): input bg `--bg-elevated`, border `--border-soft`; `:focus` border `--blue-300` + `box-shadow: 0 0 0 3px rgba(125,171,251,0.15)`; label uppercase 0.8rem ls .1em muted.
- **Links sosial**: icon bulat border → hover bg `--blue-700/20%` + icon naik 2px; underline scaleX.

## 10. Footer

- Border-top: separasi halus `--border-soft`; teks muted; hover link gradient underline.
- Padding: `--space-section` atas, 32px bawah.

## 11. Responsive matrix

| Breakpoint | Perubahan |
|---|---|
| ≥1024 | Asimetri hero, work offset/bleed/rotate aktif, nav blur header |
| 861–1023 | Pair masih 2 kolom (1.15/0.85), offset dikurangi (32px), rotasi di stack dinetralkan |
| ≤860 | Semua asimetri di-nol-kan; 1 kolom; work cards tanpa bleed/rotate; spacing 40px antar baris |

## 12. A11y checklist (perubahan baru)

- Grain pointer-events:none; tidak menutup fokus.
- .work-index & gradient text → fallback solid color + aria-hidden.
- Outline :focus-visible pada setiap kontrol baru.
- prefers-reduced-motion: semua translate/rotate/zoom dihapus, fade saja.

## 13. QA gate

Setelah implementasi, verifikasi di browser desktop (1440), tablet (900), mobile (390): kontras, tidak ada overflow horizontal, reveal semua section jalan, work cards terlihat "loose" namun rapi, intro masih 2.5s, role slider stabil. Laporkan file + path di `specs/implementation-summary.md`.