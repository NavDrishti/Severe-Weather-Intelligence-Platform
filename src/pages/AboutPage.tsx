import React from 'react';
import { AlertOctagon } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div style={{ padding: '24px 20px', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Title */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--brand-sky)', color: 'var(--brand-blue)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-xs)', fontWeight: 600 }}>
          Smart India Hackathon 2024–2025 • Problem Statement PS 26084
        </div>
        <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, marginTop: '8px' }}>
          About NavDrishti AI & Scientific Methodology
        </h1>
        <p style={{ fontSize: 'var(--font-base)', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Convective-scale nowcasting for Thunderstorms, Hail & Cloudbursts (0–6 hr)
        </p>
      </div>

      {/* System Architecture Section */}
      <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700 }}>11-Stage End-to-End System Architecture</h2>
        <p style={{ fontSize: 'var(--font-base)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          NavDrishti AI implements an automated, real-time pipeline harmonizing heterogeneous meteorological observation networks into a unified 1–3 km decision-support mosaic.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {[
            { step: '01', title: 'Data Ingestion', desc: 'Pull real-time Doppler radar (DWR), INSAT-3DS rapid scan, ground lightning (LIDEN), AWS, and NWP fields.' },
            { step: '02', title: 'Quality Control (QC)', desc: 'Ground clutter filtering, anomalous propagation removal, and strike outlier decontamination.' },
            { step: '03', title: 'Spatial Regridding', desc: 'Reprojection and spatial interpolation onto common 2.5 km operational nowcast grid.' },
            { step: '04', title: 'Feature Extraction', desc: 'Calculation of VIL, echo tops (18 dBZ/45 dBZ), cloud-top cooling rates, and lightning jumps.' },
            { step: '05', title: 'AI Model Inference', desc: 'Hybrid Spatiotemporal ConvLSTM + Multi-Head Attention neural architecture.' },
            { step: '06', title: 'Hazard Prediction', desc: 'Calibrated probabilistic estimates for lightning, hail severity, downburst wind, and cloudburst.' },
            { step: '07', title: 'Platt/Isotonic Calibration', desc: 'Alignment of predicted probabilities with observed historical frequencies to eliminate overconfidence.' },
            { step: '08', title: 'Cell Tracking (TITAN/SCIT)', desc: 'Polygon contouring, centroid displacement, propagation vector, and uncertainty corridor generation.' },
            { step: '09', title: 'Risk Intersection', desc: 'Cross-referencing storm corridor with district vulnerabilities and critical assets (airports, dams, power).' },
            { step: '10', title: 'Real-Time API & GIS', desc: 'Sub-second GeoJSON delivery, interactive Leaflet rendering, and WebSocket telemetry stream.' },
            { step: '11', title: 'Human Review Workflow', desc: 'Duty meteorologist audit trail for approving, suppressing, or escalating emergency advisories.' }
          ].map((st, i) => (
            <div key={i} style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', gap: '10px' }}>
              <span style={{ fontSize: 'var(--font-base)', fontWeight: 800, color: 'var(--brand-teal)', fontFamily: 'monospace' }}>
                {st.step}
              </span>
              <div>
                <strong style={{ fontSize: 'var(--font-sm)', display: 'block' }}>{st.title}</strong>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{st.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Limitations and What this system does NOT do */}
      <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, color: '#C53030', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertOctagon size={20} />
          <span>Operational Boundaries: What This System Does Not Do</span>
        </h2>
        <ul style={{ paddingLeft: '20px', fontSize: 'var(--font-base)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <li><strong>Not an Autonomous Replacement:</strong> NavDrishti AI is an AI-assisted decision-support platform, not an autonomous replacement for IMD, NCMRWF, disaster management authorities, or certified operational meteorologists.</li>
          <li><strong>No Guaranteed Prediction:</strong> Weather systems are chaotic. Convective nowcasts are probabilistic; deterministic certainty is physically impossible at 0–6 hour horizons.</li>
          <li><strong>No Nationwide Radar Uniformity:</strong> The common 1–3 km grid does not imply that Doppler radar coverage is uniform across India. Mountainous terrains in the Himalayas and Northeast rely more heavily on INSAT-3DS rapid scan and ground sensors.</li>
          <li><strong>No Exact Downburst Point Regression:</strong> Downburst gusts are given as likely intervals (e.g. 50–70 km/h) based on radial divergence and sounding profiles, not exact pinpoint point values.</li>
          <li><strong>Institutional Warning Authority:</strong> Public sirens, mobile cell broadcasts, and statutory evacuation orders remain under the sole jurisdiction of authorized disaster management authorities (NDMA/SDMA).</li>
        </ul>
      </section>

      {/* Team and Technology Stack */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '8px' }}>SIH Hackathon Team</h3>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong>Team NavDrishti AI</strong> • Smart India Hackathon PS 26084<br/>
            Engineered with deep focus on meteorological accuracy, operational robustness, and Indian disaster management needs.
          </p>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '8px' }}>Technology Stack</h3>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            • Frontend: React 18, TypeScript, Leaflet GIS, Vanilla CSS Design System<br/>
            • Backend: FastAPI (Python 3.13), Uvicorn, WebSockets<br/>
            • Database: PostgreSQL 16 + PostGIS spatial extension<br/>
            • ML Models: PyTorch, ONNX Runtime, Spatiotemporal ConvLSTM
          </p>
        </div>
      </section>
    </div>
  );
};
