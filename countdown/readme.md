## Dokumentasi Projek: Kiraan Detik Ramadan 2026

### 1. Gambaran Keseluruhan Projek

Laman web ini adalah sebuah aplikasi kiraan detik interaktif yang direka khas untuk menyambut bulan Ramadan pada tahun 2026 (1447H). Aplikasi ini menampilkan reka bentuk yang moden dan dinamik, lengkap dengan latar belakang `radial-gradient` berlapis, header berjenama, dan dua mod paparan yang berbeza, dengan **Kiraan Hijri** sebagai paparan utama.

*   **Kiraan Hijri (Lalai):** Memberikan kiraan detik yang tepat sehingga ke saat, berdasarkan waktu Maghrib yang telah ditetapkan untuk Kuala Lumpur pada 18 Februari 2026, selari dengan permulaan hari dalam Islam.
*   **Kiraan Masihi:** Memberikan gambaran umum dengan memaparkan baki hari sehingga 19 Februari 2026.

Ciri utama aplikasi ini adalah kebolehan untuk mengeksport kiraan detik semasa ke dalam sebuah imej PNG yang cantik, sedia untuk dikongsi di media sosial. Projek ini juga telah dioptimumkan sepenuhnya untuk SEO dan perkongsian media sosial.

Projek ini dibina menggunakan HTML, CSS, dan JavaScript tulen (vanilla).

### 2. Ciri-ciri Utama

*   **Reka Bentuk Profesional:** Menampilkan latar belakang dinamik, header berjenama dengan kaligrafi, footer, dan fon (Merriweather) yang konsisten di seluruh laman.
*   **Paparan Hijri-Utama:** Mengutamakan kiraan detik Hijri yang lebih dinamik (jam, minit, saat) sebagai paparan lalai untuk pengalaman yang lebih mengasyikkan.
*   **Transisi Silang (Cross-fade) yang Lancar:** Kandungan bertukar antara tab dengan efek pudar masuk/pudar keluar (fade-in/fade-out) yang licin, dikendalikan sepenuhnya oleh CSS untuk prestasi optimum.
*   **Eksport ke PNG:** Satu butang terapung membolehkan pengguna menjana imej kiraan detik. Ciri ini termasuk:
    *   Popup pilihan untuk menjana imej versi Hijri atau Masihi.
    *   Pratonton imej sebelum memuat turun.
    *   Penjanaan imej yang konsisten merentas pelayar (termasuk iOS/Safari) hasil daripada kaedah rendering kanvas yang lebih baik.
*   **SEO & Perkongsian Sosial Dioptimumkan:** Dilengkapi dengan set penuh meta tag SEO, Open Graph (Facebook/WhatsApp), Twitter Card, dan set favicon yang komprehensif untuk memastikan keterlihatan maksimum dan pratonton pautan yang menarik.
*   **Penyegerakan Masa Tepat:** Menggunakan API `worldtimeapi.org` untuk menyelaraskan jam aplikasi dengan waktu rasmi Malaysia (GMT+8), memastikan kiraan detik adalah seragam untuk semua pengguna.
*   **Reka Bentuk Responsif:** Antara muka pengguna direka untuk berfungsi dengan baik pada paparan desktop dan peranti mudah alih, termasuk penyelesaian untuk isu teks footer terlindung.

### 3. Struktur Fail

Projek ini diuruskan melalui beberapa fail dan folder utama:

*   `index.html`: Mengandungi struktur laman utama.
*   `info.html`: Mengandungi halaman maklumat lanjut.
*   `style.css`: Mengandungi semua peraturan penggayaan.
*   `script.js`: Mengandungi semua logik fungsian.
*   **Folder `/media/`**:
    *   `/background/pattern.svg`: Imej vektor untuk corak latar belakang.
    *   `/icon/download.svg`: Ikon untuk butang eksport terapung.
    *   `/image/ramadan-kareem.svg`: Kaligrafi untuk header laman.
    *   `/favicon/`: Mengandungi set penuh ikon laman web (`.ico`, `.svg`, `.png`, `manifest`).
    *   `/preview/link-preview.jpg`: Imej pratonton (1200x630) untuk perkongsian di media sosial.
    *   `/template/template-masihi.png` & `template-hijri.png`: Templat latar belakang (1080x1080) untuk eksport PNG.

### 4. Pemasangan dan Penggunaan

Oleh kerana projek ini memuatkan fail luaran dan membuat panggilan API, ia **perlu dihidangkan melalui pelayan web**. Cara paling mudah adalah menggunakan sambungan **Live Server** di Visual Studio Code.

1.  **Letakkan Fail:** Pastikan semua fail dan folder berada dalam struktur yang betul.
2.  **Jalankan Pelayan:** Buka `index.html` di VS Code, kemudian klik butang **"Go Live"** di bar status.

### 5. Penerangan Kod

#### `index.html` (Struktur)

*   **`<head>`:** Telah dikemas kini secara komprehensif dengan tag `meta description`, `keywords`, `canonical`, Open Graph, Twitter Card, dan set favicon penuh untuk SEO dan UX yang optimum.
*   **Header:** Tajuk utama diubah kepada "1 RAMADAN" untuk lebih spesifik.
*   **Tab:** Susunan tab diubah untuk menjadikan "Kiraan Hijri" sebagai paparan lalai.
*   **Footer:** Teks pautan ke halaman info telah diperkemas.

#### `style.css` (Gaya)

*   **`body`:** Menggunakan teknik lapisan dengan `radial-gradient` sebagai latar belakang utama dan pseudo-element `body::before` untuk meletakkan corak `pattern.svg` di atasnya dengan `opacity` yang boleh dikawal.
*   **Transisi Panel:** Logik transisi telah diperbaharui untuk menggunakan `opacity` dan `visibility` (bukan `display`), membolehkan efek *cross-fade* yang sebenar dan lancar antara tab.
*   **Responsif:** Menambah `padding-bottom` pada `body` dalam `@media query` untuk peranti mudah alih, mengelakkan butang terapung daripada menutupi teks footer.

#### `script.js` (Logik)

*   **Logik Tab:** Logik pertukaran tab telah dipermudahkan dengan ketara. Ia kini hanya menukar kelas `.active-panel`, membiarkan CSS menguruskan semua animasi transisi sepenuhnya.
*   **Rendering Imej (`drawCenteredTextWithSpacing`):** Fungsi lukisan kanvas telah diperbaiki dengan menukar `ctx.textBaseline` kepada `'middle'`. Ini menyelesaikan isu ketidakkonsistenan rendering teks (terutamanya anjakan menegak) antara pelayar seperti Chrome (Blink) dan Safari (WebKit) pada peranti Apple.

### 6. Ketergantungan Luaran

Projek ini bergantung pada:

1.  **World Time API:** `https://worldtimeapi.org`
    *   Digunakan sekali semasa pemuatan untuk menyelaraskan masa.
2.  **Google Fonts:**
    *   Digunakan untuk memuat turun fon **Merriweather** bagi memastikan penampilan visual yang konsisten.