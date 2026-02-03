# Jadual Waktu Ramadan 2026

**Versi:** 1.1.0

Aplikasi web untuk memaparkan jadual waktu Imsak, Subuh dan Berbuka sepanjang bulan Ramadan 1447H / 2026M untuk semua zon di Malaysia.

## Ciri-ciri

- Jadual lengkap Ramadan (19 Feb - 20 Mac 2026)
- Pilihan 61 zon seluruh Malaysia
- Pemilihan zon disimpan secara automatik
- Countdown masa berbuka / imsak
- Paparan responsif (desktop & mobile)
- Data dari JAKIM melalui Waktu Solat API

## Penggunaan

Buka `index.html` dalam pelayar web. Tiada pemasangan diperlukan.

### Pilih Zon

1. Klik dropdown "Pilih Zon"
2. Pilih zon anda dari senarai (dikumpul mengikut negeri)
3. Pilihan akan disimpan untuk lawatan seterusnya

### URL Parameter

| Parameter | Contoh | Keterangan |
|-----------|--------|------------|
| `location` | `?location=JHR01` | Muatkan zon tertentu secara automatik |
| `testDate` | `?testDate=2026-02-20` | Simulasi tarikh tertentu untuk ujian |

Gabungkan kedua-dua parameter: `?location=JHR01&testDate=2026-02-20`

## Sumber Data

Data waktu solat diperolehi dari [JAKIM](https://www.e-solat.gov.my/) melalui [Waktu Solat API](https://api.waktusolat.app/).

## Teknologi

- HTML5 / CSS3 / JavaScript (Vanilla)
- Google Fonts (Google Sans)
- Waktu Solat API

## Changelog

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
