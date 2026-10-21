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
        }, 150);
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

        // Lazy-render corresponding charts and auto-resize
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
            AEGIS_CHARTS.refreshAllCharts();
        }, 100);
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

        const logoDark = 'assets/logo/aegis_wordmark_dark.jpg';
        const logoLight = 'assets/logo/aegis_wordmark_light.jpg';
        const activeLogo = theme === 'dark' ? logoDark : logoLight;
        const blendMode = theme === 'dark' ? 'screen' : 'multiply';

        // Update all brand logo images seamlessly
        const logoIds = ['nav-brand-logo', 'boot-brand-logo', 'hero-brand-logo'];
        logoIds.forEach(id => {
            const img = document.getElementById(id);
            if (img) {
                img.src = activeLogo;
                img.style.mixBlendMode = blendMode;
            }
        });

        // Update sun/moon icon
        const iconEl = document.getElementById('theme-icon');
        if (iconEl) {
            if (theme === 'dark') {
                iconEl.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
            } else {
                iconEl.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
            }
        }

        // Refresh Plotly charts with updated theme colors
        setTimeout(() => {
            AEGIS_CHARTS.refreshAllCharts();
        }, 120);
    }

    /**
     * What-If Macro Stress Testing Calculation Engine
     */
    function updateStressTest() {
        const vixSlider = document.getElementById('slider-vix');
        const usdSlider = document.getElementById('slider-usd');
        const spreadSlider = document.getElementById('slider-spread');

        if (!vixSlider || !usdSlider || !spreadSlider) return;

        const vixVal = parseFloat(vixSlider.value);
        const usdVal = parseFloat(usdSlider.value);
        const spreadVal = parseFloat(spreadSlider.value);

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

        if (predVol >= 0.025) {
            statusText = 'KRISIS EKSTREM // DEFENSIVE';
            statusClass = 'tag-crisis';
            eqWeight = 35;
            sbnWeight = 20;
            cashWeight = 45;
        } else if (predVol >= 0.015) {
            statusText = 'WASPADA // MODERATE HEDGE';
            statusClass = 'tag-warning';
            eqWeight = 60;
            sbnWeight = 25;
            cashWeight = 15;
        }

        // 99% Parametric VaR on AUM Rp 10 Triliun (z = 2.326)
        const aum = 10000; // Miliar Rupiah
        const var99_pct = 2.326 * predVol;
        const var99_amount = (aum * var99_pct).toFixed(1);

        const resPredVol = document.getElementById('res-pred-vol');
        const resPredVolPct = document.getElementById('res-pred-vol-pct');
        const resStatusBadge = document.getElementById('res-status-badge');
        const resVarAmount = document.getElementById('res-var-amount');

        if (resPredVol) resPredVol.textContent = predVol.toFixed(4);
        if (resPredVolPct) resPredVolPct.textContent = (predVol * 100).toFixed(2) + '% Realized Vol';
        if (resStatusBadge) {
            resStatusBadge.textContent = statusText;
            resStatusBadge.className = `badge-tag ${statusClass}`;
        }
        if (resVarAmount) {
            resVarAmount.textContent = `Rp ${parseFloat(var99_amount).toLocaleString('id-ID')} Miliar`;
            resVarAmount.style.color = predVol >= 0.025 ? 'var(--color-crisis)' : (predVol >= 0.015 ? 'var(--color-warning)' : 'var(--color-safe)');
        }

        // Update Weights UI
        const wEq = document.getElementById('weight-equity');
        const wSbn = document.getElementById('weight-sbn');
        const wCash = document.getElementById('weight-cash');

        if (wEq) wEq.textContent = eqWeight + '%';
        if (wSbn) wSbn.textContent = sbnWeight + '%';
        if (wCash) wCash.textContent = cashWeight + '%';

        currentPortfolioWeights = { eq: eqWeight, sbn: sbnWeight, cash: cashWeight };
        AEGIS_CHARTS.renderPortfolioDonut(eqWeight, sbnWeight, cashWeight);
    }

    /**
     * Scenario Presets Handler
     */
    function applyPreset(presetKey) {
        document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.getElementById(`preset-btn-${presetKey}`);
        if (activeBtn) activeBtn.classList.add('active');

        const vixSlider = document.getElementById('slider-vix');
        const usdSlider = document.getElementById('slider-usd');
        const spreadSlider = document.getElementById('slider-spread');

        if (presetKey === 'normal') {
            vixSlider.value = 14.5;
            usdSlider.value = 0.0;
            spreadSlider.value = 2.25;
        } else if (presetKey === 'moderate') {
            vixSlider.value = 24.0;
            usdSlider.value = 4.5;
            spreadSlider.value = 1.0;
        } else if (presetKey === 'covid_shock') {
            vixSlider.value = 65.0;
            usdSlider.value = 14.2;
            spreadSlider.value = -0.50;
        } else if (presetKey === 'fed_hike') {
            vixSlider.value = 32.5;
            usdSlider.value = 8.5;
            spreadSlider.value = 0.25;
        }

        updateStressTest();
    }

    /**
     * High-Resolution 300 DPI Chart Lightbox Modal
     */
    function openImageModal(imgSrc, title) {
        const modal = document.getElementById('chart-lightbox-modal');
        const img = document.getElementById('lightbox-img');
        const titleEl = document.getElementById('lightbox-title');

        if (modal && img && titleEl) {
            img.src = imgSrc;
            titleEl.textContent = title;
            modal.style.display = 'flex';
        }
    }

    function closeImageModal() {
        const modal = document.getElementById('chart-lightbox-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Initialization Bootstrap
     */
    function init() {
        initTheme();
        triggerBootScreen();

        // Bind Stress Test slider input events
        ['slider-vix', 'slider-usd', 'slider-spread'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', updateStressTest);
            }
        });

        // Initialize Overview forecast chart on load
        setTimeout(() => {
            AEGIS_CHARTS.initForecastChart();
        }, 350);
    }

    // Auto-boot on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        nav,
        toggleTheme,
        applyPreset,
        openImageModal,
        closeImageModal,
        triggerBootScreen,
        updateStressTest
    };

})();
