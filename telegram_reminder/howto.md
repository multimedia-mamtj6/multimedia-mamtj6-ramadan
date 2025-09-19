Tentu! Anda boleh mengubah suai semua mesej dengan mudah. Kod ini telah direka bentuk supaya semua teks yang dihantar kepada pengguna terletak di lokasi yang mudah dicari.

Apabila anda menyediakan projek baharu untuk kiraan detik yang lain, anda pasti mahu mesejnya sepadan dengan tema acara tersebut (contohnya, Tahun Baru, Hari Raya, atau hari kemerdekaan).

Berikut adalah panduan lengkap untuk mengubah suai setiap jenis mesej di dalam skrip anda.

---

### Lokasi Utama untuk Mengubah Teks

Terdapat **4 lokasi utama** di dalam kod di mana anda perlu membuat perubahan untuk menyesuaikan semua mesej.

#### 1. Nama Acara (`setupAndCreateTrigger`)

Ini adalah teks yang paling penting kerana ia digunakan di dalam kapsyen utama.

*   **Cari fungsi:** `setupAndCreateTrigger`
*   **Baris kod:**
    ```javascript
    const events = [
      { name: "1 RAMADAN 1447H / 2026", date: "2026-02-19T08:00:00+08:00" },
    ];
    ```
*   **Apa yang perlu diubah:** Tukar teks di dalam `name: "..."`.

**Contoh:** Untuk kiraan detik Tahun Baru.
*   **Sebelum:** `{ name: "1 RAMADAN 1447H / 2026", ... }`
*   **Selepas:** `{ name: "SAMBUTAN TAHUN BARU 2026", ... }`

*(Ingat: Selepas mengubah ini, anda perlu menjalankan `setupAndCreateTrigger` sekali untuk menyimpan acara baharu).*

---

#### 2. Kapsyen Imej Utama (`getCountdownCaption`)

Ini adalah mesej utama yang dihantar bersama imej setiap hari di Telegram.

*   **Cari fungsi:** `getCountdownCaption`
*   **Baris kod:**
    ```javascript
    return `*${daysRemaining} hari lagi!* countdown to *${eventName}* ⌛️\n\n📆 ${formattedDate}\n\nInfo lanjut dan peringatan harian:\n\n#ramadancountdown`;
    ```
*   **Apa yang perlu diubah:** Anda mempunyai kawalan penuh ke atas keseluruhan mesej ini. Anda boleh mengubah ayat, emoji, dan hashtag. **Jangan padam** pembolehubah seperti `${daysRemaining}` dan `${eventName}`.

**Contoh:** Untuk kiraan detik Tahun Baru.
*   **Sebelum:** `*${daysRemaining} hari lagi!* countdown to *${eventName}* ⌛️... #ramadancountdown`
*   **Selepas:** `*Tinggal ${daysRemaining} hari lagi* menuju kemeriahan *${eventName}*! 🎉\n\n🗓️ Tarikh: ${formattedDate}\n\nJom raikan bersama!\n\n#TahunBaru2026 #CountdownMY`

---

#### 3. Teks Perkongsian WhatsApp (`sendTelegramPhotoWithButton`)

Ini adalah mesej yang akan diisi secara automatik apabila pengguna menekan butang "Share on WhatsApp". Kita telah membuang watak khas dari mesej ini untuk memastikan ia berfungsi.

*   **Cari fungsi:** `sendTelegramPhotoWithButton`
*   **Perhatian:** Fungsi ini mengambil kapsyen dari `getCountdownCaption` dan **membersihkannya**. Jika anda gembira dengan hasil pembersihan automatik (iaitu, ia hanya membuang `*`, `#`, dll.), anda **tidak perlu mengubah apa-apa di sini**.

Walau bagaimanapun, jika anda mahu mesej WhatsApp yang **berbeza sama sekali**, anda boleh mengubahnya di sini.

*   **Baris kod:**
    ```javascript
    let whatsappMessage = caption
      .replace(/[*_]/g, "")       // Buang bintang dan garis bawah
      .replace(/⌛️/g, "")         // Buang emoji jam pasir
      // ... dan seterusnya
    ```
*   **Apa yang perlu diubah (jika perlu):** Daripada membersihkan `caption`, anda boleh mencipta mesej baharu sepenuhnya.

**Contoh:** Mesej WhatsApp yang lebih ringkas.
*   **Gantikan keseluruhan blok pembersihan dengan ini:**
    ```javascript
    // Cipta mesej WhatsApp yang lebih ringkas
    let whatsappMessage = `Jom sertai kiraan detik untuk ${eventName}! Tinggal ${daysRemaining} hari lagi.`;
    ```

---

#### 4. Mesej Sambutan (`sendCountdownMessages`)

Ini adalah mesej khas yang dihantar apabila kiraan detik mencecah sifar (pada hari acara).

*   **Cari fungsi:** `sendCountdownMessages`
*   **Baris kod:**
    ```javascript
    const celebrationMessage = `🎉 *Alhamdulillah, ${event.name} telah tiba!* 🎉`;
    ```
*   **Apa yang perlu diubah:** Tukar keseluruhan mesej sambutan.

**Contoh:** Untuk kiraan detik Tahun Baru.
*   **Sebelum:** `🎉 *Alhamdulillah, ${event.name} telah tiba!* 🎉`
*   **Selepas:** `🎆 *SELAMAT TAHUN BARU 2026!* 🎆 Semoga tahun ini membawa kebahagiaan untuk anda semua! ✨`

### Ringkasan

Apabila anda mencipta projek baharu untuk kiraan detik yang berbeza:

1.  **WAJIB:** Tukar **Nama Acara** dalam `setupAndCreateTrigger`.
2.  **WAJIB:** Tukar **Kapsyen Imej Utama** dalam `getCountdownCaption`.
3.  **WAJIB:** Tukar **Mesej Sambutan** dalam `sendCountdownMessages`.
4.  **PILIHAN:** Ubah cara **Teks Perkongsian WhatsApp** dijana dalam `sendTelegramPhotoWithButton` jika perlu.

Dengan mengikuti panduan ini, anda boleh menyesuaikan sepenuhnya setiap aspek teks untuk setiap projek kiraan detik yang anda buat.
