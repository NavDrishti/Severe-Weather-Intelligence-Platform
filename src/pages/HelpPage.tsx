import React from 'react';
import { BookOpen, Zap, CloudRain, CloudHail, Wind } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const glossary = [
    { term: 'Nowcasting', def: 'Meteorological forecasting for the immediate zero-to-six-hour time horizon with high spatial and temporal resolution.' },
    { term: 'Convective Initiation (CI)', def: 'The birth of a thunderstorm where buoyant, moisture-rich air parcels breach the boundary layer inversion and accelerate vertically.' },
    { term: 'Doppler Weather Radar (DWR)', def: 'Active microwave ground station measuring radio wave reflectivity (dBZ) and radial wind velocity.' },
    { term: 'INSAT-3DS', def: 'Indian geostationary meteorological satellite by ISRO providing rapid-scan thermal infrared (TIR) and multi-channel sounder data.' },
    { term: 'Cloudburst', def: 'Extreme localized convective precipitation exceeding 100 mm per hour over a geographical area of approximately 20–30 km².' },
    { term: 'Downburst / Microburst', def: 'An intense localized column of sinking air (downdraft) that produces destructive straight-line winds at the surface exceeding 60–90 km/h.' },
    { term: 'Common Grid (2.5 km)', def: 'A standardized geospatial coordinate matrix onto which radar, satellite, lightning, and topography are regridded for fused model inference.' },
    { term: 'Forecast Horizon', def: 'The future time span of the prediction. In NavDrishti AI, segmented into 0–90m (Observation), 90m–3h (Fusion), and 3–6h (NWP-Assisted).' },
    { term: 'Human-in-the-Loop', def: 'Operational safety framework requiring certified meteorological personnel to audit, confirm, or suppress severe automated warning alerts.' }
  ];

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800 }}>Help Centre, Safety Guidance & Glossary</h1>
        <p style={{ fontSize: 'var(--font-base)', color: 'var(--text-secondary)' }}>
          Comprehensive guide for interpreting nowcasting indicators and taking immediate life-safety actions
        </p>
      </div>

      {/* Safety Instructions for Specific Hazards */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700 }}>Severe Weather Action Guidance</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {/* Lightning */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F87171', fontWeight: 700, fontSize: 'var(--font-md)' }}>
              <Zap size={18} />
              <span>During Lightning</span>
            </div>
            <ul style={{ paddingLeft: '18px', fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '10px' }}>
              <li><strong>Follow the 30-30 Rule:</strong> If time between flash and thunder is &lt; 30 seconds, seek immediate shelter. Stay inside 30 minutes after last thunder.</li>
              <li>Avoid open fields, isolated trees, hilltop crests, and metal fences.</li>
              <li>If trapped in open, crouch on balls of your feet with heels touching; do not lie flat on ground.</li>
            </ul>
          </div>

          {/* Cloudburst */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38BDF8', fontWeight: 700, fontSize: 'var(--font-md)' }}>
              <CloudRain size={18} />
              <span>During Cloudburst / Extreme Rain</span>
            </div>
            <ul style={{ paddingLeft: '18px', fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '10px' }}>
              <li>Move immediately to higher ground away from mountain streams, ravines, and drainage channels.</li>
              <li>Do not drive or walk through moving floodwater. 15 cm of fast water can knock down an adult.</li>
              <li>Monitor local disaster management broadcasts for flash flood spillway advisories.</li>
            </ul>
          </div>

          {/* Hail */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FBBF24', fontWeight: 700, fontSize: 'var(--font-md)' }}>
              <CloudHail size={18} />
              <span>During Hailstorm</span>
            </div>
            <ul style={{ paddingLeft: '18px', fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '10px' }}>
              <li>Stay indoors away from skylights, glass windows, and fragile roofs.</li>
              <li>Park vehicles inside garages or cover windshields with blankets.</li>
              <li>Protect livestock and agricultural greenhouses where advance warnings permit.</li>
            </ul>
          </div>

          {/* Downburst */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34D399', fontWeight: 700, fontSize: 'var(--font-md)' }}>
              <Wind size={18} />
              <span>During Downburst & Squalls</span>
            </div>
            <ul style={{ paddingLeft: '18px', fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '10px' }}>
              <li>Halt construction crane operations and secure high-rise scaffolding.</li>
              <li>Beware of falling tree branches, loose tin sheets, and advertising hoardings.</li>
              <li>Aviation personnel should prepare for sudden low-level wind shear.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Meteorological Glossary */}
      <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
        <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={20} color="var(--brand-teal)" />
          <span>Meteorological Glossary & Concepts</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
          {glossary.map((g, i) => (
            <div key={i} style={{ background: 'var(--bg-subtle)', padding: '12px 14px', borderRadius: 'var(--radius-sm)' }}>
              <strong style={{ fontSize: 'var(--font-base)', color: 'var(--text-primary)', display: 'block' }}>
                {g.term}
              </strong>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: '4px', display: 'block' }}>
                {g.def}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700 }}>Frequently Asked Questions (FAQ)</h2>
        {[
          { q: 'How does NavDrishti AI calculate storm arrival time (ETA)?', a: 'ETA is derived from the TITAN/SCIT cell tracking algorithm which isolates radar reflectivity centroid displacement over successive 10-minute scans and projects motion vectors with an expanding uncertainty envelope.' },
          { q: 'Why does confidence decrease after 90 minutes?', a: 'Convective storm cells are subject to nonlinear dynamics such as cold pool collisions, dry air entrainment, and orographic interaction. Beyond 90 minutes, simple physical tracking transitions to NWP-assisted fusion which carries inherently wider uncertainty.' },
          { q: 'Is this system an official IMD warning portal?', a: 'No. NavDrishti AI is an AI-assisted decision-support prototype built for SIH Problem Statement PS 26084. Statutory disaster declarations remain the prerogative of IMD, NDMA, and state disaster management authorities.' }
        ].map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h4 style={{ fontSize: 'var(--font-base)', fontWeight: 700, color: 'var(--text-primary)' }}>{faq.q}</h4>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>{faq.a}</p>
          </div>
        ))}
      </section>
    </div>
  );
};
