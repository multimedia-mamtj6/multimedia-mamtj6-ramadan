# Jadual Waktu Ramadan 2026

**Versi:** 1.5.0

Aplikasi web untuk memaparkan jadual waktu Imsak, Subuh dan Berbuka sepanjang bulan Ramadan 1447H / 2026M untuk semua zon di Malaysia.

## Ciri-ciri

- Jadual lengkap Ramadan (19 Feb - 20 Mac 2026)
- Pilihan 61 zon seluruh Malaysia
- Pemilihan zon disimpan secara automatik
- **Pautan boleh dikongsi** - URL dikemaskini mengikut zon yang dipilih
- **Butang kongsi** untuk berkongsi pautan dengan maklumat zon (Negeri, Zon, Daerah)
- Countdown masa berbuka / imsak dengan peralihan automatik antara fasa
- Sorotan hijau pada kotak waktu seterusnya (Imsak, Subuh atau Berbuka)
- Amaran denyutan oren 5 minit sebelum waktu tiba
- Kemaskini data automatik pada tengah malam
- Paparan responsif (desktop & mobile)
- **Halaman maklumat** dengan dokumentasi projek
- Data dari JAKIM melalui Waktu Solat API

## Penggunaan

Buka `index.html` dalam pelayar web. Tiada pemasangan diperlukan.

### Pilih Zon

1. Klik dropdown "Pilih Zon"
2. Pilih zon anda dari senarai (dikumpul mengikut negeri)
3. Pilihan akan disimpan untuk lawatan seterusnya
4. URL akan dikemaskini secara automatik untuk memudahkan perkongsian

### Kongsi Pautan

1. Pilih zon anda
2. Klik butang "Share" di sebelah dropdown
3. Pautan akan disalin ke clipboard (desktop) atau buka menu kongsi (mobile)

### URL Parameter

| Parameter | Contoh | Keterangan |
|-----------|--------|------------|
| `location` | `?location=JHR01` | Muatkan zon tertentu secara automatik |
| `testDate` | `?testDate=2026-02-20` | Simulasi tarikh tertentu untuk ujian |
| `testTime` | `?testTime=18:30` | Simulasi masa tertentu untuk ujian (jam bergerak ke hadapan) |

Gabungkan parameter: `?location=JHR01&testDate=2026-02-20&testTime=12:00`

## Halaman

| Fail | Keterangan |
|------|------------|
| `index.html` | Halaman utama jadual waktu |
| `info.html` | Halaman maklumat dan dokumentasi |

## Sumber Data

Data waktu solat diperolehi dari [JAKIM](https://www.e-solat.gov.my/) melalui [Waktu Solat API](https://api.waktusolat.app/).

## Teknologi

- HTML5 / CSS3 / JavaScript (Vanilla)
- Google Fonts (Google Sans)
- Waktu Solat API
- MST SIRIM Widget (halaman info)

## Changelog

### v1.5.0 (2026-02-19)
- Tambah pengesanan lokasi GPS automatik pada kunjungan pertama (tanpa zon tersimpan)
- Tambah butang GPS (📍 GPS) di sebelah dropdown zon untuk kesan semula lokasi secara manual
- Animasi denyutan pada butang GPS semasa mengesan lokasi
- Paparan mobile: butang kongsi kini berada di baris kedua, di bawah pemilih zon
- Betulkan ralat SW fetch: janji tidak ditangkap untuk permintaan rangkaian gagal kini dipulangkan sebagai 503

### v1.4.1 (2026-02-19)
- Betulkan animasi denyutan amaran tidak berfungsi pada mobile (tambah `background-color: transparent` pada kelas `.warning`)
- Betulkan tempoh animasi kepada 1s (sebelumnya masih 1.5s)
- Tambah `"version": "1.4.0"` dalam site.webmanifest (Android memaparkan "version: 1" tanpanya)

### v1.4.0 (2026-02-19)
- Tambah parameter URL `testTime` untuk simulasi masa tertentu (jam bergerak ke hadapan)
- Tambah fungsi `getNow()` dan pembolehubah `timeOffset` untuk simulasi masa
- Sorotan hijau pada kotak waktu seterusnya yang terhampir (Imsak → Subuh → Berbuka)
- Amaran denyutan oren pada countdown dan kotak waktu 5 minit sebelum waktu tiba
- Betulkan bug peralihan fasa countdown: tukar `>` kepada `>=` dalam `setupCountdown()`
- Kemaskini data automatik pada tengah malam tanpa muat semula halaman
- Garisbawahi pautan peringatan masa dalam bahagian countdown
- Kemaskini info.html dengan penerangan ciri-ciri baharu

### v1.3.3 (2026-02-18)
- Tambah bahagian "Pasang Sebagai Aplikasi (PWA)" dalam halaman maklumat
- Tambah panduan pemasangan untuk Android, iOS dan komputer
- Tambah nota penggunaan luar talian dan notifikasi kemaskini
- Tambah ciri PWA dalam senarai Ciri-ciri utama

### v1.3.2 (2026-02-18)
- Kemaskini format teks kongsi: hapus awalan "Bagi", tambah baris kosong sebelum URL

### v1.3.1 (2026-02-18)
- Betulkan bug pautan kongsi tidak menyertakan `?location=` pada muatan pertama
- Kemaskini format teks kongsi kepada 3 baris: tajuk, maklumat zon, dan URL

### v1.3.0 (2026-02-18)
- Daftar service worker untuk sokongan PWA penuh (cache-first, offline support)
- Notifikasi kemaskini versi baharu (toast hijau) apabila SW dikemaskini
- Betulkan atribut `lang` HTML kepada `ms`
- Selaraskan `theme_color` antara HTML dan manifest kepada `#ffffff`
- Betulkan ralat tanda petikan berganda dalam OG meta tag
- Tambah entri ikon `any` dalam web manifest untuk 192×192 dan 512×512 PNG

### v1.2.2 (2026-02-03)
- Format teks kongsi dikemaskini: "Negeri {Negeri} (Zon {Nombor}): {Daerah}"

### v1.2.1 (2026-02-03)
- Butang kongsi kini menyertakan maklumat zon (negeri, kod, daerah) dalam teks kongsi

### v1.2.0 (2026-02-03)
- Halaman maklumat baru (`info.html`) dengan bahagian boleh dikongsi
- URL auto-kemas kini dengan parameter `?location=` untuk perkongsian mudah
- Butang kongsi di sebelah dropdown zon
- Mesej kontekstual sebelum/selepas Ramadan
- Dropdown berbentuk pill dengan warna yang sepadan
- Tajuk "Jadual Keseluruhan Bulan Ramadan" di atas jadual
- Pautan navigasi antara halaman utama dan halaman maklumat
- Widget MST SIRIM untuk pengesahan masa
- Bahagian Infaq & Wakaf

### v1.1.0 (2026-02-02)
- Tema hijau dan putih untuk countdown timer
- Aksen hijau untuk kotak waktu INFO HARI INI
- Highlight hijau dengan teks putih untuk kad hari ini (mobile)
- Format tarikh dikemaskini di INFO HARI INI

### v1.0.0 (2026-02-02)
- Keluaran pertama untuk Ramadan 1447H / 2026M
- Pemilih zon dengan 61 zon seluruh Malaysia
- Penyimpanan zon melalui localStorage
- Paparan dropdown ringkas (kod zon sahaja bila tertutup)
- Header dinamik dengan nama negeri dan nombor zon
- Sokongan parameter URL: `location` dan `testDate`
- Format tarikh gabungan: "1 Ramadan / 19 Feb (Khamis)"
- Pemasa countdown ke berbuka/imsak
- Reka bentuk responsif (jadual desktop & kad mobile)

## Lesen

Hak cipta 2026 [MAMTJ6](https://mamtj6.com)