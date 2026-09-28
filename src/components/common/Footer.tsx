import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
        <Link to="/about">About & Methodology</Link>
        <Link to="/help">Safety & FAQ</Link>
        <Link to="/data-health">Data Provenance</Link>
        <Link to="/analytics">Model Verification</Link>
        <Link to="/alerts">Emergency Protocols</Link>
      </div>
      <div>
        <strong>NavDrishti AI</strong> • Smart India Hackathon Project (Problem Statement PS 26084: Convective-Scale Nowcasting for Thunderstorms, Hail & Cloudbursts 0–6 hr)
      </div>
      <div style={{ opacity: 0.75, maxWidth: '800px', margin: '0 auto' }}>
        Notice: NavDrishti AI is an AI-assisted research and decision-support prototype. Data ingested from radar, INSAT-3DS, lightning networks, and NWP is fused for situational awareness. In case of imminent severe weather, prioritize official warnings released by the India Meteorological Department (IMD) and State Disaster Management Authorities (SDMA).
      </div>
    </footer>
  );
};
