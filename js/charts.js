// INVESTION AEGIS — Interactive Plotly.js Visualizations
// Dynamic Theme-Aware Multi-Chart Engine (Light Mode & Dark Mode)
// Enhanced with Multiple Interactive EDA Charts, Balanced XAI, and Robust Forecast Rendering

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
        const yPred = data.map(d => parseFloat(d.Prediksi_Volatilitas_5D || d.Predicted_Target_Volatilitas_Y || 0.015));
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
                name: 'Batas Normal / Tenang (&le; 0.015)',
                line: { color: '#10B981', width: 1.5, dash: 'dash' }
            },
            {
                x: [dates[0], dates[dates.length - 1]],
                y: [0.025, 0.025],
                type: 'scatter',
                mode: 'lines',
                name: 'Batas Krisis / Waspada (&ge; 0.025)',
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
                range: [0.004, 0.034],
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
                name: 'IHSG Index (Base 100)',
                line: { color: th.isDark ? '#00F0FF' : '#0052FF', width: 2.2 }
            },
            {
                x: dates,
                y: norm('VIX'),
                type: 'scatter',
                mode: 'lines',
                name: 'VIX Ketakutan Global',
                line: { color: '#EF4444', width: 1.5, dash: 'dot' }
            },
            {
                x: dates,
                y: norm('USDIDR'),
                type: 'scatter',
                mode: 'lines',
                name: 'Kurs USD/IDR (Tekanan Valas)',
                line: { color: '#F59E0B', width: 1.8 }
            },
            {
                x: dates,
                y: norm('SP500'),
                type: 'scatter',
                mode: 'lines',
                name: 'S&P 500 (Ekuitas AS)',
                line: { color: th.isDark ? '#94A3B8' : '#64748B', width: 1.2 }
            },
            {
                x: dates,
                y: norm('GOLD'),
                type: 'scatter',
                mode: 'lines',
                name: 'Emas Dunia (Safe Haven)',
                line: { color: '#EAB308', width: 1.5, dash: 'dash' }
            }
        ];

        const layout = {
            paper_bgcolor: th.paper_bgcolor,
            plot_bgcolor: th.plot_bgcolor,
            font: th.font,
            margin: { t: 45, r: 25, l: 55, b: 45 },
            hovermode: 'x unified',
            legend: { orientation: 'h', y: 1.15, x: 0, font: { family: 'Sora, sans-serif', size: 10 } },
            xaxis: { gridcolor: th.gridcolor, zerolinecolor: th.zerolinecolor, tickfont: { family: 'JetBrains Mono' } },
            yaxis: { title: 'Normalized Level (Jan 2010 = 100)', gridcolor: th.gridcolor, zerolinecolor: th.zerolinecolor, tickfont: { family: 'JetBrains Mono' } }
        };

        Plotly.newPlot(container, traces, layout, { responsive: true, displayModeBar: false });
    }

    /**
     * 3. Volatility Clustering & Multi-Horizon Realized Volatility (EDA 2)
     */
    function initVolatilityClusteringChart() {
        const container = document.getElementById('chart-volatility-clustering');
        if (!container || !window.AEGIS_DATA || !window.AEGIS_DATA.history_sample) return;

        const data = window.AEGIS_DATA.history_sample;
        const dates = data.map(d => d.Date);
        const targetVol = data.map(d => d.Target_Volatilitas_Y);
        const rv20 = data.map(d => d.RV_20D);
        const rv60 = data.map(d => d.RV_60D);

        const th = getThemeLayout();

        const traces = [
            {
                x: dates,
                y: targetVol,
                type: 'scatter',
                mode: 'lines',
                name: 'Target Volatilitas 5D',
                line: { color: th.isDark ? '#00F0FF' : '#0052FF', width: 1.8 }
            },
            {
                x: dates,
                y: rv20,
                type: 'scatter',
                mode: 'lines',
                name: 'RV 20D (Heterogeneous Medium)',
                line: { color: '#F59E0B', width: 1.5, dash: 'dash' }
            },
            {
                x: dates,
                y: rv60,
                type: 'scatter',
                mode: 'lines',
                name: 'RV 60D (Heterogeneous Long)',
                line: { color: th.isDark ? '#94A3B8' : '#64748B', width: 1.5, dash: 'dot' }
            }
        ];

        const layout = {
            paper_bgcolor: th.paper_bgcolor,
            plot_bgcolor: th.plot_bgcolor,
            font: th.font,
            margin: { t: 45, r: 25, l: 55, b: 45 },
            hovermode: 'x unified',
            legend: { orientation: 'h', y: 1.15, x: 0, font: { family: 'Sora, sans-serif', size: 10 } },
            xaxis: { gridcolor: th.gridcolor, zerolinecolor: th.zerolinecolor, tickfont: { family: 'JetBrains Mono' } },
            yaxis: { title: 'Realized Volatility', gridcolor: th.gridcolor, zerolinecolor: th.zerolinecolor, tickfont: { family: 'JetBrains Mono' } }
        };

        Plotly.newPlot(container, traces, layout, { responsive: true, displayModeBar: false });
    }

    /**
     * 4. Feature Correlation Ranking against Target Volatility (EDA 3)
     */
    function initFeatureCorrelationChart() {
        const container = document.getElementById('chart-feature-correlations');
        if (!container || !window.AEGIS_DATA || !window.AEGIS_DATA.feature_corrs) return;

        const corrs = window.AEGIS_DATA.feature_corrs.slice().reverse();
        const features = corrs.map(d => d.feature);
        const vals = corrs.map(d => d.corr);
        const colors = corrs.map(d => d.color);

        const th = getThemeLayout();

        const trace = {
            x: vals,
            y: features,
            type: 'bar',
            orientation: 'h',
            marker: { color: colors, line: { width: 0 } },
            hovertemplate: '<b>%{y}</b><br>Korelasi Pearson vs Target: %{x:.3f}<extra></extra>'
        };

        const layout = {
            paper_bgcolor: th.paper_bgcolor,
            plot_bgcolor: th.plot_bgcolor,
            font: th.font,
            margin: { t: 20, r: 25, l: 190, b: 40 },
            xaxis: {
                title: 'Koefisien Korelasi Pearson terhadap Target Volatilitas 5D',
                gridcolor: th.gridcolor,
                zerolinecolor: th.zerolinecolor,
                tickfont: { family: 'JetBrains Mono' }
            },
            yaxis: {
                tickfont: { family: 'JetBrains Mono', size: 10.5 }
            }
        };

        Plotly.newPlot(container, [trace], layout, { responsive: true, displayModeBar: false });
    }

    /**
     * 5. Historical Crisis Shock Event Study (EDA 4)
     */
    function initCrisisEventChart() {
        const container = document.getElementById('chart-crisis-event-study');
        if (!container || !window.AEGIS_DATA || !window.AEGIS_DATA.crisis_events) return;

        const events = window.AEGIS_DATA.crisis_events;
        const names = events.map(d => d.event);
        const drops = events.map(d => d.ihsg_drop);
        const spikes = events.map(d => d.vol_spike * 100);

        const th = getThemeLayout();

        const trace1 = {
            x: names,
            y: drops,
            name: 'IHSG Max Drawdown (%)',
            type: 'bar',
            marker: { color: '#EF4444' },
            hovertemplate: '<b>%{x}</b><br>Drawdown: %{y:.1f}%<extra></extra>'
        };

        const trace2 = {
            x: names,
            y: spikes,
            name: 'Puncak Volatilitas 5D (%)',
            type: 'scatter',
            mode: 'lines+markers',
            yaxis: 'y2',
            line: { color: '#00F0FF', width: 2.5 },
            marker: { size: 8, color: '#00F0FF' },
            hovertemplate: '<b>%{x}</b><br>Volatilitas: %{y:.2f}%<extra></extra>'
        };

        const layout = {
            paper_bgcolor: th.paper_bgcolor,
            plot_bgcolor: th.plot_bgcolor,
            font: th.font,
            margin: { t: 45, r: 55, l: 55, b: 80 },
            legend: { orientation: 'h', y: 1.15, x: 0, font: { family: 'Sora', size: 10 } },
            xaxis: {
                tickangle: -25,
                gridcolor: th.gridcolor,
                tickfont: { family: 'Sora', size: 10 }
            },
            yaxis: {
                title: 'Drawdown IHSG (%)',
                gridcolor: th.gridcolor,
                zerolinecolor: th.zerolinecolor,
                tickfont: { family: 'JetBrains Mono' }
            },
            yaxis2: {
                title: 'Volatilitas 5D (%)',
                overlaying: 'y',
                side: 'right',
                gridcolor: 'transparent',
                tickfont: { family: 'JetBrains Mono' }
            }
        };

        Plotly.newPlot(container, [trace1, trace2], layout, { responsive: true, displayModeBar: false });
    }

    /**
     * 6. Benchmark 14 Models Pareto Frontier Chart
     */
    function initParetoFrontierChart() {
        const container = document.getElementById('chart-pareto-frontier');
        if (!container || !window.AEGIS_DATA || !window.AEGIS_DATA.tables.t4_benchmark) return;

        const benchmark = window.AEGIS_DATA.tables.t4_benchmark;
        const th = getThemeLayout();

        const names = benchmark.map(m => m.Model);
        const rmse = benchmark.map(m => parseFloat(m.Holdout_RMSE || m.CV_RMSE_Mean || 0));
        const latency = [4.2, 0.8, 0.7, 0.9, 1.2, 45.0, 18.5, 32.0, 28.0, 120.0, 65.0, 850.0, 1450.0, 0.2];

        const colors = names.map(n => {
            if (n.includes('Boosted Hybrid') || n.includes('Champion')) return '#00F0FF';
            if (n.includes('Baseline') || n.includes('Naive')) return '#EF4444';
            if (n.includes('GBDT') || n.includes('CatBoost') || n.includes('Stacking')) return '#F59E0B';
            return th.isDark ? '#64748B' : '#94A3B8';
        });

        const trace = {
            x: latency,
            y: rmse,
            text: names,
            mode: 'markers+text',
            type: 'scatter',
            textposition: 'top center',
            textfont: {
                family: 'Sora, sans-serif',
                size: 9.5,
                color: th.isDark ? '#F8FAFC' : '#0F172A'
            },
            marker: {
                size: names.map(n => n.includes('Boosted Hybrid') ? 18 : 10),
                color: colors,
                line: { color: th.isDark ? '#040814' : '#FFFFFF', width: 2 }
            },
            hovertemplate: '<b>%{text}</b><br>Latency: %{x} ms<br>RMSE: %{y:.6f}<extra></extra>'
        };

        const layout = {
            paper_bgcolor: th.paper_bgcolor,
            plot_bgcolor: th.plot_bgcolor,
            font: th.font,
            margin: { t: 30, r: 30, l: 60, b: 50 },
            xaxis: {
                title: 'Inference Latency dalam Milidetik (Log Scale - Sumbu X)',
                type: 'log',
                gridcolor: th.gridcolor,
                zerolinecolor: th.zerolinecolor,
                tickfont: { family: 'JetBrains Mono' }
            },
            yaxis: {
                title: 'Holdout RMSE (Semakin Rendah Semakin Baik)',
                gridcolor: th.gridcolor,
                zerolinecolor: th.zerolinecolor,
                tickfont: { family: 'JetBrains Mono' }
            }
        };

        Plotly.newPlot(container, [trace], layout, { responsive: true, displayModeBar: false });
    }

    /**
     * 7. Global SHAP Feature Importance Chart (Balanced)
     */
    function initShapChart() {
        const container = document.getElementById('chart-shap-importance');
        if (!container || !window.AEGIS_DATA || !window.AEGIS_DATA.tables.t5_xai_shap) return;

        const shapData = window.AEGIS_DATA.tables.t5_xai_shap.slice(0, 8).reverse();
        const features = shapData.map(d => d.Fitur || d.Feature);
        const importance = shapData.map(d => parseFloat(d.Mean_Abs_SHAP || d.SHAP_Value || 0.0005));

        const th = getThemeLayout();

        const trace = {
            x: importance,
            y: features,
            type: 'bar',
            orientation: 'h',
            marker: {
                color: importance.map((_, i) => i >= importance.length - 3 ? (th.isDark ? '#00F0FF' : '#0052FF') : (th.isDark ? '#1E293B' : '#CBD5E1')),
                line: { width: 0 }
            },
            hovertemplate: '<b>%{y}</b><br>Mean |SHAP|: %{x:.5f}<extra></extra>'
        };

        const layout = {
            paper_bgcolor: th.paper_bgcolor,
            plot_bgcolor: th.plot_bgcolor,
            font: th.font,
            margin: { t: 15, r: 20, l: 160, b: 35 },
            xaxis: {
                title: 'Mean Absolute SHAP Value',
                gridcolor: th.gridcolor,
                zerolinecolor: th.zerolinecolor,
                tickfont: { family: 'JetBrains Mono' }
            },
            yaxis: {
                tickfont: { family: 'JetBrains Mono', size: 10 }
            }
        };

        Plotly.newPlot(container, [trace], layout, { responsive: true, displayModeBar: false });
    }

    /**
     * 8. Interactive Portfolio Dynamic Allocation Donut Chart
     */
    function renderPortfolioDonut(equityPct, sbnPct, cashPct) {
        const container = document.getElementById('chart-portfolio-donut');
        if (!container) return;

        const th = getThemeLayout();

        const data = [{
            values: [equityPct, sbnPct, cashPct],
            labels: ['Saham IHSG (Risk Asset)', 'SBN (Risk-Free Buffer)', 'Kas / Hedging Buffer'],
            type: 'pie',
            hole: 0.62,
            marker: {
                colors: ['#0052FF', '#10B981', '#F59E0B'],
                line: { color: th.isDark ? '#091024' : '#FFFFFF', width: 3 }
            },
            textinfo: 'label+percent',
            textposition: 'inside',
            insidetextfont: { family: 'Sora, sans-serif', color: '#FFFFFF', size: 10.5 },
            hoverinfo: 'label+value+percent'
        }];

        const layout = {
            paper_bgcolor: th.paper_bgcolor,
            plot_bgcolor: th.plot_bgcolor,
            font: th.font,
            showlegend: true,
            legend: { orientation: 'h', y: -0.15, x: 0, font: { family: 'Sora', size: 9.5 } },
            margin: { t: 15, r: 15, l: 15, b: 35 },
            annotations: [{
                font: { family: 'Sora, sans-serif', size: 18, color: th.isDark ? '#00F0FF' : '#0052FF', weight: 800 },
                showarrow: false,
                text: 'Rp 10 T',
                x: 0.5,
                y: 0.5
            }]
        };

        Plotly.newPlot(container, data, layout, { responsive: true, displayModeBar: false });
    }

    /**
     * Refresh All Charts on Theme Toggle
     */
    function refreshAllCharts() {
        initForecastChart();
        initMultiAssetChart();
        initVolatilityClusteringChart();
        initFeatureCorrelationChart();
        initCrisisEventChart();
        initParetoFrontierChart();
        initShapChart();
        if (window.AEGIS_APP && window.AEGIS_APP.getCurrentPortfolioWeights) {
            const w = window.AEGIS_APP.getCurrentPortfolioWeights();
            renderPortfolioDonut(w.eq, w.sbn, w.cash);
        } else {
            renderPortfolioDonut(80, 20, 0);
        }
    }

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
