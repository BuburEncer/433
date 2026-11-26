# Desain UI: tema baru 4-2-3-1

Dokumen ini mengatur tampilan baru client (`client/`). Backend tidak berubah.

## Referensi

Dari referensi hanya diambil design token (warna, font, jarak, radius). Layout, gambar, dan logo mereka tidak disalin.

| Referensi | Yang diambil |
|---|---|
| UEFA Champions League (uefa.com/uefachampionsleague) | Identitas warna: navy gelap dengan aksen cyan, font Manrope |
| FotMob (fotmob.com) | Latar abu-abu terang, kartu putih dengan garis tipis, baris skor `tim · logo · skor · logo · tim` |
| The Athletic (nytimes.com/athletic/football) | Pola berita: satu berita utama besar, lalu daftar berita bergambar |

## Design token

Semua warna dan ukuran ditulis sekali sebagai CSS variable di `client/src/index.css`, lalu dipakai halaman lewat `var(--...)`. Halaman admin yang memakai Tailwind ikut memakai token yang sama lewat `@theme`.

### Warna

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `--color-navy` | `#0b1040` | Navbar, hero, header tabel |
| `--color-accent` | `#00d4ff` | Logo teks, tombol utama, garis aktif |
| `--color-bg` | `#f5f6fa` | Latar halaman |
| `--color-surface` | `#ffffff` | Kartu |
| `--color-border` | `#e3e6ee` | Garis kartu dan pemisah baris |
| `--color-input-border` | `#7c8599` | Garis input form (kontras 3.70:1 terhadap putih) |
| `--color-text` | `#111827` | Teks utama |
| `--color-muted` | `#5b6475` | Tanggal, caption, label kecil |
| `--color-on-navy` | `#ffffff` | Teks utama di atas navy |
| `--color-muted-on-navy` | `#b4bbe0` | Teks sekunder di atas navy |
| `--color-zebra` | `#fafbfd` | Baris selang-seling tabel klasemen |
| `--color-zone-r16` | `#1a7f37` | Nomor peringkat 1–8 (lolos ke 16 besar) |
| `--color-zone-playoff` | `#b35c00` | Nomor peringkat 9–24 (playoff fase gugur) |
| `--color-zone-out` | `#c81e3a` | Nomor peringkat 25–36 (tersingkir) |
| `--color-link` | `#2536c9` | Link dan tombol sekunder |
| `--color-danger` | `#c81e3a` | Tombol hapus, pesan error |

Garis fokus keyboard memakai `--color-link` (8.57:1 di atas putih); cyan hanya dipakai di atas navy karena kontrasnya terhadap putih cuma 1.77:1.

Kontras sudah dihitung dengan rumus WCAG. Pasangan dengan kontras terendah adalah teks `--color-muted` di atas `--color-bg` (5.52:1), dan itu masih di atas batas AA (4.5:1). Teks putih di atas navy 18.07:1, cyan di atas navy 10.20:1.

### Tipografi

- Font: Manrope dari Google Fonts, berat 400 sampai 800 (halaman admin memakai 500 dan 700). Fallback `system-ui, sans-serif`.
- Ukuran: 14px untuk label, 16px untuk teks, 20px untuk judul kartu, 28px untuk judul halaman, 40px untuk judul hero (24px di HP).
- Judul memakai berat 800, teks biasa 400.

### Bentuk dan jarak

- Radius: 8px untuk tombol dan input (`--radius-control`), 12px untuk kartu (`--radius-card`). Nama `--radius-sm` dan `--radius-md` tidak dipakai karena bentrok dengan variabel bawaan Tailwind.
- Kartu: latar putih, garis 1px `--color-border`, tanpa bayangan tebal. Bayangan tipis hanya muncul saat hover.
- Jarak memakai kelipatan 4px: 8, 12, 16, 24, 32.
- Lebar konten maksimal 1200px, dengan padding samping 16px di HP.

## Komponen

### Navbar

Latar navy. Teks logo "4-2-3-1" berwarna cyan, link berwarna putih. Link halaman aktif diberi garis bawah cyan, memakai `NavLink` dari react-router. Menu HP tetap memakai tombol hamburger yang sudah ada.

### Baris skor (halaman Matches)

Satu pertandingan satu baris di dalam kartu: nama tim kandang rata kanan, logo, skor atau "vs" di tengah, logo, lalu nama tim tandang rata kiri. Tanggal kecil di bawah skor. Baris dipisah garis tipis, bukan kartu terpisah.

Pertandingan Terjadwal dan Selesai dipisah dengan dua tombol pill (`aria-pressed`). Pertandingan berstatus `live` masuk ke Terjadwal dengan label Live dan skornya. Pilihan tombol cukup disimpan di state halaman.

### Berita (Home dan halaman Berita)

Berita terbaru tampil besar: gambar lebar dengan judul 28px di bawahnya. Berita lain tampil sebagai daftar: gambar kecil 16:9 di kiri, judul dan tanggal di kanan. Di HP, gambar pindah ke atas judul.

### Klasemen (halaman Stats)

Nomor peringkat diberi kotak warna sesuai zona fase liga UCL: hijau untuk 1–8, oranye untuk 9–24, merah untuk 25–36. Teks putih di atas ketiga warna itu kontrasnya minimal 4.72:1. Di bawah tabel ada keterangan warna, jadi warna bukan satu-satunya penanda. Batas zona dihitung dari posisi di tabel saja, belum memakai aturan tie-break UEFA.

Tabel di dalam kartu. Header tabel berlatar navy dengan teks putih, angka rata kanan, dan baris diberi warna selang-seling yang sangat tipis. Di HP, tabel bisa digeser ke samping di dalam kartunya sendiri, jadi halaman tidak ikut melebar.

### Halaman admin

Halaman admin tetap memakai Tailwind. Warna biru, abu-abu, dan merah bawaan Tailwind diganti dengan token di atas, supaya halaman publik dan admin terlihat satu tema.

## Yang tidak berubah

- Struktur halaman, route, dan alur data.
- Logo klub dan `4-2-3-1 Logo.png`.
- Mode gelap. Bisa ditambah nanti karena semua warna sudah berupa token.

## Pengujian

- `npm run lint` dan `npm run build` di client harus lulus.
- Setiap halaman publik dan admin dicek di browser dengan playwright-cli pada lebar 390px dan 1280px. Yang dicek: tidak ada scroll horizontal, tidak ada error di console, dan screenshot cocok dengan dokumen ini.
- Kontras warna baru dicek ulang kalau ada token yang diubah.
