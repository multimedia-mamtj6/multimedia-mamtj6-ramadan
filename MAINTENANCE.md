# Penyelenggaraan Tahunan (Yearly Maintenance)

Repo: `multimedia-mamtj6-ramadan` — `ramadan.mamtj6.com`
Stack: static HTML/CSS/vanilla JS, Vercel `trailingSlash: true`, tiada build step.

> TODO(2027-recheck): tarikh 2027 di bawah provisional — 1 Ramadan 1448H = 8 Feb 2027
> (sumber: e-solat + anggaran awam), Maghrib KL 7 Feb 2027 = 19:29 (bawaan dari 2026).
> Sahkan semula selepas pengumuman rasmi + `api.waktusolat.app?year=2027` live (404 ketika ditulis).

## 0. Cara cepat (utama): edit satu fail sahaja

- [ ] Edit `/ramadan-config.json` — `year`, `hijriYear`, `ramadanStart`, `ramadanEnd`,
  `hijriTarget`, `fetchYear`, `fetchMonths`, `febStartDay`, `marEndDay`, `labels`.
  Rujukan setiap parameter: `ramadan-config.md`.
- [ ] `countdown/script.js` dan `jadual-waktu/index.html` membaca fail ini automatik
  (fallback 2027 jika fetch gagal, cth. `file://`).
- [ ] Bahagian 1–2 di bawah hanya untuk teks statik (tajuk/meta) yang tidak boleh dibaca dari JSON.

## 0b. Dapatkan tarikh rasmi dahulu

Selepas pengumuman 1 Ramadan (JAKIM / Penyimpan Mohor Besar Raja-Raja):

- [ ] Tarikh 1 Ramadan (Masihi) + tahun Hijri baharu, cth. `1 Ramadan 1448H / 2027`
- [ ] Tarikh akhir Ramadan + 1 Syawal
- [ ] Waktu Maghrib KL pada malam sebelum 1 Ramadan (untuk Hijri countdown)
- [ ] Bulan Gregorian yang diliputi Ramadan (2026: Feb + Mar — tahun lain boleh berbeza)

## 1. `countdown/` — perlu update setiap tahun

Countdown Hijri/Masihi + export PNG ikut fasa (PWA off).

- [ ] `/ramadan-config.json` dahulu (cara cepat): `year`, `hijriYear`, `ramadanStart`,
  `hijriTarget`, `hijriMonths` (rejab1/syaaban1/ramadan1), `testDates`, `labels`.
  `countdown/script.js` membaca config automatik (fallback 2027 jika fetch gagal).
- [ ] `countdown/index.html`
  - `<title>`, meta description/keywords, OG, twitter
  - `.header-year` (`2027 / 1448H`), `#masihi-info-display`
- [ ] `countdown/info.html` — penerangan tarikh sasaran Masihi/Hijri
- [ ] `countdown/media/favicon/site.webmanifest` — `"name": "1 Ramadan YYYY"`
- [ ] Templat imej ikut fasa (8 PNG — header `YYYY/HHHH` + footer hari+tarikh ditaip dalam imej):

  | Fasa | Folder | template-masihi footer | template-hijri footer |
  |---|---|---|---|
  | before-rejab | `media/template/1-before-rejab/` | TODO: hari, 8 Feb 2027 | TODO: Waktu Maghrib, hari, 7 Feb 2027 |
  | in rejab | `media/template/2-in-rejab/` | TODO: sama | TODO: sama |
  | in syaaban | `media/template/3-in-syaaban/` | TODO: sama | TODO: sama |
  | in ramadan | `media/template/` (root) | TODO: sama | TODO: sama |

  Semua 8 PNG masih kandungan 2026/1447H — TODO: taip semula setiap satu kepada
  `2027 / 1448H` + footer di atas (sahkan hari: 8 Feb 2027 = Isnin, 7 Feb 2027 = Ahad).

  Saiz 1080×1080, nama fail kekal, ruang tengah dibiarkan kosong (nombor dilukis oleh
  `generateImage()` — Merriweather 700 300px, `yOffset: -5`).
- [ ] `media/preview/*` — ganti jika tahun tertera dalam imej
- [ ] PWA: **dilumpuhkan buat sementara** — `sw.js` + manifest dibiarkan tidak berdaftar;
  skrip nyahdaftar automatik dipasang di semua `index.html`/`info.html`.
  Jangan bump `CACHE_NAME` selagi PWA off.
- [ ] Uji fasa (keutamaan: `?testDate` > `?test` > tarikh sebenar):
  ```
  countdown/?test=before-rejab   countdown/?test=rejab
  countdown/?test=syaaban        countdown/?test=ramadan
  countdown/?debug=1             (panel rujukan semua parameter + pautan pantas)
  countdown/?testDate=2026-12-15 (mengatasi ?test)
  countdown/?testDate=2026-12-17 (nombor simulasi — detik berdetik dari 00:00 tarikh itu)
  countdown/?testDate=2027-02-07&testTime=18:00 (simulasi malam Maghrib — uji detik akhir Hijri)
  ```
  Lencana `MOD UJIAN` muncul bila override aktif. Serve: `python -m http.server 8000`.

## 2. `jadual-waktu/` — perlu update setiap tahun

Jadual Imsak/Subuh/Berbuka 61 zon JAKIM sepanjang Ramadan.

- [ ] `/ramadan-config.json` dahulu (cara cepat): `fetchYear`, `fetchMonths`,
  `febStartDay`, `marEndDay`. `jadual-waktu/index.html` (`fetchData`) membaca config
  automatik; `ramadanStart` diterbitkan dari config; `isToday/isTomorrow/isYesterday`
  kini tanpa tahun hardcoded (padanan hari+bulan sahaja).
- [ ] `jadual-waktu/index.html` `<title>` (`Jadual Waktu Ramadan YYYY-XXXXh`)
- [ ] `jadual-waktu/info.html:20,25,29`, `jadual-waktu/README.md:1,9`, `jadual-waktu/developer.md:271-275` (blok `Ramadan 2026 Dates`), `jadual-waktu/favicon/site.webmanifest:3-4`
- [ ] PWA: **dilumpuhkan buat sementara** (sama seperti di atas).
- [ ] Uji:
  ```
  jadual-waktu/index.html?location=JHR01
  jadual-waktu/index.html?testDate=YYYY-MM-DD&testTime=18:30
  jadual-waktu/index.html?testDate=YYYY-MM-DD&testTime=06:00  # pre-Fajr
  jadual-waktu/index.html?testDate=YYYY-MM-DD&testTime=19:30  # post-Maghrib
  ```

## 3. `telegram_reminder/` — perlu update setiap tahun

Bot Apps Script 9:05 pagi hantar imej countdown ke Telegram. Lihat `telegram_reminder/readme.md:95-97`, `telegram_reminder/howto.md`.

- [ ] Salin templat Slides (`howto.md:1.1`): Drive → Make a copy → tukar background/teks tahun baharu → pastikan `{{countdown_number}}` tidak dipadam → salin `PRESENTATION_ID` baharu
- [ ] `telegram_reminder/script.gs` → fungsi `setupAndCreateTrigger`:
  ```js
  { name: "1 RAMADAN XXXXH / YYYY", date: "YYYY-MM-DDT08:00:00+08:00" }
  ```
- [ ] `getCountdownCaption` — hashtag/kapsyen tahun (`#ramadancountdown`, `#TahunBaruYYYY`)
- [ ] `sendCountdownMessages` — `celebrationMessage` tahun baharu
- [ ] Di script.google.com: pilih `setupAndCreateTrigger` → Run → luluskan kebenaran → semak Executions → uji manual `sendCountdownMessages`

## 4. Tidak perlu update Ramadan tahunan

- `waktu-solat/` — year-round, de-branded (`waktu-solat/CLAUDE.md`). API live, tiada window Ramadan hardcoded. Hanya `© YYYY` jika mahu.
- `waktu/`, `info/`, `media/` — snapshot statik 2025, frozen. Jana semula penuh hanya jika diguna semula.
- `pwa-test/` — testbed PWA, bukan produksi.
- Root `index.html` — placeholder sahaja.

## 5. Publish

```bash
python -m http.server 8000  # smoke test setempat
git add -A
git commit -m "Rollover Ramadan YYYY / XXXXH"
git push  # pilih akaun multimedia-mamtj6 di picker GCM
```

Vercel auto-deploy ke `ramadan.mamtj6.com`. Lepas deploy: `Ctrl+Shift+R`, semak PWA toast update, semak 1 zon (cth. `PHG03`, `JHR01`, `WLY01`).
