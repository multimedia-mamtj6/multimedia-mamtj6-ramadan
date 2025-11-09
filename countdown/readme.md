## Dokumentasi Projek: Kiraan Detik Ramadan 2026

### 1. Gambaran Keseluruhan Projek

Laman web ini adalah sebuah aplikasi kiraan detik interaktif yang direka untuk menyambut bulan Ramadan pada tahun 2026. Ia telah dipermudahkan untuk meningkatkan kebolehpercayaan dan menambah ciri perkongsian yang menarik.

*   **Tab Masihi:** Memberikan gambaran umum dengan memaparkan baki hari sehingga 19 Februari 2026.
*   **Tab Hijri:** Memberikan kiraan detik yang tepat sehingga ke saat, berdasarkan waktu Maghrib yang telah ditetapkan untuk Kuala Lumpur pada 18 Februari 2026.
*   **Eksport Imej:** Ciri utama aplikasi ini adalah kebolehan untuk mengeksport kiraan detik semasa (baki hari) ke dalam sebuah imej PNG yang cantik, sedia untuk dikongsi di media sosial.

Projek ini dibina menggunakan HTML, CSS, dan JavaScript tulen (vanilla) dan hanya bergantung pada satu API luaran untuk penyegerakan masa.

### 2. Ciri-ciri Utama

*   **Dwi-Paparan (Masihi & Hijri):** Pengguna boleh bertukar antara dua mod kiraan dengan mudah.
*   **Kiraan Kalendar (Masihi):** Memaparkan baki hari yang dibundarkan ke atas (`Math.ceil()`) untuk padanan dengan cara manusia mengira hari.
*   **Kiraan Tepat (Hijri):** Memaparkan kiraan detik yang tepat sehingga ke saat berdasarkan waktu Maghrib yang tetap.
*   **Eksport ke PNG:** Pengguna boleh menekan butang "Eksport PNG" pada mana-mana tab untuk menjana imej kiraan detik.
*   **Pratonton & Pengesahan:** Sebelum memuat turun, satu tetingkap popup akan muncul untuk pengguna melihat pratonton imej dan mengesahkan muat turun.
*   **Penjanaan Imej Dinamik:** Menggunakan `<canvas>` HTML5 untuk melukis angka kiraan detik di atas imej templat. Ia menyokong:
    *   Fon luaran (Poppins).
    *   Jarak antara digit yang boleh laras.
    *   Kesan bayang-bayang (drop shadow) pada teks.
*   **Penyegerakan Masa Malaysia:** Menggunakan API `worldtimeapi.org` untuk menyelaraskan jam aplikasi dengan waktu rasmi Malaysia (GMT+8), memastikan kiraan detik adalah seragam dan tepat.
*   **Reka Bentuk Responsif:** Antara muka pengguna direka untuk berfungsi dengan baik pada paparan desktop dan peranti mudah alih.

### 3. Struktur Fail

Projek ini diuruskan melalui beberapa fail utama:

*   `index.html`: Mengandungi semua struktur dan kandungan laman web.
*   `style.css`: Mengandungi semua peraturan penggayaan.
*   `script.js`: Mengandungi semua logik fungsian dan penjanaan imej.
*   **Folder `/media/`**:
    *   `pattern.svg`: Imej vektor untuk corak latar belakang.
    *   `template-masihi.png`: Templat latar belakang (1080x1080) untuk eksport PNG Masihi.
    *   `template-hijri.png`: Templat latar belakang (1080x1080) untuk eksport PNG Hijri.

### 4. Pemasangan dan Penggunaan

Oleh kerana projek ini memuatkan fail luaran (fon, imej templat) dan membuat panggilan API, ia **tidak boleh dijalankan dengan hanya membuka fail `index.html` terus** dalam pelayar. Ia perlu dihidangkan melalui pelayan web.

Cara paling mudah untuk menjalankannya adalah menggunakan sambungan **Live Server** di Visual Studio Code.

1.  **Letakkan Fail:** Pastikan struktur fail anda betul, termasuk folder `/media/`.
2.  **Pasang Live Server:** Jika anda belum memasangnya, cari "Live Server" oleh Ritwick Dey di panel Extensions VS Code dan pasang.
3.  **Jalankan Pelayan:** Buka fail `index.html` di VS Code, kemudian klik butang **"Go Live"** di bar status.
4.  Laman web akan terbuka secara automatik dalam pelayar anda.

### 5. Penerangan Kod

#### `index.html` (Struktur)

*   **`<head>`:** Memuatkan fon **Poppins** dari Google Fonts, tajuk, dan pautan ke `style.css`.
*   **`<body>`:**
    *   `.main-container`: Bekas utama untuk semua kandungan.
    *   `.tab-container`: Mengandungi butang untuk bertukar antara mod Masihi dan Hijri.
    *   `#masihi-panel` & `#hijri-panel`: Mengandungi paparan kiraan detik masing-masing, teks info, dan butang `.export-btn`.
    *   **Elemen Tersembunyi:** Terdapat elemen `<canvas>`, pautan `<a>`, dan struktur HTML untuk popup pratonton yang dikawal oleh JavaScript.

#### `style.css` (Gaya)

*   **`body`:** `font-family` utama ditetapkan kepada **'Poppins'**.
*   **`.export-btn`:** Mengandungi gaya untuk butang eksport, termasuk ikon SVG.
*   **Gaya Popup:** Peraturan CSS untuk `.popup-overlay`, `.popup-content`, dan elemen di dalamnya untuk menguruskan paparan pratonton.
*   **Reka Bentuk Responsif:** `@media` query kini hanya digunakan untuk pelarasan kecil, kerana reka bentuk utama sudah cukup fleksibel.

#### `script.js` (Logik)

Skrip ini telah banyak berubah untuk menyokong ciri-ciri baharu.

1.  **Pemboleh Ubah Global:** `masihiTargetDate` dan `hijriTargetDate` kini kedua-duanya adalah pemboleh ubah tetap (*hard-coded*).
2.  **Fungsi Teras:**
    *   `synchronizeWithMalaysiaTime()`: Berfungsi seperti biasa untuk mendapatkan masa tepat.
    *   `calculateAndDisplayMasihiDays()` & `updateHijriCountdown()`: Mengira dan memaparkan kiraan detik.
3.  **Logik Eksport Imej:**
    *   **`fillTextWithSpacing(context, text, x, y, spacing)`:** Fungsi khas yang dicipta untuk mengatasi had `<canvas>` yang tidak menyokong `letter-spacing`. Ia melukis setiap digit secara manual untuk mencapai kesan jarak yang diingini.
    *   **`generateImage(options)`:** Fungsi utama untuk eksport. Ia:
        1.  Memuatkan imej templat yang betul ke dalam `<canvas>`.
        2.  Menetapkan sifat-sifat lukisan seperti fon, warna, dan kesan bayang-bayang.
        3.  Memanggil `fillTextWithSpacing` untuk melukis teks angka.
        4.  Menukar kanvas kepada imej data URL dan memaparkannya dalam popup pratonton.
    *   **Logik Popup:** `event listener` pada butang "Batal" dan "Sahkan & Muat Turun" mengawal paparan popup dan mencetuskan muat turun fail.
4.  **Event Listeners:** Menguruskan logik untuk pertukaran tab dan klik pada kedua-dua butang eksport. Setiap butang memanggil `generateImage` dengan konfigurasi (templat, gaya teks) yang berbeza.

### 6. Ketergantungan Luaran (API)

Projek ini hanya bergantung pada satu API percuma:

1.  **World Time API:** `https://worldtimeapi.org`
    *   Digunakan sekali sahaja semasa pemuatan untuk mendapatkan masa semasa yang tepat di `Asia/Kuala_Lumpur` bagi tujuan penyegerakan.