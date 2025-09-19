# Panduan Implementasi Projek Bot Kiraan Detik untuk Acara Baharu

Dokumen ini menyediakan arahan langkah demi langkah untuk menyalin projek bot kiraan detik sedia ada dan mengkonfigurasikannya untuk acara, reka bentuk, dan mesej yang baharu.

## Pengenalan

Pendekatan yang disyorkan adalah dengan mencipta satu projek Google Apps Script yang **berasingan** untuk setiap kiraan detik. Ini memastikan kestabilan, pengasingan, dan kesederhanaan kod untuk setiap automasi.

## Bahagian 1: Penyediaan Aset Baharu

Sebelum menyentuh kod, sediakan semua aset digital yang diperlukan untuk kiraan detik baharu anda.

### 1.1. Templat Google Slides Baharu (Wajib)

Setiap kiraan detik memerlukan templat imejnya sendiri.

1.  Pergi ke Google Drive anda.
2.  Cari fail templat Google Slides yang asal (cth., `Templat Countdown Telegram`).
3.  Klik kanan pada fail tersebut dan pilih **"Buat salinan" (Make a copy)**.
4.  Namakan semula fail salinan itu dengan nama yang relevan (cth., `Templat Countdown Tahun Baru`).
5.  **Buka templat baharu ini:**
    *   Tukar reka bentuk seperti imej latar belakang atau teks statik mengikut tema acara baharu anda.
    *   **PENTING:** Pastikan kotak teks yang mengandungi pemegang teks `{{countdown_number}}` tidak dipadam. Anda boleh mengubah gayanya (fon, saiz, warna, bayang-bayang).
6.  Salin **ID Persembahan (Presentation ID)** daripada URL templat baharu ini.
    *   Contoh URL: `https://docs.google.com/presentation/d/INI_ADALAH_ID_BAHARU_ANDA/edit`

### 1.2. Saluran Telegram Baharu (Pilihan)

Jika anda mahu menyiarkan kiraan detik ini ke lokasi yang berbeza:

1.  Cipta satu Saluran Telegram awam (Public Channel) yang baharu.
2.  Berikan nama pengguna (username) yang unik (cth., `@TahunBaruCountdown`). Ini akan menjadi `CHAT_ID` baharu anda.
3.  Tambah bot anda yang sedia ada (cth., `@autosent_robot`) ke dalam saluran baharu ini sebagai **Administrator** dengan kebenaran untuk menghantar mesej.

Jika anda mahu menggunakan saluran yang sama, anda boleh langkau langkah ini.

## Bahagian 2: Penyediaan Projek Google Apps Script Baharu

Sekarang, kita akan mencipta "otak" baharu untuk automasi ini.

1.  Pergi ke [script.google.com](https://script.google.com) dan klik **"Projek baharu" (New project)**.
2.  Berikan nama yang jelas pada projek ini (cth., `Bot Countdown Tahun Baru`).
3.  Buka projek Apps Script yang asal, pilih semua kod (`Ctrl+A` atau `Cmd+A`), dan salin (`Ctrl+C` atau `Cmd+C`).
4.  Tampal (`Ctrl+V` atau `Cmd+V`) kod tersebut ke dalam fail `Code.gs` projek baharu anda.

## Bahagian 3: Pengubahsuaian Kod

Ini adalah bahagian paling penting di mana kita akan menyesuaikan skrip untuk acara baharu.

### 3.1. Kemas Kini Pembolehubah Utama

Di bahagian paling atas skrip, kemas kini pembolehubah berikut dengan maklumat daripada **Bahagian 1**:

```javascript
// ✅ ISIKAN MAKLUMAT BAHARU ANDA DI SINI
const BOT_TOKEN = "TOKEN_BOT_ANDA"; // Boleh kekal sama jika guna bot yang sama
const CHAT_ID = "@NamaSaluranBaharu"; // ID Saluran baharu anda
const PRESENTATION_ID = "ID_GOOGLE_SLIDES_BAHARU_ANDA"; // ID dari templat baharu
```

### 3.2. Tukar Butiran Acara

Cari fungsi `setupAndCreateTrigger` dan ubah butiran acara di dalamnya.

*   **Tujuan:** Menetapkan nama, tarikh, dan masa sasaran untuk kiraan detik.
*   **Contoh:**
    *   **Sebelum:**
        ```javascript
        const events = [
          { name: "1 RAMADAN 1447H / 2026", date: "2026-02-19T08:00:00+08:00" },
        ];
        ```
    *   **Selepas (untuk Tahun Baru):**
        ```javascript
        const events = [
          { name: "SAMBUTAN TAHUN BARU 2026", date: "2026-01-01T00:00:00+08:00" },
        ];
        ```

### 3.3. Tukar Kapsyen Imej Harian

Cari fungsi `getCountdownCaption` dan ubah suai mesej yang dihantar bersama imej.

*   **Tujuan:** Mengawal teks utama yang dilihat oleh pengguna setiap hari di Telegram.
*   **Contoh:**
    *   **Sebelum:**
        ```javascript
        return `*${daysRemaining} hari lagi!* countdown to *${eventName}* ⌛️\n\n📆 ${formattedDate}\n\nInfo lanjut dan peringatan harian:\n\n#ramadancountdown`;
        ```
    *   **Selepas (untuk Tahun Baru):**
        ```javascript
        return `*Tinggal ${daysRemaining} hari lagi* menuju kemeriahan *${eventName}*! 🎉\n\n🗓️ Tarikh: ${formattedDate}\n\nJom raikan bersama!\n\n#TahunBaru2026 #CountdownMY`;
        ```

### 3.4. Tukar Mesej Sambutan

Cari fungsi `sendCountdownMessages` dan ubah suai mesej yang dihantar apabila kiraan detik tamat.

*   **Tujuan:** Menghantar mesej khas pada hari acara.
*   **Contoh:**
    *   **Sebelum:**
        ```javascript
        const celebrationMessage = `🎉 *Alhamdulillah, ${event.name} telah tiba!* 🎉`;
        ```
    *   **Selepas (untuk Tahun Baru):**
        ```javascript
        const celebrationMessage = `🎆 *SELAMAT TAHUN BARU 2026!* 🎆 Semoga tahun ini membawa kebahagiaan untuk anda semua! ✨`;
        ```

### 3.5. Tukar Mesej Perkongsian WhatsApp (Pilihan)

Jika anda mahu mesej yang dikongsi ke WhatsApp berbeza daripada kapsyen utama, anda boleh mengubahnya dalam fungsi `sendTelegramPhotoWithButton`. Jika tidak, kod sedia ada akan membersihkan kapsyen dari `getCountdownCaption` secara automatik.

*   **Tujuan:** Mengawal teks yang muncul apabila pengguna menekan butang "Share on WhatsApp".
*   **Contoh:**
    *   Cari blok kod ini dalam `sendTelegramPhotoWithButton`:
        ```javascript
        let whatsappMessage = caption
          .replace(/[*_]/g, "")
          // ... dan seterusnya ...
        ```
    *   Jika anda mahu mesej yang berbeza sepenuhnya, gantikan blok itu dengan:
        ```javascript
        // Cipta mesej WhatsApp yang lebih ringkas dan spesifik
        let whatsappMessage = `Jom sertai kiraan detik untuk ${eventName}! Tinggal ${daysRemaining} hari lagi. Dapatkan peringatan harian di sini:`;
        ```

## Bahagian 4: Konfigurasi dan Pengaktifan

Setiap projek baharu memerlukan konfigurasi dan kebenarannya sendiri.

1.  **Aktifkan Perkhidmatan Lanjutan:**
    *   Dalam projek baharu anda, klik `+` pada "Perkhidmatan".
    *   Cari dan tambah `Google Slides API`. Pastikan pengecamnya ialah `Slides`.
2.  **Konfigurasi Fail Manifest (`appsscript.json`):**
    *   Pastikan fail `appsscript.json` wujud dan kandungannya adalah betul (anda boleh salin dari projek lama).
3.  **Jalankan dan Beri Kebenaran (Langkah Terakhir):**
    *   Dari menu lungsur turun, pilih fungsi **`setupAndCreateTrigger`**.
    *   Klik butang **▶️ Jalankan**.
    *   Google akan meminta anda untuk **memberi kebenaran** untuk projek baharu ini. Luluskan semua permintaan kebenaran.

## Selesai!
