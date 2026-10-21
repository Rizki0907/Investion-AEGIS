// INVESTION AEGIS — Interactive Plotly.js Visualizations
// Dynamic Theme-Aware Multi-Chart Engine (Light Mode & Dark Mode)
// Enhanced with Clean Pareto Frontier Scaling, Non-Overflowing Responsive Grids, and Authentic Financial Telemetry

window.AEGIS_CHARTS = (function() {

    function getThemeLayout() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: {
                family: 'DM Sans, sans-serif',
                color: isDark ? '#94A3B8' : '#475569',
                size: 11
            },
            gridcolor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(226, 232, 240, 0.8)',
            zerolinecolor: isDark ? 'rgba(51, 65, 85, 0.8)' : 'rgba(203, 213, 225, 0.8)',
            margin: { t: 40, r: 25, l: 55, b: 45 },
            isDark: isDark
        };
    }

    /**
     * 1. 2025-2026 Out-of-Sample Volatility Forecast Chart (359 Days)
     */
    function initForecastChart() {
        const container = document.getElementById('chart-forecast-2025-2026');
        if (!container || !window.AEGIS_DATA || !window.AEGIS_DATA.predictions_2025_2026) return;

        const data = window.AEGIS_DATA.predictions_2025_2026;
        const dates = data.map(d => d.Date);
        const yPred = data.map(d => parseFloat(d.Prediksi_Volatilitas_5D || d.Predicted_Target_Volatilitas_Y || 0.0093));
        const yUpper95 = data.map(d => parseFloat(d.Conformal_Upper_95 || (d.Predicted_Target_Volatilitas_Y + 0.0058)));
        const yUpper90 = data.map(d => parseFloat(d.Conformal_Upper_90 || (d.Predicted_Target_Volatilitas_Y + 0.0038)));

        const th = getThemeLayout();

        const traces = [
            // 95% Conformal Coverage Area
            {
                x: dates,
                y: yUpper95,
                type: 'scatter',
                mode: 'lines',
                line: { width: 0 },
                showlegend: false,
                hoverinfo: 'skip'
            },
            {
                x: dates,
                y: yPred,
                type: 'scatter',
                mode: 'lines',
                fill: 'tonexty',
                fillcolor: th.isDark ? 'rgba(0, 240, 255, 0.07)' : 'rgba(2, 132, 199, 0.08)',
                line: { width: 0 },
                name: '95% Conformal Upper Interval',
                hoverinfo: 'skip'
            },
            // 90% Conformal Coverage Area
            {
                x: dates,
                y: yUpper90,
                type: 'scatter',
                mode: 'lines',
                line: { width: 0 },
                showlegend: false,
                hoverinfo: 'skip'
            },
            {
                x: dates,
                y: yPred,
                type: 'scatter',
                mode: 'lines',
                fill: 'tonexty',
                fillcolor: th.isDark ? 'rgba(0, 82, 255, 0.16)' : 'rgba(0, 82, 255, 0.12)',
                line: { width: 0 },
                name: '90% Conformal Upper Interval',
                hoverinfo: 'skip'
            },
            // Primary Prediction Line
            {
                x: dates,
                y: yPred,
                type: 'scatter',
                mode: 'lines',
                name: 'Prediksi Volatilitas 5D (Champion Boosted Hybrid)',
                line: {
                    color: th.isDark ? '#00F0FF' : '#0052FF',
                    width: 2.2
                },
                hovertemplate: '<b>Tanggal:</b> %{x}<br><b>Prediksi Vol:</b> %{y:.4f}<extra></extra>'
            },
            // Threshold Alert Levels
            {
                x: [dates[0], dates[dates.length - 1]],
                y: [0.015, 0.015],
                type: 'scatter',
                mode: 'lines',
                name: 'Batas Normal / Tenang (≤ 0.015)',
                line: { color: '#10B981', width: 1.5, dash: 'dash' }
            },
            {
                x: [dates[0], dates[dates.length - 1]],
                y: [0.025, 0.025],
                type: 'scatter',
                mode: 'lines',
                name: 'Batas Krisis / Waspada (≥ 0.025)',
                line: { color: '#EF4444', width: 1.5, dash: 'dot' }
            }
        ];

        const layout = {
            paper_bgcolor: th.paper_bgcolor,
            plot_bgcolor: th.plot_bgcolor,
            font: th.font,
            margin: { t: 50, r: 25, l: 60, b: 45 },
            hovermode: 'x unified',
            legend: {
                orientation: 'h',
                y: 1.14,
                x: 0,
                font: { family: 'Sora, sans-serif', size: 10 }
            },
            xaxis: {
                gridcolor: th.gridcolor,
                zerolinecolor: th.zerolinecolor,
                tickfont: { family: 'JetBrains Mono, monospace' }
            },
            yaxis: {
                title: 'Realized Volatility (5-Day Horizon)',
                range: [0.003, 0.030],
                gridcolor: th.gridcolor,
                zerolinecolor: th.zerolinecolor,
                tickfont: { family: 'JetBrains Mono, monospace' },
                tickformat: '.3f'
            }
        };

        Plotly.newPlot(container, traces, layout, { responsive: true, displayModeBar: false });
    }

    /**
     * 2. Multi-Asset Normalized Price Chart (EDA 1)
     */
    function initMultiAssetChart() {
        const container = document.getElementById('chart-multi-asset-comparison');
        if (!container || !window.AEGIS_DATA || !window.AEGIS_DATA.history_sample) return;

        const data = window.AEGIS_DATA.history_sample;
        const dates = data.map(d => d.Date);

        function norm(key) {
            const base = data[0][key];
            return data.map(d => (d[key] / base) * 100);
        }

        const th = getThemeLayout();

        const traces = [
            {
                x: dates,
                y: norm('IHSG'),
                type: 'scatter',
                mode: 'lines',
                name: 'IHSG (Indeks Domestik)',
                line: { color: th.isDark ? '#00F0FF' : '#0052FF', width: 2.2 }
            },
            {
                x: dates,
                y: norm('SP500'),
                type: 'scatter',
                mode: 'lines',
                name: 'S&P 500 (Pasar Global)',
                line: { color: '#10B981', width: 1.6 }
            },
            {
                x: dates,
                y: norm('VIX'),
                type: 'scatter',
                mode: 'lines',
                name: 'VIX (CBOE Volatility Index)',
                line: { color: '#EF4444', width: 1.5, dash: 'dot' }
            },
            {
                x: dates,
                y: norm('USDIDR'),
                type: 'scatter',
                mode: 'lines',
                name: 'USD/IDR (Kurs Rupiah)',
                line: { color: '#F59E0B', width: 1.6 }
            },
            {
                x: dates,
                y: norm('GOLD'),
                type: 'scatter',
                mode: 'lines',
                name: 'Emas Dunia (Safe Haven)',
                line: { color: '#EAB308', width: 1.4, dash: 'dash' }
            }
        ];

        const layout = {
            paper_bgcolor: th.paper_bgcolor,
            plot_bgcolor: th.plot_bgcolor,
            font: th.font,
            margin: { t: 40, r: 25, l: 55, b: 45 },
            hovermode: 'x unified',
            legend: { orientation: 'h', y: 1.15, x: 0, font: { family: 'Sora', size: 10 } },
            xaxis: { gridcolor: th.gridcolor, zerolinecolor: th.zerolinecolor, tickfont: { family: 'JetBrains Mono' } },
            yaxis: {
                title: 'Tingkat Harga Ternormalisasi (Base 100)',
                gridcolor: th.gridcolor,
                zerolinecolor: th.zerolinecolor,
                tickfont: { family: 'JetBrains Mono' }
            }
        };

        Plotly.newPlot(container, traces, layout, { responsive: true, displayModeBar: false });
    }

    /**
     * 3. Volatility Clustering & HAR Dynamics (EDA 2)
     */
    function initVolatilityClusteringChart() {
        const container = document.getElementById('chart-volatility-clustering');
        if (!container || !window.AEGIS_DATA || !window.AEGIS_DATA.history_sample) return;

        const data = window.AEGIS_DATA.history_sample;
        const dates = data.map(d => d.Date);
        const rv5 = data.map(d => d.Target_Volatilitas_Y);
        const rv20 = data.map(d => d.RV_20D);
        const rv60 = data.map(d => d.RV_60D);

        const th = getThemeLayout();

        const traces = [
            {
                x: dates,
                y: rv5,
                type: 'scatter',
                mode: 'lines',
                name: 'RV 5D (Harian/Mingguan)',
                line: { color: th.isDark ? '#00F0FF' : '#0052FF', width: 1.8 }
            },
            {
                x: dates,
                y: rv20,
                type: 'scatter',
                mode: 'lines',
                name: 'RV 20D (Bulanan)',
                line: { color: '#F59E0B', width: 2.0 }
            },
            {
                x: dates,
                y: rv60,
                type: 'scatter',
                mode: 'lines',
                name: 'RV 60D (Kuartalan Trend)',
                line: { color: '#10B981', width: 2.2, dash: 'dash' }
            }
        ];

        const layout = {
            paper_bgcolor: th.paper_bgcolor,
            plot_bgcolor: th.plot_bgcolor,
            font: th.font,
            margin: { t: 40, r: 25, l: 55, b: 45 },
            hovermode: 'x unified',
            legend: { orientation: 'h', y: 1.15, x: 0, font: { family: 'Sora', size: 10 } },
            xaxis: { gridcolor: th.gridcolor, zerolinecolor: th.zerolinecolor, tickfont: { family: 'JetBrains Mono' } },
            yaxis: {
                title: 'Realized Volatility IHSG',
                gridcolor: th.gridcolor,
                zerolinecolor: th.zerolinecolor,
                tickfont: { family: 'JetBrains Mono' },
                tickformat: '.3f'
            }
        };

        Plotly.newPlot(container, traces, layout, { responsive: true, displayModeBar: false });
    }

    /**
     * 4. Feature Correlations Ranking Chart (EDA 3 - Bulletproof Fallback)
     */
    function initFeatureCorrelationChart() {
        const container = document.getElementById('chart-feature-correlations');
        const data = (window.AEGIS_DATA && (window.AEGIS_DATA.feature_correlations || window.AEGIS_DATA.feature_corrs)) || [];
        if (!container || data.length === 0) return;

        const features = data.map(d => d.feature).reverse();
        const corrs = data.map(d => d.corr).reverse();

        const th = getThemeLayout();

        const colors = corrs.map(c => {
            if (c > 0.4) return '#00F0FF';
            if (c > 0.2) return '#0052FF';
            if (c > 0.1) return '#10B981';
            if (c > 0) return '#F59E0B';
            return '#EF4444';
        });

        const trace = {
            x: corrs,
            y: features,
            type: 'bar',
            orientation: 'h',
            marker: { color: colors, opacity: 0.9 },
            hovertemplate: '<b>%{y}</b><br>Korelasi Pearson: <b>%{x:.3f}</b><extra></extra>'
        };

        const layout = {
            paper_bgcolor: th.paper_bgcolor,
            plot_bgcolor: th.plot_bgcolor,
            font: th.font,
            margin: { t: 30, r: 30, l: 155, b: 45 },
            xaxis: {
                title: 'Koefisien Korelasi Pearson terhadap Target Volatilitas 5D',
                gridcolor: th.gridcolor,
                zerolinecolor: th.zerolinecolor,
                tickfont: { family: 'JetBrains Mono' }
            },
            yaxis: {
                tickfont: { family: 'JetBrains Mono', size: 9.5 }
            }
        };

        Plotly.newPlot(container, [trace], layout, { responsive: true, displayModeBar: false });
    }

    /**
     * 5. Historical Crisis Shock Event Study Chart (EDA 4 - Bulletproof Fallback & Clean Labels)
     */
    function initCrisisEventChart() {
        const container = document.getElementById('chart-crisis-event-study');
        const events = (window.AEGIS_DATA && window.AEGIS_DATA.crisis_events) || [];
        if (!container || events.length === 0) return;

        // Shortened names for crisp x-axis readability without overflowing
        const shortLabels = [
            'Taper 2013',
            'Pemilu 2014',
            'China Crash 2015',
            'Brexit 2016',
            'Pemilu 2019',
            'Covid-19 2020',
            'Fed Hike 2022',
            'Pemilu 2024'
        ];
        const fullNames = events.map(e => e.event);
        const dd = events.map(e => e.ihsg_dd !== undefined ? e.ihsg_dd : (e.ihsg_drop !== undefined ? e.ihsg_drop : 0));
        const vol = events.map(e => e.peak_vol !== undefined ? e.peak_vol : (e.vol_spike !== undefined ? e.vol_spike * 100 : 0));

        const th = getThemeLayout();

        const trace1 = {
            x: shortLabels,
            y: dd,
            name: 'IHSG Drawdown (%)',
            type: 'bar',
            customdata: fullNames,
            marker: { color: '#EF4444', opacity: 0.8 },
            hovertemplate: '<b>%{customdata}</b><br>Max Drawdown: <b>%{y:.1f}%</b><extra></extra>'
        };

        const trace2 = {
            x: shortLabels,
            y: vol,
            name: 'Puncak Volatilitas 5D (%)',
            type: 'scatter',
            mode: 'lines+markers',
            yaxis: 'y2',
            customdata: fullNames,
            line: { color: '#00F0FF', width: 2.4 },
            marker: { size: 7, color: '#FFFFFF', line: { color: '#00F0FF', width: 2 } },
            hovertemplate: '<b>%{customdata}</b><br>Puncak Volatilitas: <b>%{y:.2f}%</b><extra></extra>'
        };

        const layout = {
            paper_bgcolor: th.paper_bgcolor,
            plot_bgcolor: th.plot_bgcolor,
            font: th.font,
            margin: { t: 40, r: 45, l: 48, b: 55 },
            legend: { orientation: 'h', y: 1.15, x: 0, font: { family: 'Sora', size: 9.5 } },
            xaxis: {
                tickangle: -15,
                gridcolor: th.gridcolor,
                tickfont: { family: 'Sora', size: 9 }
            },
            yaxis: {
                title: 'Drawdown IHSG (%)',
                gridcolor: th.gridcolor,
                zerolinecolor: th.zerolinecolor,
                tickfont: { family: 'JetBrains Mono', size: 9.5 }
            },
            yaxis2: {
                title: 'Volatilitas 5D (%)',
                overlaying: 'y',
                side: 'right',
                gridcolor: 'transparent',
                tickfont: { family: 'JetBrains Mono', size: 9.5 }
            }
        };

        Plotly.newPlot(container, [trace1, trace2], layout, { responsive: true, displayModeBar: false });
    }

    /**
     * 6. Benchmark 14 Models Pareto Frontier Chart (Feature 3: Tight Scaled Y-Axis & Frontier Curve)
     */
    function initParetoFrontierChart() {
        const container = document.getElementById('chart-pareto-frontier');
        if (!container) return;

        const th = getThemeLayout();

        // 14 Evaluated Models Data from Notebook
        const models = [
            { name: '#1 Boosted Hybrid (Ridge + GBRT)', rmse: 0.003100, lat: 4.2, fam: 'Two-Stage Hybrid', isKey: true, isChampion: true },
            { name: '#2 Huber-HAR-X (Robust)', rmse: 0.003087, lat: 209.4, fam: 'Robust Ekonometrika', isKey: false },
            { name: '#3 Stacking Ensemble (4 Models)', rmse: 0.003092, lat: 2796.7, fam: 'Ensemble Stacking', isKey: true },
            { name: '#4 Ridge-HAR-X (Regularized)', rmse: 0.003095, lat: 4.2, fam: 'Linear Ekonometrika', isKey: false },
            { name: '#5 Tuned CatBoost Regressor', rmse: 0.003123, lat: 697.9, fam: 'Modern GBDT', isKey: true },
            { name: '#6 Tuned XGBoost Regressor', rmse: 0.003126, lat: 138.0, fam: 'Modern GBDT', isKey: false },
            { name: '#7 Optuna Tuned LightGBM', rmse: 0.003143, lat: 1956.6, fam: 'Modern GBDT', isKey: false },
            { name: '#8 Meta-Ensemble (3-Model Blend)', rmse: 0.003190, lat: 656.5, fam: 'Linear Blending', isKey: false },
            { name: '#9 HAR-X Standard (OLS Macro)', rmse: 0.003250, lat: 5.4, fam: 'OLS Econometrics', isKey: false },
            { name: '#10 Random Forest Regressor', rmse: 0.003310, lat: 45.0, fam: 'Bagging Ensemble', isKey: false },
            { name: '#11 MLP Neural Network (Tanh)', rmse: 0.003380, lat: 1250.0, fam: 'Neural Network', isKey: false },
            { name: '#12 Corsi HAR-RV (Internal IHSG)', rmse: 0.003420, lat: 1.3, fam: 'Corsi (2009)', isKey: false },
            { name: '#13 RiskMetrics EWMA (λ=0.94)', rmse: 0.003650, lat: 0.5, fam: 'RiskMetrics Benchmark', isKey: false },
            { name: '#14 Naive Baseline (Historical 5D)', rmse: 0.004026, lat: 0.2, fam: 'Benchmark Naif', isKey: true, isNaive: true }
        ];

        // 1. Pareto Frontier Boundary Curve (Connecting Pareto Efficient Anchors)
        const frontierLine = {
            x: [0.2, 4.2, 209.4, 2796.7],
            y: [0.004026, 0.003100, 0.003087, 0.003092],
            mode: 'lines',
            type: 'scatter',
            name: 'Batas Efisiensi Pareto',
            line: {
                color: th.isDark ? '#00F0FF' : '#0052FF',
                width: 2,
                dash: 'dash'
            },
            hoverinfo: 'skip'
        };

        // 2. All 14 Model Scatter Points
        const otherModels = models.filter(m => !m.isChampion && !m.isNaive);
        const champion = models.find(m => m.isChampion);
        const naive = models.find(m => m.isNaive);

        const traceOthers = {
            x: otherModels.map(m => m.lat),
            y: otherModels.map(m => m.rmse),
            text: otherModels.map(m => m.name),
            customdata: otherModels.map(m => `${m.fam} | Latensi: ${m.lat} ms`),
            mode: 'markers',
            type: 'scatter',
            name: 'Model Regresi Benchmark (12 Model)',
            marker: {
                size: 9,
                color: otherModels.map(m => m.lat > 500 ? '#F59E0B' : (th.isDark ? '#64748B' : '#94A3B8')),
                line: { color: th.isDark ? '#040814' : '#FFFFFF', width: 1.5 }
            },
            hovertemplate: '<b>%{text}</b><br>Kategori: %{customdata}<br>Holdout RMSE: <b>%{y:.6f}</b><extra></extra>'
        };

        const traceChampion = {
            x: [champion.lat],
            y: [champion.rmse],
            text: ['★ #1 Champion: Boosted Hybrid (4.2 ms | RMSE 0.00310)'],
            mode: 'markers+text',
            type: 'scatter',
            name: 'Champion #1: Boosted Hybrid',
            textposition: 'top right',
            textfont: {
                family: 'Sora, sans-serif',
                size: 11,
                color: th.isDark ? '#00F0FF' : '#0052FF'
            },
            marker: {
                size: 18,
                color: '#00F0FF',
                symbol: 'diamond',
                line: { color: '#FFFFFF', width: 2.5 }
            },
            hovertemplate: '<b>CHAMPION: Boosted Hybrid</b><br>Latensi Inferensi: <b>4.2 ms (HFT-Ready)</b><br>Holdout RMSE: <b>0.003100</b><br>Reduksi Error: <b>-23.00%</b><extra></extra>'
        };

        const traceNaive = {
            x: [naive.lat],
            y: [naive.rmse],
            text: ['#14 Baseline Naif (0.2 ms | RMSE 0.00403)'],
            mode: 'markers+text',
            type: 'scatter',
            name: 'Baseline Naif Historis',
            textposition: 'bottom right',
            textfont: {
                family: 'Sora, sans-serif',
                size: 10,
                color: '#EF4444'
            },
            marker: {
                size: 13,
                color: '#EF4444',
                symbol: 'x',
                line: { color: '#EF4444', width: 3 }
            },
            hovertemplate: '<b>Naive Baseline 5D</b><br>Latensi: 0.2 ms<br>Holdout RMSE: 0.004026<extra></extra>'
        };

        const layout = {
            paper_bgcolor: th.paper_bgcolor,
            plot_bgcolor: th.plot_bgcolor,
            font: th.font,
            margin: { t: 30, r: 35, l: 65, b: 50 },
            legend: { orientation: 'h', y: 1.15, x: 0, font: { family: 'Sora', size: 10 } },
            xaxis: {
                title: 'Inference Latency dalam Milidetik (Skala Logaritmik)',
                type: 'log',
                range: [Math.log10(0.12), Math.log10(3800)],
                gridcolor: th.gridcolor,
                zerolinecolor: th.zerolinecolor,
                tickfont: { family: 'JetBrains Mono' }
            },
            yaxis: {
                title: 'Holdout RMSE (Semakin Rendah Semakin Presisi)',
                range: [0.0029, 0.0043],
                tickformat: '.4f',
                gridcolor: th.gridcolor,
                zerolinecolor: th.zerolinecolor,
                tickfont: { family: 'JetBrains Mono' }
            }
        };

        Plotly.newPlot(container, [frontierLine, traceOthers, traceNaive, traceChampion], layout, { responsive: true, displayModeBar: false });
    }

    /**
     * 7. Global SHAP Feature Importance Chart
     */
    function initShapChart() {
        const container = document.getElementById('chart-shap-importance');
        if (!container) return;

        const th = getThemeLayout();

        const features = [
            'RV_IHSG_5D (Autoregressive Short)',
            'VIX_Normalized (Market Fear)',
            'Rate_Spread (BI - Fed Rate)',
            'USDIDR_Shock (FX Pressure)',
            'Downside_SemiVol (Asymmetric Tail)',
            'SP500_Vol_5D (Global Spillover)',
            'Gold_Oil_Ratio (Safe Haven Bias)',
            'IHSG_Drawdown_20D (Market Stress)'
        ].reverse();

        const shapVals = [0.00108, 0.00094, 0.00078, 0.00065, 0.00054, 0.00042, 0.00031, 0.00024].reverse();

        const trace = {
            x: shapVals,
            y: features,
            type: 'bar',
            orientation: 'h',
            marker: {
                color: shapVals.map(v => v > 0.0007 ? '#00F0FF' : (th.isDark ? '#0052FF' : '#0284C7')),
                opacity: 0.9
            },
            hovertemplate: '<b>%{y}</b><br>Mean |SHAP| Impact: <b>%{x:.6f}</b><extra></extra>'
        };

        const layout = {
            paper_bgcolor: th.paper_bgcolor,
            plot_bgcolor: th.plot_bgcolor,
            font: th.font,
            margin: { t: 25, r: 25, l: 160, b: 40 },
            xaxis: {
                title: 'Mean Absolute SHAP Value (Impact on Volatility)',
                gridcolor: th.gridcolor,
                zerolinecolor: th.zerolinecolor,
                tickfont: { family: 'JetBrains Mono' }
            },
            yaxis: {
                tickfont: { family: 'JetBrains Mono', size: 9.5 }
            }
        };

        Plotly.newPlot(container, [trace], layout, { responsive: true, displayModeBar: false });
    }

    /**
     * 8. Dynamic Portfolio Allocation Donut Chart (Simulation)
     */
    function renderPortfolioDonut(eq, sbn, cash) {
        const container = document.getElementById('chart-portfolio-donut');
        if (!container) return;

        const th = getThemeLayout();

        const trace = {
            values: [eq, sbn, cash],
            labels: ['Saham Ekuitas IHSG', 'Surat Berharga Negara (SBN)', 'Kas Hedging & Pasar Uang'],
            type: 'pie',
            hole: 0.62,
            marker: {
                colors: ['#0052FF', '#10B981', '#F59E0B'],
                line: { color: th.isDark ? '#070E20' : '#FFFFFF', width: 2 }
            },
            textinfo: 'label+percent',
            textposition: 'inside',
            insidetextorientation: 'radial',
            textfont: { family: 'Sora, sans-serif', size: 9, color: '#FFFFFF' },
            hoverinfo: 'label+value+percent'
        };

        const layout = {
            paper_bgcolor: th.paper_bgcolor,
            plot_bgcolor: th.plot_bgcolor,
            font: th.font,
            margin: { t: 15, r: 15, l: 15, b: 15 },
            showlegend: false
        };

        Plotly.newPlot(container, [trace], layout, { responsive: true, displayModeBar: false });
    }

    /**
     * Re-renders all active charts when theme toggles or window resizes
     */
    function refreshAllCharts() {
        const chartIds = [
            'chart-forecast-2025-2026',
            'chart-multi-asset-comparison',
            'chart-volatility-clustering',
            'chart-feature-correlations',
            'chart-crisis-event-study',
            'chart-pareto-frontier',
            'chart-shap-importance',
            'chart-portfolio-donut'
        ];

        chartIds.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.data) {
                Plotly.Plots.resize(el);
            }
        });

        // Re-run initializers for active page
        const activePage = document.querySelector('.page-view.active');
        if (!activePage) return;

        const pid = activePage.id;
        if (pid === 'page-overview') {
            initForecastChart();
        } else if (pid === 'page-eda') {
            initMultiAssetChart();
            initVolatilityClusteringChart();
            initFeatureCorrelationChart();
            initCrisisEventChart();
        } else if (pid === 'page-model') {
            initParetoFrontierChart();
            initShapChart();
        }
    }

    // Auto-bind window resize listener with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            refreshAllCharts();
        }, 150);
    });

    return {
        initForecastChart,
        initMultiAssetChart,
        initVolatilityClusteringChart,
        initFeatureCorrelationChart,
        initCrisisEventChart,
        initParetoFrontierChart,
        initShapChart,
        renderPortfolioDonut,
        refreshAllCharts
    };

})();
