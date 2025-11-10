## Dokumentasi Projek: Kiraan Detik Ramadan 2026

### 1. Gambaran Keseluruhan Projek

Laman web ini adalah sebuah aplikasi kiraan detik interaktif yang direka khas untuk menyambut bulan Ramadan pada tahun 2026. Aplikasi ini menampilkan reka bentuk yang moden, header yang berjenama, dan dua mod paparan yang berbeza:

*   **Kiraan Masihi:** Memberikan gambaran umum dengan memaparkan baki hari sehingga 19 Februari 2026.
*   **Kiraan Hijri:** Memberikan kiraan detik yang tepat sehingga ke saat, berdasarkan waktu Maghrib yang telah ditetapkan untuk Kuala Lumpur pada 18 Februari 2026.

Ciri utama aplikasi ini adalah kebolehan untuk mengeksport kiraan detik semasa ke dalam sebuah imej PNG yang cantik, lengkap dengan pratonton, sedia untuk dikongsi di media sosial.

Projek ini dibina menggunakan HTML, CSS, dan JavaScript tulen (vanilla).

### 2. Ciri-ciri Utama

*   **Reka Bentuk Profesional:** Menampilkan header berjenama dengan kaligrafi, footer, dan fon (Merriweather) yang konsisten di seluruh laman.
*   **Dwi-Paparan (Masihi & Hijri):** Pengguna boleh bertukar antara dua mod kiraan dengan mudah.
*   **Transisi Lancar:** Kandungan kiraan detik muncul dengan efek "fade in" yang lancar semasa pemuatan awal dan setiap kali tab ditukar.
*   **Layout Stabil:** Reka letak laman web tidak "melompat" apabila bertukar antara tab Masihi dan Hijri, hasil daripada struktur CSS yang lebih baik.
*   **Eksport ke PNG:** Satu butang terapung membolehkan pengguna menjana imej kiraan detik. Ciri ini termasuk:
    *   **Popup Pilihan:** Pengguna boleh memilih untuk menjana imej versi Masihi atau Hijri.
    *   **Pratonton & Pengesahan:** Sebelum memuat turun, satu popup pratonton akan muncul untuk pengesahan.
    *   **Penjanaan Imej Dinamik:** Menggunakan `<canvas>` HTML5 untuk melukis angka kiraan detik di atas imej templat dengan gaya yang boleh diubah suai.
*   **Penyegerakan Masa Malaysia:** Menggunakan API `worldtimeapi.org` untuk menyelaraskan jam aplikasi dengan waktu rasmi Malaysia (GMT+8), memastikan kiraan detik adalah seragam dan tepat untuk semua pengguna.
*   **Reka Bentuk Responsif:** Antara muka pengguna direka untuk berfungsi dengan baik pada paparan desktop dan peranti mudah alih.

### 3. Struktur Fail

Projek ini diuruskan melalui beberapa fail dan folder utama:

*   `index.html`: Mengandungi semua struktur laman web.
*   `style.css`: Mengandungi semua peraturan penggayaan.
*   `script.js`: Mengandungi semua logik fungsian.
*   **Folder `/media/`**:
    *   `/background/pattern.svg`: Imej vektor untuk corak latar belakang.
    *   `/icon/download.svg`: Ikon untuk butang eksport terapung.
    *   `/image/ramadan-kareem.svg`: Kaligrafi untuk header laman.
    *   `/template/template-masihi.png` & `template-hijri.png`: Templat latar belakang (1080x1080) untuk eksport PNG.

### 4. Pemasangan dan Penggunaan

Oleh kerana projek ini memuatkan fail luaran (fon, imej, ikon) dan membuat panggilan API, ia **perlu dihidangkan melalui pelayan web**.

Cara paling mudah adalah menggunakan sambungan **Live Server** di Visual Studio Code.

1.  **Letakkan Fail:** Pastikan semua fail dan folder berada dalam struktur yang betul.
2.  **Pasang Live Server:** Jika belum dipasang, cari "Live Server" oleh Ritwick Dey di panel Extensions VS Code dan pasang.
3.  **Jalankan Pelayan:** Buka `index.html` di VS Code, kemudian klik butang **"Go Live"** di bar status.

### 5. Penerangan Kod

#### `index.html` (Struktur)

*   **`<head>`:** Memuatkan fon **Merriweather** dari Google Fonts.
*   **`<header>`:** Elemen baharu yang mengandungi imej SVG kaligrafi dan teks tajuk.
*   **`.panels-container`:** Bekas `div` yang membalut kedua-dua panel kiraan detik untuk menyelesaikan isu layout "melompat".
*   **Butang & Popup:** Mengandungi butang terapung (`.floating-btn`) dan struktur HTML tersembunyi untuk dua jenis popup: satu untuk pilihan eksport dan satu lagi untuk pratonton imej.
*   **`<footer>`:** Elemen baharu di bahagian bawah laman untuk atribusi dan pautan.

#### `style.css` (Gaya)

*   **`body`:** `font-family` utama ditetapkan kepada **'Merriweather'**.
*   **`.site-header` & `.site-footer`:** Gaya khusus untuk header dan footer baharu.
*   **`.panels-container`:** Menggunakan `min-height` untuk memastikan ketinggian yang konsisten dan mengelakkan pergerakan layout.
*   **`.floating-btn`:** Menggunakan `position: fixed` untuk menjadikannya butang terapung di penjuru kanan bawah.
*   **Peraturan Fade In:** Gaya untuk `.countdown-container` dan elemen info ditetapkan dengan `opacity: 0` secara lalai dan `transition`, manakala kelas `.fade-in` akan mengubahnya kepada `opacity: 1`.
*   **Gaya Popup:** Peraturan CSS untuk `.popup-overlay` dan `.popup-content` untuk menguruskan paparan tetingkap popup.

#### `script.js` (Logik)

*   **Pemboleh Ubah Tetap:** `masihiTargetDate` dan `hijriTargetDate` kini kedua-duanya ditetapkan secara tetap di dalam kod.
*   **Logik Fade In:**
    *   `calculateAndDisplayMasihiDays()` mencetuskan efek fade-in pada pemuatan awal.
    *   Logik pertukaran tab kini membuang kelas `.fade-in` terlebih dahulu (fade out), menukar panel, dan kemudian menambah kelas `.fade-in` semula pada panel baharu.
*   **Logik Eksport Imej Berpusat:**
    *   Satu butang terapung kini mengawal semua fungsi eksport. Apabila diklik, ia akan memaparkan popup pilihan.
    *   Butang pilihan di dalam popup ("Imej Masihi" / "Imej Hijri") akan memanggil fungsi `generateImage` dengan konfigurasi yang betul.
*   **Fungsi `generateImage` & `drawCenteredTextWithSpacing`:**
    *   `generateImage` menguruskan pemuatan templat dan memaparkan hasil dalam popup pratonton.
    *   `drawCenteredTextWithSpacing` adalah fungsi utama untuk melukis teks pada `<canvas>`. Ia mengira secara manual kedudukan `X` dan `Y` yang betul untuk memastikan teks sentiasa berada di tengah secara sempurna pada semua peranti, dan juga menguruskan jarak antara digit dan kesan bayang-bayang.

### 6. Ketergantungan Luaran

Projek ini bergantung pada:

1.  **World Time API:** `https://worldtimeapi.org`
    *   Digunakan sekali semasa pemuatan untuk menyelaraskan masa.
2.  **Google Fonts:**
    *   Digunakan untuk memuat turun fon **Merriweather** bagi memastikan penampilan visual yang konsisten.