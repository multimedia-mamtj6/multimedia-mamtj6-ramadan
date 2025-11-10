document.addEventListener('DOMContentLoaded', async () => {
    // --- Global Variables ---
    const masihiTargetDate = new Date('2026-02-19T00:00:00');
    const hijriTargetDate = new Date('2026-02-18T19:28:00');
    let hijriInterval;
    let timeOffset = 0;
    let activeExportButton = null;
    const CIRCUMFERENCE = 220;

    // --- DOM Elements ---
    const tabs = document.querySelectorAll('.tab');
    const tabContainer = document.getElementById('tab-container');
    const masihiPanel = document.getElementById('masihi-panel');
    const hijriPanel = document.getElementById('hijri-panel');
    const hijriInfoDisplay = document.getElementById('hijri-info-display');
    const masihiDaysDisplay = document.getElementById('masihi-days');
    const canvas = document.getElementById('image-canvas');
    const downloadLink = document.getElementById('download-link');
    const ctx = canvas.getContext('2d');
    const previewPopup = document.getElementById('preview-popup');
    const previewImage = document.getElementById('preview-image');
    const popupCancelBtn = document.getElementById('popup-cancel-btn');
    const popupDownloadBtn = document.getElementById('popup-download-btn');
    const unifiedExportBtn = document.getElementById('unified-export-btn');
    const exportChoicePopup = document.getElementById('export-choice-popup');
    const choiceMasihiBtn = document.getElementById('choice-masihi-btn');
    const choiceHijriBtn = document.getElementById('choice-hijri-btn');
    const choiceCancelBtn = document.getElementById('choice-cancel-btn');

    // === ELEMEN UNTUK FADE IN ===
    const masihiCountdownContainer = masihiPanel.querySelector('.countdown-container');
    const masihiInfo = document.getElementById('masihi-info-display');
    const hijriCountdownContainer = hijriPanel.querySelector('.countdown-container');
    const hijriInfo = document.getElementById('hijri-info-display');
    const fadeElements = [masihiCountdownContainer, masihiInfo, hijriCountdownContainer, hijriInfo];
    // =============================

    // --- Time Synchronization ---
    async function synchronizeWithMalaysiaTime() {
        try {
            const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Kuala_Lumpur');
            if (!response.ok) throw new Error('Gagal menghubungi World Time API');
            const data = await response.json();
            const serverTime = data.unixtime * 1000;
            const localTime = Date.now();
            timeOffset = serverTime - localTime;
        } catch (error) {
            console.error("Gagal menyelaraskan masa, menggunakan masa peranti:", error);
        }
    }

    // --- Fungsi Kiraan Hari Masihi (dengan logik Fade In) ---
    function calculateAndDisplayMasihiDays() {
        const now = new Date(Date.now() + timeOffset);
        const timeRemaining = masihiTargetDate - now;
        if (timeRemaining < 0) {
            masihiDaysDisplay.parentElement.style.display = 'none';
            document.getElementById('masihi-message').style.display = 'block';
            return;
        }
        const days = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
        masihiDaysDisplay.textContent = days;
        
        // Cetuskan fade-in selepas pengiraan selesai
        setTimeout(() => {
            masihiCountdownContainer.classList.add('fade-in');
            masihiInfo.classList.add('fade-in');
        }, 50); // Kelewatan kecil untuk memastikan elemen sedia
    }

     // --- Helper Functions ---
    const formatTime = (time) => time.toString().padStart(2, '0');
    function updateProgress(circleElement, value, max) {
        const offset = CIRCUMFERENCE - (CIRCUMFERENCE * value) / max;
        circleElement.style.strokeDashoffset = offset;
    }
    function formatTimeForDisplay(dateObject) {
        return dateObject.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    // --- Countdown Elements (Hijri) ---
    const hijriElements = {
        days: document.getElementById('hijri-days'),
        daysLabel: hijriPanel.querySelector('.days-label'),
        hoursText: document.getElementById('hijri-hours-text'),
        minutesText: document.getElementById('hijri-minutes-text'),
        secondsText: document.getElementById('hijri-seconds-text'),
        hoursCircle: document.getElementById('hijri-hours-circle'),
        minutesCircle: document.getElementById('hijri-minutes-circle'),
        secondsCircle: document.getElementById('hijri-seconds-circle'),
        countdownContainer: hijriPanel.querySelector('.countdown-container'),
        message: document.getElementById('hijri-message'),
    };

     // --- Core Countdown Logic (Hijri) ---
    function updateHijriCountdown(targetDate, elements) {
        if (!targetDate) return;
        const now = new Date(Date.now() + timeOffset);
        const timeRemaining = targetDate - now;
        if (timeRemaining < 0) {
            elements.countdownContainer.style.display = 'none';
            elements.message.style.display = 'block';
            clearInterval(hijriInterval);
            return;
        }
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        elements.days.textContent = days;
        elements.hoursText.textContent = formatTime(hours);
        elements.minutesText.textContent = formatTime(minutes);
        elements.secondsText.textContent = formatTime(seconds);
        if (days === 0) {
            elements.days.style.display = 'none';
            elements.daysLabel.style.display = 'none';
        } else {
            elements.days.style.display = 'block';
            elements.daysLabel.style.display = 'block';
        }
        updateProgress(elements.hoursCircle, hours, 24);
        updateProgress(elements.minutesCircle, minutes, 60);
        updateProgress(elements.secondsCircle, seconds, 60);
    }

    function startHijriCountdown() {
        if (hijriInterval) clearInterval(hijriInterval);
        updateHijriCountdown(hijriTargetDate, hijriElements);
        hijriInterval = setInterval(() => updateHijriCountdown(hijriTargetDate, hijriElements), 1000);
    }

    function initializeHijriCountdown() {
        hijriInfoDisplay.innerHTML = `Kiraan detik ke waktu Maghrib bagi wilayah Kuala Lumpur <strong>(${formatTimeForDisplay(hijriTargetDate)})</strong> pada 18 Feb 2026.`;
        startHijriCountdown();
    }
    
    // --- Tab Switching Logic (dengan logik Fade In/Out) ---
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            if (tabContainer.dataset.activeTab === targetTab) return;

            // 1. Sembunyikan semua elemen (remove fade-in)
            fadeElements.forEach(el => el.classList.remove('fade-in'));

            // Tunggu seketika untuk efek fade-out selesai
            setTimeout(() => {
                tabContainer.querySelector('.active').classList.remove('active');
                tab.classList.add('active');
                tabContainer.dataset.activeTab = targetTab;
                
                if (targetTab === 'masihi') {
                    clearInterval(hijriInterval);
                    hijriPanel.classList.remove('active-panel');
                    masihiPanel.classList.add('active-panel');
                    
                    // 2. Paparkan elemen di tab baharu (add fade-in)
                    masihiCountdownContainer.classList.add('fade-in');
                    masihiInfo.classList.add('fade-in');
                } else {
                    masihiPanel.classList.remove('active-panel');
                    hijriPanel.classList.add('active-panel');
                    startHijriCountdown();

                    // 2. Paparkan elemen di tab baharu (add fade-in)
                    hijriCountdownContainer.classList.add('fade-in');
                    hijriInfo.classList.add('fade-in');
                }
            }, 250); // Masa ini patut separuh dari masa transisi dalam CSS
        });
    });
    
    // --- FUNGSI LUKISAN DIKEMAS KINI DENGAN yOffset ---
    function drawCenteredTextWithSpacing(textInfo) {
        ctx.font = textInfo.font;
        ctx.fillStyle = textInfo.color;
        
        let totalWidth = 0;
        for (let i = 0; i < textInfo.text.length; i++) {
            totalWidth += ctx.measureText(textInfo.text[i]).width;
        }
        totalWidth += (textInfo.text.length - 1) * (textInfo.spacing || 0);

        let currentX = (canvas.width - totalWidth) / 2;
        
        const metrics = ctx.measureText(textInfo.text);
        const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        
        // === PERUBAHAN DI SINI: Guna yOffset ===
        const yOffset = textInfo.yOffset || 0; // Guna 0 jika tiada
        const currentY = ((canvas.height - textHeight) / 2) + yOffset;
        // ====================================

        ctx.shadowColor = textInfo.shadowColor || 'transparent';
        ctx.shadowBlur = textInfo.shadowBlur || 0;
        ctx.shadowOffsetX = textInfo.shadowOffsetX || 0;
        ctx.shadowOffsetY = textInfo.shadowOffsetY || 0;

        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        for (let i = 0; i < textInfo.text.length; i++) {
            const char = textInfo.text[i];
            ctx.fillText(char, currentX, currentY);
            currentX += ctx.measureText(char).width + (textInfo.spacing || 0);
        }
    }

    async function generateImage(options) {
        const { templateSrc, texts, filename, button } = options;
        activeExportButton = button;
        button.disabled = true;
        
        canvas.width = 1080;
        canvas.height = 1080;
        const template = new Image();
        template.crossOrigin = "anonymous";
        template.src = templateSrc;

        template.onload = () => {
            ctx.drawImage(template, 0, 0);
            texts.forEach(textInfo => {
                drawCenteredTextWithSpacing(textInfo);
            });
            
            ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
            
            const imageDataURL = canvas.toDataURL('image/png');
            previewImage.src = imageDataURL;
            popupDownloadBtn.dataset.filename = filename;
            previewPopup.classList.remove('hidden');
        };

        template.onerror = () => {
            alert('Gagal memuatkan imej templat.');
            closePreviewPopup();
        };
    }

    // --- Popup Logic ---
    function closePreviewPopup() {
        previewPopup.classList.add('hidden');
        if (activeExportButton) {
            activeExportButton.disabled = false;
            activeExportButton = null;
        }
    }

    function closeChoicePopup() {
        exportChoicePopup.classList.add('hidden');
    }

    popupCancelBtn.addEventListener('click', closePreviewPopup);
    popupDownloadBtn.addEventListener('click', () => {
        const url = previewImage.src;
        const filename = popupDownloadBtn.dataset.filename;
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.click();
        closePreviewPopup();
    });

    // --- Unified Export Button Logic ---
    unifiedExportBtn.addEventListener('click', () => {
        exportChoicePopup.classList.remove('hidden');
    });
    choiceCancelBtn.addEventListener('click', closeChoicePopup);

    choiceMasihiBtn.addEventListener('click', () => {
        closeChoicePopup();
        const days = masihiDaysDisplay.textContent;
        const options = {
            templateSrc: 'media/template/template-masihi.png',
            texts: [{ 
                text: days, 
                font: '700 300px Merriweather', 
                color: '#FFFFFF', 
                spacing: 15,
                // === PERUBAHAN DI SINI: Tambah yOffset ===
                yOffset: -30, // Nombor negatif untuk gerak ke atas
                // =======================================
                shadowColor: 'rgba(0,0,0,0.3)', 
                shadowBlur: 15, 
                shadowOffsetY: 10 
            }],
            filename: `KiraanDetikRamadan-Masihi-${days}hari.png`,
            button: unifiedExportBtn
        };
        generateImage(options);
    });

    choiceHijriBtn.addEventListener('click', () => {
        closeChoicePopup();
        const days = hijriElements.days.textContent;
        const options = {
            templateSrc: 'media/template/template-hijri.png',
            texts: [{ 
                text: days, 
                font: '700 300px Merriweather', 
                color: '#FFFFFF', 
                spacing: 15,
                // === PERUBAHAN DI SINI: Tambah yOffset ===
                yOffset: -30, // Nombor negatif untuk gerak ke atas
                // =======================================
                shadowColor: 'rgba(0,0,0,0.3)', 
                shadowBlur: 15, 
                shadowOffsetY: 10 
            }],
            filename: `KiraanDetikRamadan-Hijri-${days}hari.png`,
            button: unifiedExportBtn
        };
        generateImage(options);
    });

    // --- Initial Load ---
    (async () => {
        await synchronizeWithMalaysiaTime();
        calculateAndDisplayMasihiDays();
        initializeHijriCountdown();
    })();

});
