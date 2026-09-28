# NAVDRISHTI AI

> **“Hyperlocal Convective Weather Intelligence for Safer Decisions”**  
> **Smart India Hackathon (SIH) — Problem Statement PS 26084:** *Convective-scale nowcasting for Thunderstorms, Hail & Cloudbursts (0–6 hr)*

---

## 1. Product Overview

**NavDrishti AI** is a government-grade, operational decision-support weather intelligence platform for India. It bridges the critical 0–6 hour gap where traditional global/regional NWP models miss rapid convective initiation and local orographic amplification.

By fusing:
1. **IMD Doppler Weather Radar (DWR)** multi-elevation reflectivity (dBZ) & radial velocity dipoles
2. **ISRO / MOSDAC INSAT-3DS** rapid-scan thermal infrared (TIR-1) cloud-top cooling rates
3. **Ground Lightning Detection Networks (LIDEN / IITM)** strike clustering & flash jumps
4. **Surface AWS / ARG** telemetry (moisture convergence, pressure surges, gust fronts)
5. **NCMRWF NCUM / WRF** high-resolution convective-permitting model fields

NavDrishti AI generates calibrated, probabilistic nowcasts, automated TITAN/SCIT storm tracking corridors, estimated times of arrival (ETA), and exposure assessments for vulnerable districts and critical national infrastructure.

---

## 2. Multi-Horizon Operational Architecture

| Horizon Regime | Dominant Data Feeds | Methodological Approach | Confidence Profile |
| :--- | :--- | :--- | :--- |
| **0–90 Minutes** | Doppler Radar, Lightning LIDEN, INSAT-3DS rapid scan | Observation-Dominant Physical Extrapolation & Neural Tracking | **Highest Confidence** (Calibrated ~87–93%) |
| **90 Min – 3 Hours** | Radar composites, INSAT, AWS Surface convergence, NWP steering | Multi-Source Spatiotemporal Fusion (ConvLSTM + Attention) | **Moderate Confidence** (~72–82%) |
| **3–6 Hours** | Regional NWP (NCUM/WRF), Environmental CAPE/CIN/Shear | NWP-Assisted Extension with Convective Initiation Probability | **Wider Uncertainty Envelope** (~50–68%) |

---

## 3. Key Modules & Features

- **Operational GIS Dashboard (`/dashboard`)**: Pixel-perfect implementation mirroring operational meteorology command centres with live IST clock, system health, filter pills, interactive Leaflet/Canvas convective radar composite, dashed forecast tracks, floating ETA badges, and bottom 0–6h horizon timeline slider.
- **Full-Screen GIS Map (`/live-map`)**: Interactive multi-layer GIS with customizable layer opacities, isochrones, base maps (Carto Dark, Positron Light), and storm detail popups.
- **Detailed Forecast Explorer (`/forecast`)**: Probability curves over time, rainfall intensity estimates, lightning density, uncertainty envelopes, and CSV export.
- **Active Storm Registry (`/storms` & `/storms/:stormId`)**: Comprehensive catalog of active convective clusters with tracking corridors, growth/decay status, and critical asset exposure (airports, dams, power grids).
- **Human-in-the-Loop Alert Centre (`/alerts`)**: Dedicated workflow for duty meteorologists to approve, suppress, escalate, or record audit justifications for public advisories.
- **Hyperlocal Location Search (`/locations`)**: Search any Indian city or district to receive immediate 0–6h step-by-step risk breakdowns.
- **Historical Event Replay (`/replay`)**: Interactive replay player featuring real Indian historical convective events (Pune squall, Amarnath cloudburst, Delhi downburst, Kalbaishakhi).
- **Scientific Verification Analytics (`/analytics`)**: Formal meteorological verification metrics (POD, FAR, CSI/Threat Score, Brier calibration, MAE) compared against baselines (Persistence, Optical Flow, PySTEPS, ConvLSTM).
- **Data Source Health Telemetry (`/data-health`)**: Ingestion latency monitor, cadence tracking, quality scores, and automated degraded-mode fallbacks.
- **Admin Configuration (`/admin`)**: Operational data mode switcher (Demo, Replay, Live), sensor threshold controls, and simulated anomaly triggers.

---

## 4. Technology Stack

- **Frontend**: React 18, TypeScript, Leaflet GIS, Lucide Icons, Vanilla CSS Design System with dark/light themes.
- **Backend**: FastAPI (Python 3.13), Uvicorn, Pydantic v2, WebSockets for live telemetry.
- **Database**: PostgreSQL 16 with PostGIS spatial extension (`database/schema.sql` with all 22 required tables).
- **Architecture & Infrastructure**: Docker multi-stage build, Docker Compose with PostGIS and Redis.

---

## 5. Quickstart & Local Execution

### Prerequisites
- Node.js 18+ (tested on Node v22)
- Python 3.10+ (tested on Python 3.13)

### Running Backend (FastAPI)
```bash
# From workspace root
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```
Backend API will be available at: `http://localhost:8000`  
Interactive Swagger docs: `http://localhost:8000/docs`

### Running Frontend (Vite)
```bash
# From workspace root
npm install
npm run dev
```
Frontend application will be available at: `http://localhost:5173`

### Running Test Suite
```bash
# Run backend pytest suite
python -m pytest backend/tests/test_api.py -v

# Run frontend build & typecheck
npm run build
```

---

## 6. Official Disclaimer & Responsible AI Notice

> **Important Operational Notice:**  
> NavDrishti AI is an AI-assisted research and decision-support prototype developed for Smart India Hackathon PS 26084. Forecasts are probabilistic and subject to physical meteorological uncertainty. In case of imminent severe weather, always prioritize statutory warnings, sirens, and instructions issued by authorized government agencies including the **India Meteorological Department (IMD)**, **National Disaster Management Authority (NDMA)**, and respective **State Disaster Management Authorities (SDMA)**.
