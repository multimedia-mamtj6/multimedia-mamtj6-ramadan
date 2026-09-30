document.addEventListener('DOMContentLoaded', async () => {
    // --- Global Variables (fallback 2027 provisional; ramadan-config.json overrides when reachable) ---
    // TODO(2027-recheck): sahkan tarikh rasmi 1 Ramadan 1448H + waktu Maghrib KL 7 Feb 2027
    // sebaik sahaja pengumuman Penyimpan Mohor + api.waktusolat.app?year=2027 live (404 ketika ditulis).
    let masihiTargetDate = new Date('2027-02-08T00:00:00');
    let hijriTargetDate = new Date('2027-02-07T19:29:00');
    let hijriInfoDateLabel = '7 Februari 2027';
    // Fasa templat: before-rejab | rejab | syaaban | ramadan (fallback sama jika config gagal dibaca)
    let hijriMonths = { rejab1: '2026-12-10', syaaban1: '2027-01-09', ramadan1: '2027-02-08' };
    let templateFolders = { 'before-rejab': '1-before-rejab', 'rejab': '2-in-rejab', 'syaaban': '3-in-syaaban', 'ramadan': '' };
    let templateFiles = {
        'before-rejab': { hijri: 'hijri-before-rejab.png', masihi: 'masihi-before-rejab.png' },
        'rejab': { hijri: 'hijri-in-rejab.png', masihi: 'masihi-in-rejab.png' },
        'syaaban': { hijri: 'hijri-in-syaaban.png', masihi: 'masihi-in-syaaban.png' },
        'ramadan': { hijri: 'hijri-in-ramadan.png', masihi: 'masihi-in-ramadan.png' }
    };
    let testDates = { 'before-rejab': '2026-12-01', 'rejab': '2026-12-15', 'syaaban': '2027-01-15', 'ramadan': '2027-02-15' };
    try {
        const cfgRes = await fetch('/ramadan-config.json', { cache: 'no-store' });
        if (cfgRes.ok) {
            const cfg = await cfgRes.json();
            if (cfg.ramadanStart) masihiTargetDate = new Date(cfg.ramadanStart);
            if (cfg.hijriTarget) hijriTargetDate = new Date(cfg.hijriTarget);
            if (cfg.labels && cfg.labels.hijriInfoDate) hijriInfoDateLabel = cfg.labels.hijriInfoDate;
            if (cfg.hijriMonths) hijriMonths = { ...hijriMonths, ...cfg.hijriMonths };
            if (cfg.templateFolders) templateFolders = { ...templateFolders, ...cfg.templateFolders };
            if (cfg.templateFiles) templateFiles = { ...templateFiles, ...cfg.templateFiles };
            if (cfg.testDates) testDates = { ...testDates, ...cfg.testDates };
        }
    } catch (e) {
        console.warn('ramadan-config.json tidak dapat dibaca, guna fallback:', e);
    }

    // --- Fasa + parameter ujian (?testDate / ?test / ?debug) ---
    // Keutamaan: ?testDate=YYYY-MM-DD > ?test=<fasa> > tarikh sebenar. ?debug=1 papar panel rujukan.
    const urlParams = new URLSearchParams(window.location.search);
    const testAliases = {
        'before-rejab': 'before-rejab', '1-before-rejab': 'before-rejab', '1': 'before-rejab',
        'rejab': 'rejab', '2-in-rejab': 'rejab', '2': 'rejab',
        'syaaban': 'syaaban', '3-in-syaaban': 'syaaban', '3': 'syaaban',
        'ramadan': 'ramadan', '4-in-ramadan': 'ramadan', '4': 'ramadan'
    };
    function resolvePhase(d) {
        const t = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        const r1 = new Date(hijriMonths.ramadan1 + 'T00:00:00').getTime();
        const s1 = new Date(hijriMonths.syaaban1 + 'T00:00:00').getTime();
        const j1 = new Date(hijriMonths.rejab1 + 'T00:00:00').getTime();
        if (t >= r1) return 'ramadan';
        if (t >= s1) return 'syaaban';
        if (t >= j1) return 'rejab';
        return 'before-rejab';
    }
    let dateSource = 'live';
    let timeOffset = 0;
    let effectiveDate = new Date(Date.now() + timeOffset);
    const testDateParam = urlParams.get('testDate');
    const testParam = (urlParams.get('test') || '').toLowerCase().trim();
    if (testDateParam && !isNaN(new Date(testDateParam + 'T00:00:00').getTime())) {
        effectiveDate = new Date(testDateParam + 'T00:00:00');
        dateSource = 'testDate';
    } else if (testParam && testAliases[testParam] && testDates[testAliases[testParam]]) {
        effectiveDate = new Date(testDates[testAliases[testParam]] + 'T00:00:00');
        dateSource = 'test';
    }
    // ?testTime=HH:MM (24j) — hanya bermakna bersama ?testDate / ?test; lalai 00:00 (tengah malam).
    // Format tidak sah atau tanpa mod ujian → diabaikan (jam live digunakan).
    const testTimeMatch = /^(\d{1,2}):(\d{2})$/.exec((urlParams.get('testTime') || '').trim());
    if ((dateSource === 'testDate' || dateSource === 'test') && testTimeMatch) {
        const hh = parseInt(testTimeMatch[1], 10);
        const mm = parseInt(testTimeMatch[2], 10);
        if (hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) {
            effectiveDate = new Date(effectiveDate.getFullYear(), effectiveDate.getMonth(), effectiveDate.getDate(), hh, mm, 0);
        }
    }
    // Jam simulasi: tarikh efektif + masa nyata yang berlalu sejak load (detik terus berdetik).
    // Mod live: jam peranti + offset penyegerakan Malaysia.
    const simAnchor = effectiveDate.getTime();
    const realAnchor = Date.now();
    function getNow() {
        if (dateSource === 'testDate' || dateSource === 'test') {
            return new Date(simAnchor + (Date.now() - realAnchor));
        }
        return new Date(Date.now() + timeOffset);
    }
    let activePhase = resolvePhase(effectiveDate);
    function templateBase() {
        const folder = templateFolders[activePhase];
        return folder ? `media/template/${folder}` : 'media/template';
    }
    function templatePath(kind) {
        return `${templateBase()}/${templateFiles[activePhase][kind]}`;
    }
    const debugMode = urlParams.get('debug') === '1' || urlParams.has('debug') && urlParams.get('debug') === '';
    if (dateSource !== 'live' || debugMode) {
        console.log(`[countdown] fasa=${activePhase} sumber=${dateSource} tarikh=${effectiveDate.toString()} templat=${templatePath('masihi')} / ${templatePath('hijri')}`);
    }
    let hijriInterval;
    let masihiInterval;
    let activeExportButton = null;
    const CIRCUMFERENCE = 220;

    // Generate timestamp for cache-busting template images
    function getCacheBustParam() {
        // Use a daily timestamp (updates once per day)
        const now = new Date();
        const dayTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        return `?v=${dayTimestamp}`;
    }

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

    // --- Kiraan Masihi langsung (hari + jam/minit/saat, cermin logik Hijri) ---
    // Nota: objek masihiElements diisytihar selepas seksyen DOM Elements (memerlukan masihiPanel).

    function updateMasihiCountdown(targetDate, elements) {
        if (!targetDate) return;
        const now = getNow();
        const timeRemaining = targetDate - now;
        if (timeRemaining < 0) {
            elements.countdownContainer.style.display = 'none';
            document.getElementById('masihi-message').style.display = 'block';
            clearInterval(masihiInterval);
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
            elements.countdownContainer.classList.add('final-day');
        } else {
            elements.days.style.display = 'block';
            elements.daysLabel.style.display = 'block';
            elements.countdownContainer.classList.remove('final-day');
        }
        updateProgress(elements.hoursCircle, hours, 24);
        updateProgress(elements.minutesCircle, minutes, 60);
        updateProgress(elements.secondsCircle, seconds, 60);
        pulseOnChange(elements, 'days', days);
        pulseOnChange(elements, 'hours', hours);
        pulseOnChange(elements, 'minutes', minutes);
    }

    function startMasihiCountdown() {
        if (masihiInterval) clearInterval(masihiInterval);
        updateMasihiCountdown(masihiTargetDate, masihiElements);
        masihiInterval = setInterval(() => updateMasihiCountdown(masihiTargetDate, masihiElements), 1000);
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
    // Pop + glow pada ring jam/minit dan nombor hari ketika nilainya bertukar
    // (saat dikecualikan — terlalu kerap). Tiada pop pada lukisan pertama.
    function pulseOnChange(elements, slot, value) {
        const key = '_prev_' + slot;
        if (elements[key] === undefined) {
            elements[key] = value;
            return;
        }
        if (value === elements[key]) return;
        elements[key] = value;
        // Slot 'days' tiada ring — animasikan nombor hari itu sendiri (bukan container).
        const target = slot === 'days' ? elements.days : elements[slot + 'Circle'];
        const box = slot === 'days' ? target : (target ? target.closest('.time-box') : null);
        if (!box) return;
        box.classList.remove('tick-pop');
        void box.offsetWidth; // paksa reflow supaya animasi boleh dicetus semula
        box.classList.add('tick-pop');
        setTimeout(() => box.classList.remove('tick-pop'), 500);
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

    // --- Elemen Masihi (diisi selepas DOM; memerlukan masihiPanel) ---
    const masihiElements = {
        days: document.getElementById('masihi-days'),
        daysLabel: masihiPanel.querySelector('.days-label'),
        hoursText: document.getElementById('masihi-hours-text'),
        minutesText: document.getElementById('masihi-minutes-text'),
        secondsText: document.getElementById('masihi-seconds-text'),
        hoursCircle: document.getElementById('masihi-hours-circle'),
        minutesCircle: document.getElementById('masihi-minutes-circle'),
        secondsCircle: document.getElementById('masihi-seconds-circle'),
        countdownContainer: masihiPanel.querySelector('.countdown-container'),
        message: document.getElementById('masihi-message'),
    };

     // --- Core Countdown Logic (Hijri) ---
    function updateHijriCountdown(targetDate, elements) {
        if (!targetDate) return;
        const now = getNow();
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
            elements.countdownContainer.classList.add('final-day');
        } else {
            elements.days.style.display = 'block';
            elements.daysLabel.style.display = 'block';
            elements.countdownContainer.classList.remove('final-day');
        }
        updateProgress(elements.hoursCircle, hours, 24);
        updateProgress(elements.minutesCircle, minutes, 60);
        updateProgress(elements.secondsCircle, seconds, 60);
        pulseOnChange(elements, 'days', days);
        pulseOnChange(elements, 'hours', hours);
        pulseOnChange(elements, 'minutes', minutes);
    }

    function startHijriCountdown() {
        if (hijriInterval) clearInterval(hijriInterval);
        updateHijriCountdown(hijriTargetDate, hijriElements);
        hijriInterval = setInterval(() => updateHijriCountdown(hijriTargetDate, hijriElements), 1000);
    }

    function initializeHijriCountdown() {
        hijriInfoDisplay.innerHTML = `Kiraan detik ke waktu Maghrib bagi wilayah Kuala Lumpur <strong>(${formatTimeForDisplay(hijriTargetDate)})</strong> pada ${hijriInfoDateLabel}.`;
        startHijriCountdown();
    }
    
    // --- Tab Switching Logic (Lebih Licin & Ringkas) ---
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            if (tabContainer.dataset.activeTab === targetTab) return;

            // Tukar tab yang aktif
            tabContainer.querySelector('.active').classList.remove('active');
            tab.classList.add('active');
            tabContainer.dataset.activeTab = targetTab;
            
            if (targetTab === 'masihi') {
                // Hentikan kiraan Hijri, mulakan kiraan Masihi & tukar panel
                clearInterval(hijriInterval);
                hijriPanel.classList.remove('active-panel');
                masihiPanel.classList.add('active-panel');
                startMasihiCountdown();
            } else {
                // Hentikan kiraan Masihi, mulakan kiraan Hijri & tukar panel
                clearInterval(masihiInterval);
                masihiPanel.classList.remove('active-panel');
                hijriPanel.classList.add('active-panel');
                startHijriCountdown();
            }
            // CSS akan menguruskan transisi fade secara automatik
        });
    });
    
    // --- FUNGSI LUKISAN DIKEMAS KINI DENGAN PENDEKATAN YANG LEBIH STABIL ---
    function drawCenteredTextWithSpacing(textInfo) {
        ctx.font = textInfo.font;
        ctx.fillStyle = textInfo.color;
        
        // Logik untuk mengira lebar dan posisi-X (mendatar) tidak berubah
        let totalWidth = 0;
        for (let i = 0; i < textInfo.text.length; i++) {
            totalWidth += ctx.measureText(textInfo.text[i]).width;
        }
        totalWidth += (textInfo.text.length - 1) * (textInfo.spacing || 0);
        let currentX = (canvas.width - totalWidth) / 2;
        
        // === PERUBAHAN DI SINI: PENGIRAAN POSISI-Y YANG BAHARU ===
        const yOffset = textInfo.yOffset || 0;
        const currentY = (canvas.height / 2) + yOffset;

        // Logik bayang-bayang tidak berubah
        ctx.shadowColor = textInfo.shadowColor || 'transparent';
        ctx.shadowBlur = textInfo.shadowBlur || 0;
        ctx.shadowOffsetX = textInfo.shadowOffsetX || 0;
        ctx.shadowOffsetY = textInfo.shadowOffsetY || 0;

        // Logik textAlign tidak berubah
        ctx.textAlign = 'left';

        // === PERUBAHAN DI SINI: TUKAR TEXTBASELINE ===
        ctx.textBaseline = 'middle'; 

        // Logik untuk melukis setiap aksara tidak berubah
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
            // Jika templat gagal dimuat, pastikan pengguna boleh cuba lagi
            exportChoicePopup.classList.add('hidden');
            if (activeExportButton) {
                activeExportButton.disabled = false;
                activeExportButton = null;
            }
        };
    }

    // --- Popup Logic (DIKEMAS KINI) ---

    // Butang batal pada popup PRATONTON
    popupCancelBtn.addEventListener('click', () => {
        // Hanya sembunyikan popup pratonton, kembali ke popup pilihan
        previewPopup.classList.add('hidden');
    });

    // Butang muat turun pada popup PRATONTON
    popupDownloadBtn.addEventListener('click', () => {
        const url = previewImage.src;
        const filename = popupDownloadBtn.dataset.filename;
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.click();
        
        // Tutup SEMUA popup dan aktifkan semula butang utama
        previewPopup.classList.add('hidden');
        exportChoicePopup.classList.add('hidden');
        if (activeExportButton) {
            activeExportButton.disabled = false;
            activeExportButton = null;
        }
    });

    // --- Unified Export Button Logic (DIKEMAS KINI) ---

    // Butang terapung utama
    unifiedExportBtn.addEventListener('click', () => {
        exportChoicePopup.classList.remove('hidden');
    });

    // Butang batal pada popup PILIHAN
    choiceCancelBtn.addEventListener('click', () => {
        exportChoicePopup.classList.add('hidden');
        // Pastikan butang utama diaktifkan semula jika proses dibatalkan di sini
        if (activeExportButton) {
            activeExportButton.disabled = false;
            activeExportButton = null;
        }
    });

    // Butang pilihan Masihi
    choiceMasihiBtn.addEventListener('click', () => {
        // Nota: closeChoicePopup() telah dibuang untuk membenarkan logik 'kembali'
        const days = masihiDaysDisplay.textContent;
        const options = {
            templateSrc: `${templatePath('masihi')}${getCacheBustParam()}`,
            texts: [{
                text: days,
                font: '700 300px Merriweather',
                color: '#FFFFFF',
                spacing: 15,
                yOffset: -5,
                shadowColor: 'rgba(0,0,0,0.3)',
                shadowBlur: 15,
                shadowOffsetY: 10
            }],
            filename: `KiraanDetikRamadan-Masihi-${days}hari.png`,
            button: unifiedExportBtn
        };
        generateImage(options);
    });

    // Butang pilihan Hijri
    choiceHijriBtn.addEventListener('click', () => {
        // Nota: closeChoicePopup() telah dibuang untuk membenarkan logik 'kembali'
        const days = hijriElements.days.textContent;
        const options = {
            templateSrc: `${templatePath('hijri')}${getCacheBustParam()}`,
            texts: [{ 
                text: days, 
                font: '700 300px Merriweather', 
                color: '#FFFFFF', 
                spacing: 15,
                yOffset: -5,
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
        // Mod ujian: abaikan penyegerakan masa (jam simulasi deterministik dari ?testDate/?test).
        if (dateSource === 'live') {
            await synchronizeWithMalaysiaTime();
        }
        initializeHijriCountdown();
        startMasihiCountdown();
        // Lencana fasa ketika mod ujian aktif (?test / ?testDate)
        if (dateSource !== 'live') {
            const badge = document.createElement('div');
            badge.id = 'phase-badge';
            badge.textContent = `MOD UJIAN — fasa: ${activePhase} (${dateSource} ${effectiveDate.toLocaleString('ms-MY', { hour12: false })})`;
            badge.style.cssText = 'position:fixed;bottom:12px;left:12px;z-index:9999;background:#f59e0b;color:#000;font:700 12px sans-serif;padding:8px 12px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.3);';
            document.body.appendChild(badge);
        }
        // Panel rujukan ?debug=1 — senarai semua parameter ujian
        if (debugMode) {
            const phases = ['before-rejab', 'rejab', 'syaaban', 'ramadan'];
            const links = phases.map(p => `<li><a href="?test=${p}">${p}</a> → ${testDates[p]} → <code>${templateFolders[p] ? 'media/template/' + templateFolders[p] + '/' : 'media/template/'}${templateFiles[p].masihi} / ${templateFiles[p].hijri}</code></li>`).join('');
            const panel = document.createElement('div');
            panel.id = 'debug-panel';
            panel.innerHTML = `<strong>DEBUG — parameter ujian</strong><br>`
                + `sumber tarikh: <code>${dateSource}</code> | tarikh berkesan: <code>${effectiveDate.toDateString()}</code><br>`
                + `jam simulasi: <code>${getNow().toLocaleString('ms-MY', { hour12: false })}</code> (tambah <code>&testTime=HH:MM</code> untuk ubah)<br>`
                + `fasa: <code>${activePhase}</code> | templat: <code>${templatePath('masihi')} / ${templatePath('hijri')}</code><br>`
                + `config: ramadanStart=<code>${masihiTargetDate.toISOString()}</code> hijriTarget=<code>${hijriTargetDate.toISOString()}</code><br>`
                + `hijriMonths: rejab1=<code>${hijriMonths.rejab1}</code> syaaban1=<code>${hijriMonths.syaaban1}</code> ramadan1=<code>${hijriMonths.ramadan1}</code>`
                + `<ul>${links}</ul>`
                + `<div>?testDate=YYYY-MM-DD mengatasi ?test; <code>&testTime=HH:MM</code> pilihan (lalai 00:00). <a href="?">mod live</a> | cth: <a href="?testDate=2026-12-15">?testDate=2026-12-15</a> <a href="?testDate=2027-02-07&testTime=18:00">maghrib eve 18:00</a></div>`;
            panel.style.cssText = 'position:fixed;top:12px;right:12px;z-index:9999;background:#111;color:#eee;font:12px/1.6 sans-serif;padding:12px 14px;border-radius:10px;max-width:340px;box-shadow:0 2px 12px rgba(0,0,0,.4);';
            panel.querySelectorAll('a').forEach(a => { a.style.color = '#fbbf24'; });
            document.body.appendChild(panel);
            console.log('[countdown][debug]', { dateSource, effectiveDate: effectiveDate.toString(), activePhase, template: [templatePath('masihi'), templatePath('hijri')], hijriMonths, testDates });
        }
    })();
});