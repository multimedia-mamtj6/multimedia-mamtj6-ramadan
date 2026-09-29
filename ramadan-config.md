# ramadan-config.json — Rujukan Parameter

Satu fail konfigurasi dikongsi oleh `countdown/` dan `jadual-waktu/`.
Edit fail ini dahulu setiap tahun; kedua-dua app membaca semula automatik
(fallback 2027 terbina dalam kod jika fetch gagal, cth. `file://`).

Lokasi: `/ramadan-config.json` (root repo).

## Parameter teras

| Parameter | Jenis | Digunakan oleh | Maksud |
|---|---|---|---|
| `year` | integer | paparan/dokumen | Tahun Masihi Ramadan, cth. `2027`. |
| `hijriYear` | integer | paparan/dokumen | Tahun Hijri Ramadan, cth. `1448`. |
| `ramadanStart` | ISO datetime | `countdown/script.js` (sasaran Masihi), `jadual-waktu/index.html` (rujukan) | `1 Ramadan 00:00` waktu Malaysia. Cth. `2027-02-08T00:00:00`. |
| `ramadanEnd` | ISO datetime | rujukan/semakan | Hari terakhir Ramadan 00:00. Cth. `2027-03-09T00:00:00`. |
| `syawal` | ISO datetime | rujukan/semakan | 1 Syawal 00:00. Cth. `2027-03-10T00:00:00`. |
| `hijriTarget` | ISO datetime | `countdown/script.js` (sasaran Hijri) | Maghrib KL malam sebelum 1 Ramadan. Cth. `2027-02-07T19:29:00`. TODO-recheck tahunan (API 2027 pernah 404). |
| `hijriTargetZone` | string | rujukan/semakan | Zon rujukan waktu Maghrib, cth. `WLY01` (KL). |
| `hijriTargetNote` | string | manusia sahaja | Nota TODO-recheck, tidak dibaca oleh kod. |

## Parameter jadual (`jadual-waktu/index.html` → `fetchData`)

| Parameter | Jenis | Maksud |
|---|---|---|
| `fetchYear` | integer | Tahun untuk `api.waktusolat.app?year=`. |
| `fetchMonths` | [int, int] | Dua bulan Gregorian yang diliputi Ramadan, cth. `[2, 3]` (Feb+Mac). |
| `febStartDay` | integer | Hari mula dalam bulan pertama (tapis `day >=`). Cth. `8` → 8 Feb. |
| `marEndDay` | integer | Hari akhir dalam bulan kedua (tapis `day <=`). Cth. `9` → 9 Mac. |

## Parameter fasa (`countdown/script.js` → templat + `?test`/`?debug`)

| Parameter | Jenis | Maksud |
|---|---|---|
| `hijriMonths.rejab1` | `YYYY-MM-DD` | Tarikh Gregorian 1 Rejab. Menandakan mula fasa `rejab`. |
| `hijriMonths.syaaban1` | `YYYY-MM-DD` | Tarikh Gregorian 1 Syaaban. Menandakan mula fasa `syaaban`. |
| `hijriMonths.ramadan1` | `YYYY-MM-DD` | Tarikh Gregorian 1 Ramadan (= `ramadanStart` tarikhnya). Menandakan mula fasa `ramadan`. Sebelum `rejab1` = fasa `before-rejab`. |
| `hijriMonths.note` | string | Nota TODO-recheck manusia sahaja. |
| `templateFolders` | object | Peta fasa → subfolder dalam `countdown/media/template/`. String kosong (`""` untuk `ramadan`) = guna root. |
| `testDates` | object | Tarikh wakil setiap fasa untuk `?test=`. Cth. `rejab` → `2026-12-15`. |
| `labels.headerYear` | string | Paparan tahun di header (jika disambungkan ke UI pada masa depan). |
| `labels.masihiInfo` | string | Teks info panel Masihi (rujukan masa depan). |
| `labels.hijriInfoDate` | string | **Aktif** — dibaca oleh `script.js` untuk baris info Hijri (`pada 7 Februari 2027`). |

## Logik berkaitan (jangan ubah tanpa sebab)

- Keutamaan tarikh berkesan: `?testDate=YYYY-MM-DD` > `?test=<fasa>` > tarikh sebenar.
- Sempadan fasa: `t >= ramadan1` → ramadan; `>= syaaban1` → syaaban; `>= rejab1` → rejab; selainnya before-rejab.
- `?debug=1` memaparkan kesemua nilai di atas + pautan ujian — buka itu dahulu jika terlupa.
- Tarikh 2027 semasa provisional — sahkan semula selepas pengumuman rasmi + API live.
