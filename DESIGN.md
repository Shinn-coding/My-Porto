# DESIGN — Portfolio "Portofolio."

Design direction untuk meningkatkan kualitas visual semua slide dan melonggarkan kekakuan UI/UX, khususnya section **Work**. Dokumen ini = sumber kebenaran token & arahan. Detail per-section: `specs/portfolio-redesign.md`.

## 1. Arah Desain (Design Direction)

**Judul**: *Warm editorial, loose asymmetry — "cetak manual, bukan template".*

Design saat ini sudah hangat (Fraunces + Hanken Grotesk, deep navy, blue gradient). Masalah bukan identitas — masalah **kekakuan**: grid simetris, kartu seragam, border kotak di mana-mana, semuanya sejajar rapi. Arah baru:

1. **Asimetri sadar** — tidak semua elemen sejajar. Stagger, offset, margin kanan-kiri tak sama.
2. **Kartu bukan kotak** — radius bervariasi per kartu, ada yang tanpa kartu sama sekali (konten "ngambang" di atas background).
3. **Editorial typography** — serif italic sebagai aksen, angka serif besar sebagai indeks, eyebrow + garis sebagai label.
4. **Texture halus** — grain/grid simpang tipis, garis putus-putus, highlight "spidol" pada kata kunci.
5. **Motion bernyawa tapi sopan** — reveal naik + rotasi kecil, stagger bertingkat, hover mengangkat dengan kepribadian. Hormati `prefers-reduced-motion`.

JANGAN: ganti font, ganti palet, tambah framework, ubah struktur HTML section, ganti konten.

## 2. Design Tokens (Refine, bukan replace)

Pertahankan semua token existing. Tambah/sesuaikan:

```css
:root {
  /* — Existing, dipertahankan — */
  --bg: #05070c;
  --bg-elevated: #0d121b;
  --bg-elevated-2: #131a26;
  --border: #202b3d;
  --text: #e7ecf5;
  --text-muted: #8b96ab;
  --blue-500: #3b82f6;
  --blue-300: #7dabfb;
  --blue-100: #b9d4ff;
  --gradient-accent: linear-gradient(100deg, var(--blue-500) 0%, var(--blue-300) 55%, #ffffff 100%);
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Hanken Grotesk", "Segoe UI", sans-serif;
  --wrap: 1120px;
  --r-soft: 16px;
  --r-leaf: 16px 22px 16px 22px;
  --r-pill: 999px;
  --r-frame: 50%;

  /* — Baru — */
  --border-soft: rgba(32, 43, 61, 0.55);   /* border sekunder yang lebih ringan */
  --blue-700: #1e4d9e;                      /* untuk aksen deep, hover ring */
  --grain-opacity: 0.035;                   /* tekstur grain global */
  --ease-out-soft: cubic-bezier(.22,.61,.36,1);
  --ease-snap: cubic-bezier(.4,0,.2,1);
  --shadow-card: 0 18px 40px -24px rgba(0,0,0,0.7);
  --space-section: clamp(96px, 12vw, 140px);  /* ritme vertikal lebih lega */
}
```

## 3. Prinsip Spacing & Rhythm

- **Section**: vertical padding pakai `--space-section` (lebih lega dari 110px static). Section bawah boleh lebih besar dari atas (= ritme naik).
- **Judul section**: beri `::after` garis aksen 48px gradient di bawah judul, bukan border-top section yang seragam. Border-top dihapus/di-light-kan jadi `--border-soft`.
- **Indent asimetris**: body content boleh masuk 0, 24px, atau 48px dari kiri sesuai konteks — jangan semua rata kiri.
- **Grid**: hindari 2 kolom 50/50. Pakai ratio tak genap (1.1/0.9 sudah bagus; work-pair jadi 1.2/0.8).

## 4. Typography (per-section di specs)

| Level | Font | Ukuran | Catatan |
|---|---|---|---|
| Hero name | Fraunces 600 | clamp(2.5, 5vw, 3.9rem) | italic aksen, gradient |
| Section title | Fraunces 600 | clamp(2, 3.6vw, 2.7rem) | + garis aksen |
| Lead / lede | Fraunces 400 | clamp(1.3, 2.4vw, 1.65rem) | lh 1.5 |
| Quote | Fraunces italic 500 | clamp(1.15, 2vw, 1.4rem) | miring, border-left |
| Body | Hanken 300 | ~1.05rem | lh 1.7 |
| Eyebrow | Hanken 600, uppercase | 0.78–0.86rem | ls 0.08–0.12em |
| Kicker/intro | Hanken 500 uppercase | 0.85–1rem | ls 0.32em |
| Angka indeks (work) | Fraunces italic 500 | 3rem | transparan + gradient |

## 5. Component Architecture Map

| Komponen | File | Status |
|---|---|---|
| Intro overlay | `index.html#intro-overlay` + CSS + `script.js` | Pertahankan — hanya polish kecil (gap, letter-spacing tangan) |
| Atmosphere / grain | `style.css` | Tambah grain selapis di atas atmosfer |
| Header & nav | `index.html` header + CSS | Pertahankan; hover underline diperhalus (1px → 2px, ease-out) |
| Hero | `index.html#home` + CSS | Polish: status pill, role-slider spacing, foto ring shadow lebih deep |
| About | `index.html#about` + CSS | Pertahankan alur editorial; tambah highlight kata kunci "spidol" |
| Stack | `index.html#stack` + CSS | Pertahankan pills; tambah micro-interaction tilt kecil |
| **Work** | `index.html#work` + CSS | **LOOSENING UTAMA** — lihat bagian 6 |
| Contact | `index.html#contact` + CSS | Polish: form focus glow, links hover panah |
| Footer | `index.html` footer + CSS | Polish kecil |

## 6. Loosening Plan — Section Work (prioritas utama)

Ini jawaban dari "tidak sekaku apa lagi di bagian styling work".

### 6.1 Feature card (Kopi Senja) — buat editorial
- Hapus kesan "kotak": ganti `border: 1px solid` + radius seragam dengan **tanpa border**, background `--bg-elevated` + shadow `--shadow-card`, radius `--r-leaf`.
- Media: rasio **4/3**, bleed keluar kartu (media overhang 16px ke kiri/kanan), bukan terkunci di dalam kotak.
- Tambah **indeks angka besar** "01" (Fraunces italic, gradient text) di atas eyebrow — menggantikan kesan kartu produk.
- Body: padding kiri lebih besar dari kanan (asimetri).

### 6.2 Pasangan kartu (Anniversary + Simple Website) — pecah simetri
- `work-pair` tetap 1.15/0.85 tapi **offset vertikal lebih kuat** (card--b turun 48–56px, bukan 34px) dan rotasi kecil ±0.6deg pada hover.
- Card--a: media **borderless** + radius leaf; card--b: **tanpa media**, jadi "kartu catatan" — background transparan `rgba(13,18,27,0.4)`, border dashed `--border-soft`, radius soft — dua kartu ini HARUS terlihat beda jenis, bukan dua kotak mirip.
- Tag list: pakai bullet "·" atau line kiri, bukan pill seragam — hindari terlalu banyak pill.

### 6.3 Layout keseluruhan
- `work-flow` diberi **margin asimetris**: feature card mepet kanan, pasangan mepet kiri → section terasa "diatur tangan".
- Gap antar baris `--space-section` yang lebih kecil (48px), bukan 28px seragam.
- Hover: angkat `translateY(-6px)` + **rotate(-0.4deg)**, media zoom lambat `scale(1.06)` dengan durasi 0.6s (bukan 0.3s).

## 7. Interaction & Motion (Global)

- **Reveal**: naik `translateY(18→0)` + opacity, durasi 0.6–0.7s, `--ease-out-soft`; kartu work pakai `rotate(-1deg → 0)` + stagger 110ms (sudah ada di JS, pertahankan).
- **Hover link (semua)**: underline `scaleX(0→1)` origin-left, 0.2s ease — konsisten nav/social/footer.
- **Button primary**: panah "→" slide-in samping label saat hover (via ::after, tanpa ubah HTML).
- **Tombol/field**: `:focus-visible` outline `--blue-300` 2px offset 3px (sudah ada — pertahankan).
- **Reduced motion**: semua animasi mati (sudah ada di CSS+JS — pertahankan & jangan kurangi coverage).

## 8. Accessibility (WCAG — non-negotiable)

- Kontras: teks `--text` di `--bg` jauh di atas 4.5:1; `--text-muted` jangan di-dark-kan lagi.
- Judul gradient text: selalu punya fallback warna solid (pakai `@supports` atau fallback `color`).
- Indeks angka "01" → `aria-hidden="true"` (dekoratif).
- Semua elemen interaktif tetap `:focus-visible` terlihat; urutan keyboard DOM tidak diubah (tidak ada reorder).
- Media kartu: `alt` tetap deskriptif.

## 9. Batasan Implementasi (untuk frontend)

- **Tidak ubah HTML struktur/urutan section** — boleh tambah class/span dekoratif (indeks, panah), jangan tambah/menghapus elemen semantik.
- **Tidak ubah `script.js` logika** — izin hanya bertambah CSS class/style properties; perilaku intro (2500ms), role-slider (2600/450ms), reveal, scroll-spy tetap.
- **Tidak ganti font/palet** — hanya perbaikan yang dijelaskan di tokинизация di atas.
- Hasil harus tetap `verified` di desktop + mobile (860px, 520px breakpoint yang ada).