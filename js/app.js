// INVESTION AEGIS — Application Controller & Interactive Simulator
// Handles Single Page Navigation (SPA), Dual-Theme Switcher, What-If Stress Testing, and Dynamic Portfolio Allocation

window.AEGIS_APP = (function() {
    let currentPortfolioWeights = { eq: 65, sbn: 30, cash: 5 };

    /**
     * SPA Tab Navigation Handler
     */
    function nav(pageId, el) {
        // Hide all views
        document.querySelectorAll('.page-view').forEach(p => {
            p.classList.remove('active');
        });

        // Show target view
        const targetView = document.getElementById(`page-${pageId}`);
        if (targetView) {
            targetView.classList.add('active');
        }

        // Update nav tab buttons
        document.querySelectorAll('.nav-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (el) {
            el.classList.add('active');
        } else {
            const defaultBtn = document.querySelector(`.nav-tab-btn[data-page="${pageId}"]`);
            if (defaultBtn) defaultBtn.classList.add('active');
        }

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Lazy-render charts based on active page
        setTimeout(() => {
            if (pageId === 'overview') {
                AEGIS_CHARTS.initForecastChart();
            } else if (pageId === 'eda') {
                AEGIS_CHARTS.initMultiAssetChart();
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
        const savedTheme = localStorage.getItem('aegis_theme') || 'dark'; // Defaulting to sleek dark, or matching light
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

        const iconEl = document.getElementById('theme-icon');
        if (iconEl) {
            if (theme === 'dark') {
                // Sun icon for switching to light
                iconEl.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
            } else {
                // Moon icon for switching to dark
                iconEl.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
            }
        }

        // Refresh Plotly charts with updated theme colors
        setTimeout(() => {
            AEGIS_CHARTS.refreshAllCharts();
        }, 100);
    }

    /**
     * What-If Macro Stress Testing Calculation Engine
     * Implements empirical model response curves derived from Champion Ridge-HAR-X + GBRT
     */
    function updateStressTest() {
        const vixVal = parseFloat(document.getElementById('slider-vix').value);
        const usdVal = parseFloat(document.getElementById('slider-usd').value);
        const spreadVal = parseFloat(document.getElementById('slider-spread').value);

        // Update value displays
        document.getElementById('val-vix').textContent = vixVal.toFixed(1);
        document.getElementById('val-usd').textContent = (usdVal >= 0 ? '+' : '') + usdVal.toFixed(1) + '%';
        document.getElementById('val-spread').textContent = (spreadVal >= 0 ? '+' : '') + spreadVal.toFixed(2) + '%';

        // Empirical model prediction formula
        // Baseline intercept: 0.0078
        // VIX transmission coefficient: +0.00038 per point above 15
        // FX Pressure coefficient: +0.00062 per % depreciation
        // Rate Spread penalty: +0.00180 if spread < 1.0%
        let predVol = 0.0085 + (Math.max(0, vixVal - 14) * 0.00042) + (Math.max(0, usdVal) * 0.00065);
        if (spreadVal < 1.0) {
            predVol += (1.0 - spreadVal) * 0.0022;
        }

        // Clamp to empirical ranges
        predVol = Math.max(0.0080, Math.min(0.0650, predVol));

        // Determine EWS Status & Portfolio Weights
        let statusText = 'NORMAL // STABIL';
        let statusClass = 'tag-safe';
        let statusBadgeClass = 'text-safe';
        let eqWeight = 80;
        let sbnWeight = 20;
        let cashWeight = 0;

        if (predVol > 0.025) {
            statusText = 'KRISIS TINGGI // SHOCK DEFENSE';
            statusClass = 'tag-crisis';
            statusBadgeClass = 'text-crisis';
            eqWeight = 20;
            sbnWeight = 60;
            cashWeight = 20;
        } else if (predVol >= 0.015) {
            statusText = 'WASPADA // ELEVATED VOLATILITY';
            statusClass = 'tag-warning';
            statusBadgeClass = 'text-warning';
            eqWeight = 50;
            sbnWeight = 40;
            cashWeight = 10;
        }

        // 99% 5-Day Value at Risk for Rp 10 Triliun fund (Z_99% = 2.326)
        // VaR = Portfolio_Value * Z * predVol * sqrt(5/5)
        const portfolioAUM = 10000; // in Miliar IDR (Rp 10.000 Miliar = Rp 10 Triliun)
        const var99Miliar = Math.round(portfolioAUM * 2.326 * predVol);

        // Update UI
        document.getElementById('res-pred-vol').textContent = predVol.toFixed(4);
        document.getElementById('res-pred-vol-pct').textContent = (predVol * 100).toFixed(2) + '%';
        
        const badgeEl = document.getElementById('res-status-badge');
        badgeEl.textContent = statusText;
        badgeEl.className = `badge-tag ${statusClass}`;

        document.getElementById('res-var-amount').textContent = 'Rp ' + var99Miliar.toLocaleString('id-ID') + ' Miliar';

        // Update Portfolio Weights
        currentPortfolioWeights = { eq: eqWeight, sbn: sbnWeight, cash: cashWeight };
        document.getElementById('weight-equity').textContent = eqWeight + '%';
        document.getElementById('weight-sbn').textContent = sbnWeight + '%';
        document.getElementById('weight-cash').textContent = cashWeight + '%';

        // Re-render Donut Chart
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

        // Highlight active preset button
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

    // Initialize on DOM Ready
    document.addEventListener('DOMContentLoaded', function() {
        initTheme();
        nav('overview');

        // Setup slider event listeners
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
        updateStressTest,
        applyPreset,
        openImageModal,
        closeImageModal,
        getCurrentPortfolioWeights: () => currentPortfolioWeights
    };
})();
