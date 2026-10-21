# INVESTION AEGIS — Quantitative Risk & Volatility Shield Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Theme: Dual-Mode](https://img.shields.io/badge/Theme-Light%20%26%20Dark-00F0FF.svg)](#)
[![Performance: 4.2ms](https://img.shields.io/badge/Inference-4.2ms-10B981.svg)](#)
[![Platform: Web%20SPA](https://img.shields.io/badge/Platform-Vanilla%20SPA%20Plotly-0052FF.svg)](#)

> **Institusi**: PT Investion Asset Management (AUM Rp 10 Triliun)  
> **Kompetisi**: INCEPTION 2026 National Data Science Competition (UPN "Veteran" Jawa Timur)  
> **Tim**: Positif Podium (Universitas Negeri Surabaya - UNESA)  
> **Anggota Tim**: Muhammad Habib Nur Aiman (Ketua) & Rizki Piji Fathoni (Anggota)  

---

## 1. Ikhtisar Platform

**INVESTION AEGIS** adalah Sistem Peringatan Dini (*Early Warning System*) berbasis Machine Learning dan ekonometrika Heterogeneous Autoregressive (HAR-X) yang dirancang untuk memprediksi **realized volatility IHSG untuk jendela 5 hari ke depan** (`Target_Volatilitas_Y`).

Platform ini dikembangkan khusus untuk membentengi portofolio institusi dana kelolaan **Rp 10 Triliun** dari guncangan likuiditas global, volatilitas kurs USD/IDR, disparitas suku bunga The Fed vs Bank Indonesia, serta fenomena *volatility clustering*.

---

## 2. Fitur Unggulan Dashboard

1. **Executive Cockpit (Overview)**:
   - Pantauan metrik kunci secara real-time melalui *running ticker bar*.
   - Animasi vektor interaktif **Aegis Shield** dengan sapuan radar 360°, pulsa telemetri, dan kurva tren *alpha*.
   - Grafik interaktif proyeksi volatilitas 359 hari bursa periode 2025–2026 lengkap dengan batas atas *Conformal Prediction* (90% & 95%) dan arsiran rezim *Markov-Switching*.
2. **Eksplorasi Data Forensik (EDA)**:
   - 7 sub-bab analisis komprehensif: integritas data, *volatility clustering*, uji stasioneritas ekonometrika ADF, timeline 8 guncangan makro historis, siklus Pemilu RI, *cross-asset spillover*, dan korelasi bergulir 60-hari.
   - Galeri visualisasi analitik beresolusi tinggi 300 DPI dengan modal *lightbox zoom*.
3. **Metodologi Riset & Anti-Kebocoran Waktu**:
   - Alur pipeline 5 tahap transparan.
   - 15 fitur turunan finansial berbasis 5 pilar makroekonomi terkemuka.
   - Validasi ketat *Purged Walk-Forward Time-Series Split (5-Fold)* dengan jeda *embargo gap* 5 hari.
   - Pembuktian kode *zero forward-looking bias*.
4. **Hasil Pemodelan & Explainable AI (XAI)**:
   - Papan peringkat 14 model regresi dengan kurva *Pareto Latency Frontier*.
   - Pembuktian keunggulan model Champion **Boosted Hybrid (Ridge-HAR-X + GBRT)** yang memangkas error baseline naif sebesar **-23.00%** dengan latensi hanya **4.2 ms**.
   - Suite transparansi XAI: SHAP Beeswarm global, kurva *Tipping Point* (VIX > 25, Spread < 1.0%), dan bedah krisis lokal (Waterfall Maret 2020).
5. **Simulator What-If & Alokasi Portofolio Dinamis**:
   - Penggeser interaktif parameter VIX global, depresiasi USD/IDR, dan spread suku bunga dengan kalkulasi prediksi instan.
   - Rekomendasi dinamis pembagian dana Rp 10 Triliun (Saham IHSG vs SBN vs Kas Hedging) yang memproyeksikan penurunan *maximum drawdown* dari **-34.8%** ke **-9.1%**.

---

## 3. Sistem Desain & Tipografi Khusus

Dashboard ini menggunakan sistem tipografi konsisten lintas-menu:
- **Judul Utama & Brand Display**: **`Syne`** (Bold & Avant-Garde).
- **Sub-Judul & Card Headers**: **`Sora`** (Presisi Geometris Fintech).
- **Narasi Utama / Body Copy**: **`DM Sans`** (Sangat Nyaman Dibaca).
- **Angka Tabular & Telemetri**: **`JetBrains Mono`** (Monospaced Data Precision).

Sistem warna dual-mode:
- **Light Mode**: Latar putih bersih (`#F8FAFC`), tipografi Navy pekat (`#0F172A`), aksen Royal Blue (`#0052FF`) dan Sky Azure (`#0284C7`).
- **Dark Mode**: Latar Obsidian Midnight (`#040814`), kartu Deep Vault (`#091024`), tipografi putih murni (`#F8FAFC`), aksen Neon Electric Cyan (`#00F0FF`).

---

## 4. Cara Menjalankan Secara Lokal

Aplikasi ini dibangun menggunakan arsitektur **Pure Web SPA** (Vanilla HTML5, CSS3, JavaScript, dan Plotly.js) tanpa ketergantungan *build step* yang berat.

### Menjalankan Langsung:
1. Buka berkas `index.html` langsung di browser modern apapun (Google Chrome, Edge, Safari, Firefox).
2. Atau gunakan ekstensi **Live Server** di VS Code.
3. Atau jalankan server lokal Python:
   ```bash
   python -m http.server 3000
   ```
   Lalu buka `http://localhost:3000` di peramban web Anda.

---

## 5. Lisensi & Hak Cipta

Dikembangkan oleh **Tim Positif Podium (UNESA)** untuk **PT Investion Asset Management** dalam rangka kompetisi **INCEPTION 2026**.  
Hak cipta dilindungi undang-undang.
