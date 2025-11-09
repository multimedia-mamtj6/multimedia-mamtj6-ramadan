document.addEventListener('DOMContentLoaded', async () => { 
    // ... (Pemboleh ubah global dan DOM Elements tidak berubah)
    const masihiTargetDate = new Date('2026-02-19T00:00:00');
    const hijriTargetDate = new Date('2026-02-18T19:28:00');
    let hijriInterval;
    let timeOffset = 0;
    let activeExportButton = null;
    const CIRCUMFERENCE = 220;
    const tabs = document.querySelectorAll('.tab');
    const tabContainer = document.getElementById('tab-container');
    const masihiPanel = document.getElementById('masihi-panel');
    const hijriPanel = document.getElementById('hijri-panel');
    const hijriInfoDisplay = document.getElementById('hijri-info-display');
    const masihiDaysDisplay = document.getElementById('masihi-days');
    const exportMasihiBtn = document.getElementById('export-masihi-btn');
    const exportHijriBtn = document.getElementById('export-hijri-btn');
    const canvas = document.getElementById('image-canvas');
    const downloadLink = document.getElementById('download-link');
    const ctx = canvas.getContext('2d');
    const previewPopup = document.getElementById('preview-popup');
    const previewImage = document.getElementById('preview-image');
    const popupCancelBtn = document.getElementById('popup-cancel-btn');
    const popupDownloadBtn = document.getElementById('popup-download-btn');

    function fillTextWithSpacing(context, text, x, y, spacing) {
        let totalWidth = 0;
        for (let i = 0; i < text.length; i++) {
            totalWidth += context.measureText(text[i]).width;
        }
        totalWidth += (text.length - 1) * spacing;
        let currentX = x - (totalWidth / 2);
        for (let i = 0; i < text.length; i++) {
            context.fillText(text[i], currentX, y);
            currentX += context.measureText(text[i]).width + spacing;
        }
    }

    async function synchronizeWithMalaysiaTime() { /* ... (Tidak berubah) */ 
        try { const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Kuala_Lumpur'); if (!response.ok) throw new Error('Gagal menghubungi World Time API'); const data = await response.json(); const serverTime = data.unixtime * 1000; const localTime = Date.now(); timeOffset = serverTime - localTime; } catch (error) { console.error("Gagal menyelaraskan masa, menggunakan masa peranti:", error); }
    }
    function calculateAndDisplayMasihiDays() { /* ... (Tidak berubah) */ 
        const now = new Date(Date.now() + timeOffset); const timeRemaining = masihiTargetDate - now; if (timeRemaining < 0) { masihiDaysDisplay.parentElement.style.display = 'none'; document.getElementById('masihi-message').style.display = 'block'; return; } const days = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)); masihiDaysDisplay.textContent = days;
    }
    const formatTime = (time) => time.toString().padStart(2, '0');
    function updateProgress(circleElement, value, max) { /* ... (Tidak berubah) */ 
        const offset = CIRCUMFERENCE - (CIRCUMFERENCE * value) / max; circleElement.style.strokeDashoffset = offset;
    }
    function formatTimeForDisplay(dateObject) { /* ... (Tidak berubah) */ 
        return dateObject.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    function updateHijriCountdown(targetDate, elements) { /* ... (Tidak berubah) */ 
        if (!targetDate) return; const now = new Date(Date.now() + timeOffset); const timeRemaining = targetDate - now; if (timeRemaining < 0) { elements.countdownContainer.style.display = 'none'; elements.message.style.display = 'block'; clearInterval(elements.intervalId); return; } const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24)); const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)); const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000); elements.days.textContent = days; elements.hoursText.textContent = formatTime(hours); elements.minutesText.textContent = formatTime(minutes); elements.secondsText.textContent = formatTime(seconds); if (days === 0) { elements.days.style.display = 'none'; elements.daysLabel.style.display = 'none'; } else { elements.days.style.display = 'block'; elements.daysLabel.style.display = 'block'; } updateProgress(elements.hoursCircle, hours, 24); updateProgress(elements.minutesCircle, minutes, 60); updateProgress(elements.secondsCircle, seconds, 60);
    }
    const hijriElements = {days: document.getElementById('hijri-days'), daysLabel: hijriPanel.querySelector('.days-label'), hoursText: document.getElementById('hijri-hours-text'), minutesText: document.getElementById('hijri-minutes-text'), secondsText: document.getElementById('hijri-seconds-text'), hoursCircle: document.getElementById('hijri-hours-circle'), minutesCircle: document.getElementById('hijri-minutes-circle'), secondsCircle: document.getElementById('hijri-seconds-circle'), countdownContainer: hijriPanel.querySelector('.countdown-container'), message: document.getElementById('hijri-message')};
    function startHijriCountdown() { /* ... (Tidak berubah) */ 
        if (hijriInterval) clearInterval(hijriInterval); updateHijriCountdown(hijriTargetDate, hijriElements); hijriInterval = setInterval(() => updateHijriCountdown(hijriTargetDate, hijriElements), 1000); hijriElements.intervalId = hijriInterval;
    }
    function initializeHijriCountdown() { /* ... (Tidak berubah) */ 
        hijriInfoDisplay.innerHTML = `Kiraan detik ke waktu Maghrib bagi wilayah Kuala Lumpur <strong>(${formatTimeForDisplay(hijriTargetDate)})</strong> pada 18 Feb 2026.`; startHijriCountdown();
    }
    tabs.forEach(tab => { /* ... (Tidak berubah) */ 
        tab.addEventListener('click', () => { const targetTab = tab.dataset.tab; if (tabContainer.dataset.activeTab === targetTab) return; tabContainer.querySelector('.active').classList.remove('active'); tab.classList.add('active'); tabContainer.dataset.activeTab = targetTab; if (targetTab === 'masihi') { clearInterval(hijriInterval); hijriPanel.classList.remove('active-panel'); masihiPanel.classList.add('active-panel'); } else { masihiPanel.classList.remove('active-panel'); hijriPanel.classList.add('active-panel'); startHijriCountdown(); } });
    });

    // --- FUNGSI EKSPORT PNG DIKEMAS KINI DENGAN LOGIK PENGIRAAN MANUAL ---
    async function generateImage(options) {
        const { templateSrc, texts, filename, button } = options;
        
        activeExportButton = button;
        button.disabled = true;
        button.querySelector('span').textContent = 'Menjana...';

        canvas.width = 1080;
        canvas.height = 1080;
        
        const template = new Image();
        template.crossOrigin = "anonymous";
        template.src = templateSrc;
        
        template.onload = () => {
            ctx.drawImage(template, 0, 0);
            
            texts.forEach(textInfo => {
                ctx.font = textInfo.font;
                ctx.fillStyle = textInfo.color;
                ctx.textAlign = 'center';

                // === LOGIK BAHARU UNTUK PENGTENGAHAN TEPAT ===
                // 1. Ukur ketinggian sebenar fon pada peranti ini
                const metrics = ctx.measureText(textInfo.text);
                const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                
                // 2. Kira kedudukan Y yang betul untuk 'top' baseline
                const calculatedY = (canvas.height / 2) - (textHeight / 2);
                
                // 3. Gunakan baseline yang lebih konsisten
                ctx.textBaseline = 'top'; 
                // ===============================================

                // Set gaya bayang-bayang
                ctx.shadowColor = textInfo.shadowColor || 'transparent';
                ctx.shadowBlur = textInfo.shadowBlur || 0;
                ctx.shadowOffsetX = textInfo.shadowOffsetX || 0;
                ctx.shadowOffsetY = textInfo.shadowOffsetY || 0;
                
                // Gunakan fungsi khas untuk melukis teks dengan jarak, menggunakan Y yang telah dikira
                fillTextWithSpacing(ctx, textInfo.text, textInfo.x, calculatedY, textInfo.spacing || 0);
            });
            
            ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
            
            const imageDataURL = canvas.toDataURL('image/png');
            previewImage.src = imageDataURL;
            popupDownloadBtn.dataset.filename = filename;
            previewPopup.classList.remove('hidden');
        };

        template.onerror = () => {
            alert('Gagal memuatkan imej templat. Pastikan fail berada di lokasi yang betul.');
            closePopup();
        };
    }

    function closePopup() { /* ... (Tidak berubah) */ 
        previewPopup.classList.add('hidden'); if (activeExportButton) { activeExportButton.disabled = false; activeExportButton.querySelector('span').textContent = 'Eksport PNG'; activeExportButton = null; }
    }
    popupCancelBtn.addEventListener('click', closePopup);
    popupDownloadBtn.addEventListener('click', () => { /* ... (Tidak berubah) */ 
        const url = previewImage.src; const filename = popupDownloadBtn.dataset.filename; downloadLink.href = url; downloadLink.download = filename; downloadLink.click(); closePopup();
    });

    // --- Event Listener untuk Butang Eksport (Y dibuang, akan dikira secara automatik) ---
    exportMasihiBtn.addEventListener('click', () => {
        const days = masihiDaysDisplay.textContent;
        const options = {
            templateSrc: '/media/template-masihi.png',
            texts: [{
                text: days,
                font: 'bold 400px Poppins',
                color: '#FFFFFF',
                x: 540, // Kedudukan X tetap di tengah
                spacing: 20,
                shadowColor: 'rgba(0,0,0,0.3)',
                shadowBlur: 15,
                shadowOffsetY: 10
            }],
            filename: `KiraanDetikRamadan-Masihi-${days}hari.png`,
            button: exportMasihiBtn
        };
        generateImage(options);
    });

    exportHijriBtn.addEventListener('click', () => {
        const days = hijriElements.days.textContent;
        const options = {
            templateSrc: '/media/template-hijri.png',
            texts: [{
                text: days,
                font: 'bold 400px Poppins',
                color: '#FFFFFF',
                x: 540, // Kedudukan X tetap di tengah
                spacing: 20,
                shadowColor: 'rgba(0,0,0,0.3)',
                shadowBlur: 15,
                shadowOffsetY: 10
            }],
            filename: `KiraanDetikRamadan-Hijri-${days}hari.png`,
            button: exportHijriBtn
        };
        generateImage(options);
    });

    // --- Initial Load ---
    await synchronizeWithMalaysiaTime(); 
    calculateAndDisplayMasihiDays();
    initializeHijriCountdown();
});