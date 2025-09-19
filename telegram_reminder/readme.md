# Dokumentasi Projek: Bot Kiraan Detik Telegram dengan Imej Dinamik

Dokumen ini menerangkan secara terperinci mengenai projek automasi yang menghantar imej kiraan detik harian ke saluran Telegram menggunakan Google Apps Script dan Google Slides.

## 1. Pengenalan

Projek ini adalah sistem automasi yang direka untuk meningkatkan penglibatan dalam saluran Telegram dengan menyediakan kandungan visual yang relevan setiap hari. Ia mengira baki hari ke satu tarikh acara yang ditetapkan (contohnya, 1 Ramadan), menjana imej yang menarik dengan nombor kiraan detik, dan menyiarkannya secara automatik ke saluran.

Ia juga menyertakan ciri perkongsian ke WhatsApp yang membolehkan pengguna menyebarkan siaran tersebut dengan mudah.

## 2. Komponen Utama

Projek ini dibina menggunakan beberapa perkhidmatan Google dan Telegram yang saling berhubung:

*   **Google Apps Script:** Bertindak sebagai "otak" projek. Ia menjadi hos kepada semua kod logik, menguruskan automasi, dan berkomunikasi dengan perkhidmatan lain.
*   **Google Slides:** Digunakan sebagai "enjin templat imej". Satu fail Google Slides direka bentuk untuk menjadi templat, dan skrip akan mengubah suai teks di dalamnya secara dinamik.
*   **Google Slides API (Advanced Service):** Perkhidmatan yang membolehkan skrip mengeksport slaid yang telah dikemas kini sebagai fail imej PNG melalui URL.
*   **Pencetus Google Apps Script (Triggers):** Mekanisme penjadualan yang menjalankan skrip secara automatik setiap hari.
*   **Bot Telegram:** Entiti yang digunakan untuk menghantar mesej ke saluran bagi pihak skrip.
*   **API Telegram:** Antara muka yang membolehkan skrip berkomunikasi dengan pelayan Telegram untuk menghantar dan mengedit mesej.

## 3. Aliran Kerja Automasi

Aliran kerja harian projek ini adalah seperti berikut:

1.  **Pencetus Aktif:** Setiap hari pada jam 9:05 pagi (waktu yang ditetapkan), pencetus masa akan mengaktifkan fungsi utama `sendCountdownMessages`.
2.  **Pengiraan Hari:** Skrip mengambil tarikh acara sasaran dan mengira baki hari dari tarikh semasa.
3.  **Penjanaan Imej (`generateCountdownImage`):**
    *   Skrip membuka fail Google Slides templat menggunakan ID Persembahan (`PRESENTATION_ID`).
    *   Ia mencari teks pemegang (`{{countdown_number}}`) pada slaid pertama dan menggantikannya dengan nombor baki hari.
    *   Ia kemudian memanggil Google Slides API untuk mendapatkan URL imej PNG bagi slaid yang baru dikemas kini.
    *   Akhir sekali, ia menukar semula nombor pada slaid kepada teks pemegang asal (`{{countdown_number}}`) untuk menyediakannya bagi larian hari berikutnya.
4.  **Penghantaran Mesej (`sendTelegramPhotoWithButton` - Langkah 1):**
    *   Skrip membuat panggilan pertama ke API Telegram untuk menghantar imej (menggunakan URL yang dijana) bersama kapsyen yang telah diformat. Mesej ini dihantar **tanpa** sebarang butang.
5.  **Penambahan Butang (`sendTelegramPhotoWithButton` - Langkah 2):**
    *   Telegram membalas panggilan pertama dengan maklumat siaran, termasuk `message_id` yang unik.
    *   Skrip mengambil `message_id` ini.
    *   Ia mencipta satu versi mesej yang "bersih" khusus untuk WhatsApp, membuang semua pemformatan dan menambah pautan terus ke siaran (`https://t.me/username/message_id`).
    *   Skrip membuat panggilan kedua ke API Telegram untuk **mengedit mesej asal**, menambah butang "Share on WhatsApp" yang mengandungi pautan mesej bersih tadi.

## 4. Panduan Penyediaan Lengkap

Untuk menyediakan projek ini dari awal, ikuti langkah-langkah di bawah:

### Langkah 1: Cipta Bot Telegram
1.  Buka Telegram dan cari `@BotFather`.
2.  Hantar arahan `/newbot`.
3.  Ikut arahan untuk menamakan bot anda.
4.  BotFather akan memberikan anda satu **Token API**. Salin dan simpan token ini. Ini ialah `BOT_TOKEN` anda.

### Langkah 2: Sediakan Saluran Telegram
1.  Cipta saluran Telegram baharu (Public Channel).
2.  Tetapkan nama pengguna (username) yang unik untuk saluran anda (cth., `@islamic_countdown`). Ini ialah `CHAT_ID` anda.
3.  Tambah bot yang anda cipta tadi ke dalam saluran sebagai **Administrator** dengan kebenaran untuk menghantar mesej.

### Langkah 3: Reka Bentuk Templat Google Slides
1.  Cipta satu fail Google Slides baharu.
2.  **Tetapkan Saiz:** Pergi ke `Fail > Persediaan Halaman > Tersuai`. Tetapkan saiz kepada **11.25 x 11.25 inci** (ini akan menghasilkan imej 1080x1080 piksel).
3.  **Reka Bentuk:** Tambah imej latar belakang, logo, dan teks statik anda.
4.  **Tambah Pemegang Teks:** Masukkan satu Kotak Teks di mana nombor akan muncul. Taip teks pemegang unik di dalamnya, iaitu `{{countdown_number}}`. Gayakan teks ini (fon, saiz, warna, bayang-bayang) mengikut kehendak anda.
5.  **Dapatkan ID:** Salin ID unik dari URL fail Slides anda (`https://docs.google.com/presentation/d/ID_ANDA_DI_SINI/edit`). Ini ialah `PRESENTATION_ID` anda.

### Langkah 4: Sediakan Projek Google Apps Script
1.  Pergi ke [script.google.com](https://script.google.com) dan cipta projek baharu.
2.  Padamkan kod sedia ada dan tampal keseluruhan kod projek ini.
3.  **Isi Maklumat Anda:** Kemas kini pembolehubah di bahagian atas skrip (`BOT_TOKEN`, `CHAT_ID`, `PRESENTATION_ID`).
4.  **Aktifkan Perkhidmatan Lanjutan:**
    *   Di sebelah kiri, klik `+` pada "Perkhidmatan".
    *   Cari `Google Slides API`, pilih, dan klik `Tambah`.
    *   Pastikan pengecamnya ialah `Slides`.
5.  **Konfigurasi Fail Manifest (`appsscript.json`):**
    *   Klik ikon Tetapan Projek ⚙️ dan tandakan "Tunjukkan fail manifest 'appsscript.json' dalam editor".
    *   Kembali ke editor dan buka fail `appsscript.json`.
    *   Gantikan kandungannya dengan kod di bawah:
    ```json
    {
      "timeZone": "Asia/Kuala_Lumpur",
      "exceptionLogging": "STACKDRIVER",
      "runtimeVersion": "V8",
      "oauthScopes": [
        "https://www.googleapis.com/auth/presentations",
        "https://www.googleapis.com/auth/script.external_request",
        "https://www.googleapis.com/auth/script.scriptapp"
      ]
    }
    ```
6.  Simpan projek anda.

### Langkah 5: Jalankan & Beri Kebenaran
1.  Pilih fungsi `setupAndCreateTrigger` dari menu lungsur turun.
2.  Klik **▶️ Jalankan**.
3.  Ikut arahan untuk memberi kebenaran kepada skrip. Anda perlu melalui skrin amaran "tidak selamat" kerana ini adalah skrip peribadi anda. Benarkan semua akses yang diminta.
4.  Selepas selesai, pencetus harian anda telah dicipta. Anda boleh menguji larian penuh dengan menjalankan fungsi `sendCountdownMessages` secara manual.

## 5. Penyelenggaraan

*   **Untuk Menukar Acara:** Buka skrip, ubah `name` dan `date` dalam fungsi `setupAndCreateTrigger`, kemudian jalankan fungsi `setupAndCreateTrigger` sekali lagi.
*   **Untuk Menukar Reka Bentuk:** Hanya buka fail Google Slides anda dan edit reka bentuknya. Tidak perlu mengubah kod selagi anda tidak memadamkan teks pemegang `{{countdown_number}}`.
*   **Melihat Log:** Untuk menyemak jika skrip berjalan dengan jayanya setiap hari, anda boleh pergi ke halaman "Pelaksanaan" (Executions) dalam editor Apps Script.


➡️ **[Panduan Cara Guna Untuk Projek Lain (howto.md)](./howto.md)**
