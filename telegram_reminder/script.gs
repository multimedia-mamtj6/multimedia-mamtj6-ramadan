// ✅ ISIKAN MAKLUMAT ANDA DI SINI
const BOT_TOKEN = "-"; // Token Bot Telegram anda
const CHAT_ID = "@islamic_countdown"; // ID Sembang Saluran anda
const PRESENTATION_ID = "-"; // 👈 Tampal ID Google Slides anda di sini

/**
 * Pemegang Teks (Placeholder) yang anda gunakan dalam Google Slides. 
 * Pastikan ia sepadan dengan apa yang anda taip dalam Langkah 3 di atas.
 */
const COUNTDOWN_PLACEHOLDER = "{{countdown_number}}";

//================================================================
// ANDA TIDAK PERLU MENGUBAH APA-APA DI BAWAH BAHAGIAN INI
//================================================================

/**
 * Menetapkan acara kiraan detik dan mencipta pencetus harian.
 * Jalankan fungsi ini sekali sahaja untuk memulakan.
 */
function setupAndCreateTrigger() {
  const events = [
    { name: "1 RAMADAN 1447H / 2026", date: "2026-02-19T08:00:00+08:00" },
  ];
  PropertiesService.getScriptProperties().setProperty("COUNTDOWN_EVENTS", JSON.stringify(events));
  console.log("Acara kiraan detik telah ditetapkan.");
  createDailyTrigger();
}

/**
 * Mencipta atau mengemas kini pencetus harian untuk sendCountdownMessages.
 */
function createDailyTrigger() {
  console.log("Mencipta pencetus harian...");
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === "sendCountdownMessages") {
      ScriptApp.deleteTrigger(trigger);
      console.log("Pencetus sedia ada telah dipadam.");
    }
  });

  const triggerHour = 9;
  const triggerMinute = 5;
  ScriptApp.newTrigger("sendCountdownMessages")
    .timeBased()
    .everyDays(1)
    .atHour(triggerHour)
    .nearMinute(triggerMinute)
    .create();
  console.log(`Pencetus harian baharu dicipta untuk berjalan sekitar ${triggerHour}:${triggerMinute}.`);
}

/**
 * Fungsi utama yang berjalan setiap hari.
 * Ia menjana imej dan menghantarnya ke Telegram.
 */
function sendCountdownMessages() {
  console.log("Memulakan sendCountdownMessages...");
  const countdownEvents = JSON.parse(PropertiesService.getScriptProperties().getProperty("COUNTDOWN_EVENTS") || "[]");
  if (!countdownEvents.length) {
    console.error("Tiada acara kiraan detik ditemui.");
    return;
  }

  const now = new Date();
  const event = countdownEvents[0]; // Hanya proses acara pertama
  const targetDate = new Date(event.date);

  const timeDifference = targetDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  if (timeDifference < 0) {
    // Logik untuk acara yang telah berlalu atau hari ini
    if (now.toDateString() === targetDate.toDateString()) {
      const celebrationMessage = `🎉 *Alhamdulillah, ${event.name} telah tiba!* 🎉`;
      sendTelegramMessageWithButton(celebrationMessage); // Hantar mesej teks biasa untuk sambutan
      console.log(`Mesej sambutan dihantar untuk "${event.name}".`);
    } else {
      console.log(`Acara "${event.name}" telah berlalu. Mengalih keluar.`);
    }
    // Alih keluar acara yang telah tamat
    PropertiesService.getScriptProperties().deleteProperty("COUNTDOWN_EVENTS");
  } else {
    // Logik untuk acara akan datang
    console.log(`Menjana imej untuk ${daysRemaining} hari lagi...`);
    const imageUrl = generateCountdownImage(daysRemaining);

    if (imageUrl) {
      console.log(`Imej berjaya dijana: ${imageUrl}`);
      const caption = getCountdownCaption(targetDate, event.name, daysRemaining);
      sendTelegramPhotoWithButton(imageUrl, caption);
    } else {
      console.error("Gagal menjana URL imej.");
    }
  }
}

/**
 * Mengemas kini Google Slides dengan nombor kiraan detik dan mengembalikan URL imej.
 * @param {number} number Nombor untuk dipaparkan pada slaid.
 * @return {string|null} URL imej PNG atau null jika gagal.
 */
/**
 * Mengemas kini Google Slides dengan nombor kiraan detik dan mengembalikan URL imej.
 * @param {number} number Nombor untuk dipaparkan pada slaid.
 * @return {string|null} URL imej PNG atau null jika gagal.
 */
function generateCountdownImage(number) {
  try {
    const presentation = SlidesApp.openById(PRESENTATION_ID);
    const slide = presentation.getSlides()[0];

    // Gantikan teks pemegang dengan nombor sebenar
    slide.replaceAllText(COUNTDOWN_PLACEHOLDER, number.toString());
    presentation.saveAndClose();
    console.log(`Teks dalam slaid dikemas kini kepada: ${number}`);

    // === BAHAGIAN BAHARU MENGGUNAKAN SLIDES API ===
    // Dapatkan ID Objek Slaid
    const pageObjectId = slide.getObjectId();
    
    // Minta thumbnail daripada API rasmi
    const thumbnail = Slides.Presentations.Pages.getThumbnail(PRESENTATION_ID, pageObjectId, {
      "thumbnailProperties.thumbnailSize": "LARGE", // LARGE biasanya ~1080px pada sisi panjang
      "thumbnailProperties.mimeType": "PNG"
    });

    const imageUrl = thumbnail.contentUrl;
    console.log(`URL imej daripada API: ${imageUrl}`);
    
    // Tukar semula teks kepada pemegang untuk larian seterusnya
    const presToReset = SlidesApp.openById(PRESENTATION_ID);
    presToReset.getSlides()[0].replaceAllText(number.toString(), COUNTDOWN_PLACEHOLDER);
    presToReset.saveAndClose();
    console.log("Slaid telah direset kepada pemegang asal.");

    return imageUrl;

  } catch (e) {
    // Log ralat dengan lebih terperinci
    console.error(`Ralat dalam generateCountdownImage: ${e.toString()}\nStack: ${e.stack}`);
    return null;
  }
}

/**
 * Membina teks kapsyen untuk dihantar bersama imej.
 */
function getCountdownCaption(targetDate, eventName, daysRemaining) {
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = targetDate.toLocaleDateString('ms-MY', options);
  
  // ✅ Kapsyen ini mengandungi semua teks yang kita mahu, diformat untuk Telegram.
  return `*${daysRemaining} hari lagi!* countdown to *${eventName}* ⌛️\n\n📆 ${formattedDate}\n\nInfo lanjut dan peringatan harian:\n\n#ramadancountdown`;
}

/**
 * Menghantar imej (melalui URL) dengan kapsyen dan butang ke Telegram.
 * Versi muktamad dengan pembersihan teks yang agresif untuk WhatsApp.
 */
function sendTelegramPhotoWithButton(imageUrl, caption) {
  // === LANGKAH 1: HANTAR FOTO TANPA BUTANG ===
  const sendUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
  
  const initialPayload = {
    chat_id: CHAT_ID,
    photo: imageUrl,
    caption: caption,
    parse_mode: "Markdown"
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(initialPayload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(sendUrl, options);
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();

    if (responseCode !== 200) {
      console.error(`Langkah 1 Gagal: Hantar foto. Kod: ${responseCode}. Respons: ${responseBody}`);
      return;
    }

    // === LANGKAH 2: DAPATKAN ID MESEJ DAN TAMBAH BUTANG ===
    const result = JSON.parse(responseBody);
    const messageId = result.result.message_id;

    if (!messageId) {
      console.error("Langkah 2 Gagal: Tidak dapat mencari message_id.", responseBody);
      return;
    }
    
    console.log(`Foto dihantar dengan ID: ${messageId}. Menambah butang...`);

    // =========================================================================
    // ✅ VERSI PEMBERSIHAN MUKTAMAD UNTUK WHATSAPP
    // =========================================================================
    // 1. Mula dengan kapsyen asal.
    // 2. Buang SEMUA watak pemformatan dan emoji yang berpotensi menjadi masalah.
    let whatsappMessage = caption
      .replace(/[*_]/g, "")       // Buang bintang dan garis bawah
      .replace(/⌛️/g, "")         // Buang emoji jam pasir
      .replace(/#ramadancountdown/g, "") // Buang hashtag
      .replace(/\\/g, "")        // Buang garis miring terbalik
      .trim();                   // Buang sebarang ruang kosong di hujung

    const channelUsername = CHAT_ID.startsWith('@') ? CHAT_ID.substring(1) : CHAT_ID;
    const postUrl = `https://t.me/${channelUsername}/${messageId}`;
    
    // 3. Tambah pautan spesifik pada teks yang sudah bersih.
    whatsappMessage += `\n${postUrl}`;
    
    const buttons = [{ text: "Share on WhatsApp", url: `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}` }];
    const inlineKeyboard = { inline_keyboard: [buttons] };
    
    // Sediakan payload untuk mengedit mesej dan menambah butang
    const editUrl = `https://api.telegram.org/bot${BOT_TOKEN}/editMessageReplyMarkup`;
    const editPayload = {
      chat_id: CHAT_ID,
      message_id: messageId,
      reply_markup: JSON.stringify(inlineKeyboard)
    };

    const editOptions = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(editPayload)
    };
    
    UrlFetchApp.fetch(editUrl, editOptions);
    console.log("Butang berjaya ditambah.");

  } catch (e) {
    console.error(`Ralat semasa proses hantar/edit: ${e.toString()}`);
  }
}

/**
 * Menghantar mesej teks biasa dengan butang (digunakan untuk sambutan).
 */
function sendTelegramMessageWithButton(message) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const buttons = [{ text: "Share on WhatsApp", url: `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}` }];
  const inlineKeyboard = { inline_keyboard: [buttons] };

  const payload = {
    chat_id: CHAT_ID,
    text: message,
    parse_mode: "Markdown",
    reply_markup: JSON.stringify(inlineKeyboard)
  };
  
  try {
    UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload)
    });
  } catch (e) {
    console.error(`Ralat semasa menghantar mesej ke Telegram: ${e.toString()}`);
  }
}
