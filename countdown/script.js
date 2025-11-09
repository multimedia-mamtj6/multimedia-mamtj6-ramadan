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

    const exportMasihiBtn = document.getElementById('export-masihi-btn');
    const exportHijriBtn = document.getElementById('export-hijri-btn');
    const canvas = document.getElementById('image-canvas');
    const downloadLink = document.getElementById('download-link');
    const ctx = canvas.getContext('2d');
    
    const previewPopup = document.getElementById('preview-popup');
    const previewImage = document.getElementById('preview-image');
    const popupCancelBtn = document.getElementById('popup-cancel-btn');
    const popupDownloadBtn = document.getElementById('popup-download-btn');
    
    // --- Time Synchronization ---
    async function synchronizeWithMalaysiaTime() {
        try {
            const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Kuala_Lumpur');
            if (!response.ok) throw new Error('Gagal menghubungi World Time API');
            
            const data = await response.json();
            const serverTime = data.unixtime * 1000;
            const localTime = Date.now();
            
            timeOffset = serverTime - localTime;
            console.log(`Masa diselaraskan dengan waktu Malaysia. Perbezaan: ${timeOffset} ms`);

        } catch (error) {
            console.error("Gagal menyelaraskan masa, menggunakan masa peranti:", error);
        }
    }
    
    // --- Fungsi Kiraan Hari Masihi ---
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
    }

    // --- Helper Functions ---
    const formatTime = (time) => time.toString().padStart(2, '0');

    function updateProgress(circleElement, value, max) {
        const offset = CIRCUMFERENCE - (CIRCUMFERENCE * value) / max;
        circleElement.style.strokeDashoffset = offset;
    }
    
    function formatTimeForDisplay(dateObject) {
        return dateObject.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    // --- Core Countdown Logic (Hijri) ---
    function updateHijriCountdown(targetDate, elements) {
        if (!targetDate) return;
        const now = new Date(Date.now() + timeOffset);
        const timeRemaining = targetDate - now;
        if (timeRemaining < 0) {
            elements.countdownContainer.style.display = 'none';
            elements.message.style.display = 'block';
            clearInterval(elements.intervalId);
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
    
    function startHijriCountdown() {
        if (hijriInterval) clearInterval(hijriInterval);
        updateHijriCountdown(hijriTargetDate, hijriElements);
        hijriInterval = setInterval(() => updateHijriCountdown(hijriTargetDate, hijriElements), 1000);
        hijriElements.intervalId = hijriInterval;
    }

    function initializeHijriCountdown() {
        hijriInfoDisplay.innerHTML = `Kiraan detik ke waktu Maghrib bagi wilayah Kuala Lumpur <strong>(${formatTimeForDisplay(hijriTargetDate)})</strong> pada 18 Feb 2026.`;
        startHijriCountdown();
    }
    
    // --- Tab Switching Logic ---
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            if (tabContainer.dataset.activeTab === targetTab) return; 

            tabContainer.querySelector('.active').classList.remove('active');
            tab.classList.add('active');
            tabContainer.dataset.activeTab = targetTab;
            
            if (targetTab === 'masihi') {
                clearInterval(hijriInterval);
                hijriPanel.classList.remove('active-panel');
                masihiPanel.classList.add('active-panel');
            } else {
                masihiPanel.classList.remove('active-panel');
                hijriPanel.classList.add('active-panel');
                startHijriCountdown();
            }
        });
    });

    // --- FUNGSI EKSPORT PNG ---
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
                ctx.textAlign = textInfo.textAlign || 'center';
                ctx.textBaseline = textInfo.baseline || 'middle';
                ctx.fillText(textInfo.text, textInfo.x, textInfo.y);
            });
            
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

    // --- LOGIK UNTUK POPUP ---
    function closePopup() {
        previewPopup.classList.add('hidden');
        if (activeExportButton) {
            activeExportButton.disabled = false;
            activeExportButton.querySelector('span').textContent = 'Eksport PNG';
            activeExportButton = null;
        }
    }

    popupCancelBtn.addEventListener('click', closePopup);

    popupDownloadBtn.addEventListener('click', () => {
        const url = previewImage.src;
        const filename = popupDownloadBtn.dataset.filename;

        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.click();
        
        closePopup();
    });

    // --- Event Listener untuk Butang Eksport ---
    exportMasihiBtn.addEventListener('click', () => {
        const days = masihiDaysDisplay.textContent;
        
        const options = {
            templateSrc: 'media/template/template-masihi.png',
            texts: [
                {
                    text: days,
                    font: 'bold 300px Segoe UI',
                    color: '#FFFFFF',
                    x: 540,
                    y: 540,
                    shadowColor: 'rgba(0,0,0,0.3)',   // Warna bayang-bayang
                    shadowBlur: 50,                   // Tahap kabur bayang-bayang
                    shadowOffsetY: 50                // Jarak menegak bayang-bayang
                }
            ],
            filename: `KiraanDetikRamadan-Masihi-${days}hari.png`,
            button: exportMasihiBtn
        };
        generateImage(options);
    });

    // === PERUBAHAN LOGIK EKSPORT HIJRI DI SINI ===
    exportHijriBtn.addEventListener('click', () => {
        const days = hijriElements.days.textContent; // Hanya ambil bilangan hari

        const options = {
            templateSrc: 'media/template/template-hijri.png',
            texts: [
                {
                    text: days, // Hanya paparkan hari
                    font: 'bold 300px Segoe UI', // Gunakan saiz fon yang sama dengan Masihi
                    color: '#FFFFFF',
                    x: 540,
                    y: 540 // Tengahkan kedudukan Y
                }
            ],
            filename: `KiraanDetikRamadan-Hijri-${days}hari.png`,
            button: exportHijriBtn
        };
        generateImage(options);
    });
    // ===========================================

    // --- Initial Load ---
    await synchronizeWithMalaysiaTime(); 
    calculateAndDisplayMasihiDays();
    initializeHijriCountdown();
});