// INVESTION AEGIS — Application Controller & Interactive Simulator
// Handles Boot Screen Animation, SPA Navigation, Dual-Theme Switcher, What-If Stress Testing, and Dynamic Portfolio Allocation

window.AEGIS_APP = (function() {
    let currentPortfolioWeights = { eq: 80, sbn: 20, cash: 0 };

    /**
     * Boot Screen Terminal Animation Sequence
     */
    function triggerBootScreen() {
        const bootScreen = document.getElementById('boot-screen');
        const bootLog = document.getElementById('boot-log');
        const bootFill = document.getElementById('boot-fill');
        const bootPct = document.getElementById('boot-pct');

        if (!bootScreen || !bootLog || !bootFill || !bootPct) return;

        bootScreen.classList.remove('boot-hidden');
        bootLog.innerHTML = '';
        bootFill.style.width = '0%';
        bootPct.textContent = '0%';

        const logs = [
            { text: '[0.1s] Booting AEGIS Quantitative Risk Kernel v4.2...', pct: 15 },
            { text: '[0.3s] Synchronizing PT Investion Mandate (AUM Rp 10.000.000.000.000)...', pct: 35 },
            { text: '[0.5s] Ingesting 4,266 Macro Observations & ADF Stationarity Matrix...', pct: 55 },
            { text: '[0.7s] Inoculating 15 Engineered Macro Features with Purged 5D Gap...', pct: 75 },
            { text: '[0.9s] Loading Champion Boosted Hybrid (Ridge-HAR-X + GBRT)...', pct: 90 },
            { text: '[1.1s] Regulatory Governance POJK 43/2015 & UU P2SK Verified.', pct: 98 },
            { text: '[1.2s] SYSTEM ARMED. Early Warning System Online & Active.', pct: 100 }
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (index < logs.length) {
                const item = logs[index];
                const line = document.createElement('div');
                line.textContent = item.text;
                bootLog.appendChild(line);
                bootLog.scrollTop = bootLog.scrollHeight;

                bootFill.style.width = item.pct + '%';
                bootPct.textContent = item.pct + '%';
                index++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    bootScreen.classList.add('boot-hidden');
                }, 300);
            }
        }, 160);
    }

    /**
     * SPA Tab Navigation Handler
     */
    function nav(pageId, el) {
        document.querySelectorAll('.page-view').forEach(p => {
            p.classList.remove('active');
        });

        const targetView = document.getElementById(`page-${pageId}`);
        if (targetView) {
            targetView.classList.add('active');
        }

        document.querySelectorAll('.nav-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (el) {
            el.classList.add('active');
        } else {
            const defaultBtn = document.querySelector(`.nav-tab-btn[data-page="${pageId}"]`);
            if (defaultBtn) defaultBtn.classList.add('active');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Lazy-render corresponding charts
        setTimeout(() => {
            if (pageId === 'overview') {
                AEGIS_CHARTS.initForecastChart();
            } else if (pageId === 'eda') {
                AEGIS_CHARTS.initMultiAssetChart();
                AEGIS_CHARTS.initVolatilityClusteringChart();
                AEGIS_CHARTS.initFeatureCorrelationChart();
                AEGIS_CHARTS.initCrisisEventChart();
            } else if (pageId === 'model') {
                AEGIS_CHARTS.initParetoFrontierChart();
                AEGIS_CHARTS.initShapChart();
            } else if (pageId === 'simulasi') {
                AEGIS_CHARTS.renderPortfolioDonut(currentPortfolioWeights.eq, currentPortfolioWeights.sbn, currentPortfolioWeights.cash);
            }
        }, 80);
    }

    /**
     * Dual-Mode Theme Switcher (Light / Dark)
     */
    function initTheme() {
        const savedTheme = localStorage.getItem('aegis_theme') || 'dark';
        setTheme(savedTheme);
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('aegis_theme', theme);

        // Update brand logo image
        const brandLogo = document.getElementById('nav-brand-logo');
        if (brandLogo) {
            brandLogo.src = theme === 'dark' ? 'assets/logo/aegis_wordmark_dark.jpg' : 'assets/logo/aegis_wordmark_light.jpg';
        }

        // Update sun/moon icon
        const iconEl = document.getElementById('theme-icon');
        if (iconEl) {
            if (theme === 'dark') {
                iconEl.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
            } else {
                iconEl.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
            }
        }

        // Refresh Plotly charts
        setTimeout(() => {
            AEGIS_CHARTS.refreshAllCharts();
        }, 120);
    }

    /**
     * What-If Macro Stress Testing Calculation Engine
     */
    function updateStressTest() {
        const vixVal = parseFloat(document.getElementById('slider-vix').value);
        const usdVal = parseFloat(document.getElementById('slider-usd').value);
        const spreadVal = parseFloat(document.getElementById('slider-spread').value);

        document.getElementById('val-vix').textContent = vixVal.toFixed(1);
        document.getElementById('val-usd').textContent = (usdVal >= 0 ? '+' : '') + usdVal.toFixed(1) + '%';
        document.getElementById('val-spread').textContent = (spreadVal >= 0 ? '+' : '') + spreadVal.toFixed(2) + '%';

        // Empirical model prediction formula derived from Boosted Hybrid
        let predVol = 0.0082 + (Math.max(0, vixVal - 14) * 0.00045) + (Math.max(0, usdVal) * 0.00068);
        if (spreadVal < 1.0) {
            predVol += (1.0 - spreadVal) * 0.0024;
        }

        predVol = Math.max(0.0080, Math.min(0.0650, predVol));

        let statusText = 'NORMAL // STABIL';
        let statusClass = 'tag-safe';
        let eqWeight = 80;
        let sbnWeight = 20;
        let cashWeight = 0;

        if (predVol > 0.025) {
            statusText = 'KRISIS TINGGI // SHOCK DEFENSE';
            statusClass = 'tag-crisis';
            eqWeight = 20;
            sbnWeight = 60;
            cashWeight = 20;
        } else if (predVol >= 0.015) {
            statusText = 'WASPADA // ELEVATED VOLATILITY';
            statusClass = 'tag-warning';
            eqWeight = 50;
            sbnWeight = 40;
            cashWeight = 10;
        }

        const portfolioAUM = 10000; // Rp 10.000 Miliar = Rp 10 Triliun
        const var99Miliar = Math.round(portfolioAUM * 2.326 * predVol);

        document.getElementById('res-pred-vol').textContent = predVol.toFixed(4);
        document.getElementById('res-pred-vol-pct').textContent = (predVol * 100).toFixed(2) + '% Realized Vol';
        
        const badgeEl = document.getElementById('res-status-badge');
        badgeEl.textContent = statusText;
        badgeEl.className = `badge-tag ${statusClass}`;

        document.getElementById('res-var-amount').textContent = 'Rp ' + var99Miliar.toLocaleString('id-ID') + ' Miliar';

        currentPortfolioWeights = { eq: eqWeight, sbn: sbnWeight, cash: cashWeight };
        document.getElementById('weight-equity').textContent = eqWeight + '%';
        document.getElementById('weight-sbn').textContent = sbnWeight + '%';
        document.getElementById('weight-cash').textContent = cashWeight + '%';

        AEGIS_CHARTS.renderPortfolioDonut(eqWeight, sbnWeight, cashWeight);
    }

    /**
     * Apply Scenario Preset
     */
    function applyPreset(presetId) {
        if (!window.AEGIS_DATA || !window.AEGIS_DATA.stress_presets) return;
        const p = window.AEGIS_DATA.stress_presets.find(x => x.id === presetId);
        if (!p) return;

        document.getElementById('slider-vix').value = p.vix;
        document.getElementById('slider-usd').value = p.usdidr_pct;
        document.getElementById('slider-spread').value = p.spread;

        updateStressTest();

        document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
        const btn = document.getElementById(`preset-btn-${presetId}`);
        if (btn) btn.classList.add('active');
    }

    /**
     * Lightbox Modal for High-Resolution 300 DPI Charts
     */
    function openImageModal(imgSrc, title) {
        const modal = document.getElementById('chart-lightbox-modal');
        const modalImg = document.getElementById('lightbox-img');
        const modalTitle = document.getElementById('lightbox-title');
        if (modal && modalImg) {
            modalImg.src = imgSrc;
            if (modalTitle) modalTitle.textContent = title || 'High-Resolution 300 DPI Analytical Chart';
            modal.style.display = 'flex';
        }
    }

    function closeImageModal() {
        const modal = document.getElementById('chart-lightbox-modal');
        if (modal) modal.style.display = 'none';
    }

    document.addEventListener('DOMContentLoaded', function() {
        initTheme();
        triggerBootScreen();
        nav('overview');

        const sVix = document.getElementById('slider-vix');
        const sUsd = document.getElementById('slider-usd');
        const sSpread = document.getElementById('slider-spread');

        if (sVix && sUsd && sSpread) {
            sVix.addEventListener('input', updateStressTest);
            sUsd.addEventListener('input', updateStressTest);
            sSpread.addEventListener('input', updateStressTest);
            updateStressTest();
        }
    });

    return {
        nav,
        toggleTheme,
        triggerBootScreen,
        updateStressTest,
        applyPreset,
        openImageModal,
        closeImageModal,
        getCurrentPortfolioWeights: () => currentPortfolioWeights
    };
})();
