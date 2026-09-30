import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, CloudHail, CloudRain, Wind } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div style={{ padding: '24px 20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'var(--brand-navy)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '48px 36px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '32px',
          alignItems: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(45, 212, 191, 0.15)', border: '1px solid rgba(45, 212, 191, 0.3)', padding: '5px 12px', borderRadius: 'var(--radius-full)', width: 'fit-content' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2DD4BF' }}></span>
            <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: '#2DD4BF' }}>
              Prototype | Research & Decision Support • SIH PS 26084
            </span>
          </div>

          <h1 style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            See severe weather earlier.
          </h1>

          <p style={{ fontSize: 'var(--font-md)', color: '#CBD5E1', lineHeight: 1.5, maxWidth: '580px' }}>
            AI-assisted, multi-source convective nowcasting for thunderstorms, hail, downbursts and cloudbursts across India. Designed for disaster authorities, infrastructure managers, and public safety teams.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '6px' }}>
            <Link
              to="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--brand-blue)',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: 'var(--font-base)',
                boxShadow: '0 4px 12px rgba(21, 94, 239, 0.35)'
              }}
            >
              <span>Open Live Dashboard</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/about"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                padding: '12px 22px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: 'var(--font-base)'
              }}
            >
              <span>Explore How It Works</span>
            </Link>
          </div>

          <div style={{ fontSize: 'var(--font-xs)', color: '#94A3B8', marginTop: '4px' }}>
            ▲ NavDrishti AI is a decision-support prototype. It does not replace official warnings issued by authorized government agencies.
          </div>
        </div>

        {/* Hero Visual / Radar Echo Graphic */}
        <div
          style={{
            background: '#091322',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
            aspectRatio: '16/11',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: '#94A3B8' }}>
            <span>DWR COMPOSITE • PUNE CORRIDOR</span>
            <span style={{ color: '#2DD4BF', fontWeight: 600 }}>LIVE SIMULATION</span>
          </div>

          <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
            <circle cx="150" cy="100" r="80" fill="none" stroke="#1E293B" strokeWidth="1" />
            <circle cx="150" cy="100" r="50" fill="none" stroke="#1E293B" strokeWidth="1" />
            <circle cx="150" cy="100" r="20" fill="none" stroke="#1E293B" strokeWidth="1" />
            {/* Convective Squall Line */}
            <path d="M 50,150 Q 120,80 200,90 T 260,60" fill="none" stroke="#2DD4BF" strokeWidth="16" opacity="0.4" strokeLinecap="round" />
            <path d="M 80,135 Q 140,85 190,95" fill="none" stroke="#EAB308" strokeWidth="10" opacity="0.7" strokeLinecap="round" />
            <path d="M 110,120 Q 150,90 175,98" fill="none" stroke="#EF4444" strokeWidth="6" opacity="0.9" strokeLinecap="round" />
            {/* Corridor */}
            <line x1="110" y1="120" x2="220" y2="40" stroke="#38BDF8" strokeWidth="2" strokeDasharray="5,4" />
            <circle cx="110" cy="120" r="4" fill="#EF4444" />
            <text x="120" y="125" fill="#FFFFFF" fontSize="10" fontFamily="sans-serif">NOW (58 dBZ)</text>
            <circle cx="160" cy="80" r="3" fill="#38BDF8" />
            <text x="170" y="85" fill="#38BDF8" fontSize="9" fontFamily="sans-serif">+30m ETA</text>
          </svg>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: '#CBD5E1' }}>
            <span>Grid: 2.5 km Common Mosaic</span>
            <span>Latency: 38s End-to-End</span>
          </div>
        </div>
      </section>

      {/* Hero Metrics Strip */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
        }}
      >
        {[
          { label: 'Forecast Horizon', val: '0–6 Hours', sub: 'Observation to NWP extension' },
          { label: 'Common Output Grid', val: '1–3 km Mosaic', sub: 'Harmonized spatial resolution' },
          { label: 'Core Data Streams', val: '5 Active Feeds', sub: 'Radar, Satellite, Lightning, AWS, NWP' },
          { label: 'Core Operational Metrics', val: 'Prob, ETA, Risk', sub: 'Calibrated probabilistic outputs' }
        ].map((m, i) => (
          <div
            key={i}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              {m.label}
            </div>
            <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--brand-teal)', marginTop: '4px' }}>
              {m.val}
            </div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {m.sub}
            </div>
          </div>
        ))}
      </section>

      {/* The Convective Forecasting Problem */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700 }}>The Convective Challenge in India</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: '#C53030', marginBottom: '8px' }}>
              Why Convective Storms are Difficult
            </h3>
            <p style={{ fontSize: 'var(--font-base)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Convective thunderstorms, hail storms, and cloudbursts form in less than 30–45 minutes with localized spatial scales under 5–15 km. Traditional NWP numerical models run on 6-hour cycles and miss explosive initiation, while simple persistence fails as cells split, merge, and dissipate rapidly.
            </p>
          </div>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--brand-teal)', marginBottom: '8px' }}>
              The NavDrishti AI Solution
            </h3>
            <p style={{ fontSize: 'var(--font-base)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              A hybrid multi-horizon architecture fusing ground Doppler Weather Radar, INSAT-3DS rapid-scan cloud cooling, ground lightning networks, and surface AWS stations to provide lead times of 30–90 minutes with storm arrival windows and hazard-specific probability estimates.
            </p>
          </div>
        </div>
      </section>

      {/* Hazard Modules */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700 }}>Hazard Intelligence Modules</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            {
              icon: <Zap size={22} color="#F87171" />,
              title: 'Lightning Nowcasting',
              desc: 'Detection of lightning flash jumps, cloud-to-ground strike clustering, and 15–60 min hazard corridors.'
            },
            {
              icon: <CloudHail size={22} color="#FBBF24" />,
              title: 'Hail Risk Scoring',
              desc: 'Evaluation of reflectivity aloft (>50 dBZ above freezing level) to classify hail severity buckets.'
            },
            {
              icon: <CloudRain size={22} color="#38BDF8" />,
              title: 'Cloudburst Warning',
              desc: 'Orographic convection identification tracking instantaneous rain-rates exceeding 100 mm/hr.'
            },
            {
              icon: <Wind size={22} color="#34D399" />,
              title: 'Downburst Potential',
              desc: 'Microburst divergence analysis combining radar radial shear with dry subcloud thermodynamic profiles.'
            }
          ].map((h, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div>{h.icon}</div>
              <h4 style={{ fontSize: 'var(--font-md)', fontWeight: 700 }}>{h.title}</h4>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Multi-Horizon Architecture */}
      <section
        style={{
          background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700 }}>Multi-Horizon Forecast Strategy</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', borderTop: '4px solid var(--brand-teal)' }}>
            <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--brand-teal)' }}>HORIZON A: 0–90 MINUTES</div>
            <h4 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginTop: '4px' }}>Observation-Dominant</h4>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Highest confidence. Driven by Doppler radar tracking, lightning pulse rates, and INSAT-3DS rapid cooling vectors.
            </p>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', borderTop: '4px solid #155EEF' }}>
            <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: '#155EEF' }}>HORIZON B: 90 MIN–3 HOURS</div>
            <h4 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginTop: '4px' }}>Multi-Source Fusion</h4>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Balanced regime fusing cell tracking with AWS surface moisture convergence and regional NWP wind steering fields.
            </p>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', borderTop: '4px solid #F59E0B' }}>
            <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: '#F59E0B' }}>HORIZON C: 3–6 HOURS</div>
            <h4 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginTop: '4px' }}>NWP-Assisted Extension</h4>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Visibly wider uncertainty bands and lower confidence. Blends convective initiation potential with NCMRWF model outputs.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section
        style={{
          textAlign: 'center',
          padding: '32px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 700 }}>Ready to Explore NavDrishti AI?</h3>
        <p style={{ fontSize: 'var(--font-base)', color: 'var(--text-secondary)', maxWidth: '600px' }}>
          Access the real-time operational dashboard, inspect storm tracks, scrub through forecast horizons, and review active alerts.
        </p>
        <Link
          to="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--brand-teal)',
            color: '#FFFFFF',
            padding: '12px 28px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: 'var(--font-base)'
          }}
        >
          <span>Launch Dashboard</span>
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
};
