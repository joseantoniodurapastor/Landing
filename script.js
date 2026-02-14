/* ═══════════════════════════════════════════════════════════════
   EBOOK LANDING — IA FEROZ
   Form handling, scroll animations, analytics
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─── CONFIG ────────────────────────────────────────────────
    const WEBHOOK_URL = 'https://YOUR-N8N-WEBHOOK-URL'; // ← Replace with real n8n webhook
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // ─── DOM REFS ──────────────────────────────────────────────
    const form = document.getElementById('leadForm');
    const emailInput = document.getElementById('emailInput');
    const submitBtn = document.getElementById('submitBtn');
    const timestampField = document.getElementById('timestampField');
    const errorMsg = document.getElementById('formError');
    const successMsg = document.getElementById('formSuccess');

    // ─── FORM HANDLING ─────────────────────────────────────────
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        clearMessages();

        const email = emailInput.value.trim();

        // Validate
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
        submitBtn.textContent = 'ENVIANDO...';

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    timestamp: timestampField.value,
                    source: 'ebook_landing'
                })
            });

            if (!response.ok) throw new Error('Error en el servidor');

            // Success
            showSuccess('✓ ¡Listo! Revisa tu email en los próximos 2 minutos.');
            emailInput.value = '';
            emailInput.classList.remove('input--error');
            form.classList.add('form--submitted');

            // Analytics
            trackConversion();

        } catch (err) {
            showError('Hubo un problema al enviar. Inténtalo de nuevo.');
            console.error('Webhook error:', err);
        } finally {
            submitBtn.classList.remove('btn--loading');
            submitBtn.textContent = 'DESCARGAR ATLAS GRATUITO';
        }
    });

    // Clear error on input
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
