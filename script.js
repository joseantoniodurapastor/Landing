/* ═══════════════════════════════════════════════════════════════
   EBOOK LANDING — IA FEROZ
   Form handling, scroll animations, analytics
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─── CONFIG ────────────────────────────────────────────────
    const WEBHOOK_URL = 'https://YOUR-N8N-WEBHOOK-URL'; // ← Replace with real n8n webhook
    const SHEET_WEBHOOK_URL = 'https://YOUR-APPS-SCRIPT-URL'; // ← Replace with Apps Script web app URL
    const PDF_URL = 'https://raw.githubusercontent.com/joseantoniodurapastor/Landing/main/Atlas_Estrategico_Agencias_IA_Feroz.pdf';
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // ─── DOM REFS ──────────────────────────────────────────────
    const form = document.getElementById('leadForm');
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const submitBtn = document.getElementById('submitBtn');
    const timestampField = document.getElementById('timestampField');
    const errorMsg = document.getElementById('formError');
    const successMsg = document.getElementById('formSuccess');

    // ─── PDF DOWNLOAD ──────────────────────────────────────────
    function triggerDownload() {
        var a = document.createElement('a');
        a.href = PDF_URL;
        a.download = 'Atlas_Estrategico_Agencias_IA_Feroz.pdf';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // ─── SEND TO GOOGLE SHEET ──────────────────────────────────
    function sendToSheet(payload) {
        fetch(SHEET_WEBHOOK_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        }).catch(function (err) {
            console.warn('Google Sheet error:', err);
        });
    }

    // ─── FORM HANDLING ─────────────────────────────────────────
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        clearMessages();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        // Validate name
        if (!name) {
            showError('Por favor, introduce tu nombre');
            nameInput.classList.add('input--error');
            nameInput.focus();
            return;
        }

        // Validate email
        if (!email || !EMAIL_REGEX.test(email)) {
            showError('Por favor, introduce un email válido');
            emailInput.classList.add('input--error');
            emailInput.focus();
            return;
        }

        // Set timestamp
        timestampField.value = new Date().toISOString();

        // Loading state
        submitBtn.classList.add('btn--loading');
        submitBtn.textContent = 'DESCARGANDO...';

        var payload = {
            name: name,
            email: email,
            timestamp: timestampField.value,
            source: 'ebook_landing'
        };

        // 1) Trigger PDF download immediately
        triggerDownload();

        // 2) Send lead data to Google Sheet + n8n webhook in parallel
        sendToSheet(payload);

        try {
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            // Webhook failure doesn't block the user — PDF already downloading
            console.warn('Webhook error (PDF still delivered):', err);
        }

        // 3) Show success
        showSuccess('✓ ¡Descarga iniciada! También recibirás el PDF por email.');
        nameInput.value = '';
        emailInput.value = '';
        nameInput.classList.remove('input--error');
        emailInput.classList.remove('input--error');
        form.classList.add('form--submitted');
        submitBtn.classList.remove('btn--loading');
        submitBtn.textContent = 'DESCARGAR ATLAS GRATUITO';

        // Analytics
        trackConversion();
    });

    // Clear error on input
    nameInput.addEventListener('input', function () {
        nameInput.classList.remove('input--error');
        clearMessages();
    });

    emailInput.addEventListener('input', function () {
        emailInput.classList.remove('input--error');
        clearMessages();
    });

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.classList.add('visible');
    }

    function showSuccess(msg) {
        successMsg.textContent = msg;
        successMsg.classList.add('visible');
    }

    function clearMessages() {
        errorMsg.textContent = '';
        errorMsg.classList.remove('visible');
        successMsg.textContent = '';
        successMsg.classList.remove('visible');
    }

    // ─── SCROLL ANIMATIONS ────────────────────────────────────
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(function (el) {
        observer.observe(el);
    });

    // ─── ANALYTICS ─────────────────────────────────────────────
    function trackConversion() {
        // Google Analytics 4
        if (typeof gtag === 'function') {
            gtag('event', 'ebook_download', {
                event_category: 'lead',
                event_label: 'atlas_estrategico'
            });
        }

        // Facebook Pixel
        if (typeof fbq === 'function') {
            fbq('track', 'Lead');
        }
    }

})();
