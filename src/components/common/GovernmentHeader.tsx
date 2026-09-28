import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import { Sun, Moon, ShieldAlert, Activity, HelpCircle, Settings } from 'lucide-react';

interface GovernmentHeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const GovernmentHeader: React.FC<GovernmentHeaderProps> = ({ theme, onToggleTheme }) => {
  const location = useLocation();
  const [istTime, setIstTime] = useState<string>('17:35:42 IST');
  const [istDate, setIstDate] = useState<string>('20 May 2025, Tuesday');

  // Real-time IST clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // IST is UTC + 5:30
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const istDateObj = new Date(utcTime + 3600000 * 5.5);

      const hours = String(istDateObj.getHours()).padStart(2, '0');
      const minutes = String(istDateObj.getMinutes()).padStart(2, '0');
      const seconds = String(istDateObj.getSeconds()).padStart(2, '0');
      setIstTime(`${hours}:${minutes}:${seconds} IST`);

      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        weekday: 'long'
      };
      setIstDate(istDateObj.toLocaleDateString('en-IN', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { to: '/', label: 'Overview' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/live-map', label: 'Live GIS Map' },
    { to: '/forecast', label: 'Forecast' },
    { to: '/storms', label: 'Active Storms' },
    { to: '/alerts', label: 'Alert Centre' },
    { to: '/locations', label: 'Locations' },
    { to: '/replay', label: 'Case Replay' },
    { to: '/analytics', label: 'Verification' },
    { to: '/data-health', label: 'Data Health' },
    { to: '/about', label: 'Methodology' },
    { to: '/help', label: 'Help & Safety' },
    { to: '/admin', label: 'Admin' }
  ];

  return (
    <header>
      {/* Official Government Information Ribbon */}
      <div className="top-gov-strip">
        <div className="emblem-tag">
          <span>🇮🇳 Government of India — Disaster Management Decision Support</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span>SIH PS 26084: Convective-Scale Nowcasting (0–6 hr)</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span>Research & Prototype Release v1.4</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ cursor: 'pointer' }}>हिंदी (Hindi)</span>
        </div>
      </div>

      {/* Main Operational Header Bar */}
      <div className="official-header">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <BrandLogo />
        </Link>

        {/* Center: Live IST Clock & Health Telemetry */}
        <div className="header-center-telemetry">
          <div className="live-ist-clock" title="Indian Standard Time (UTC+5:30)">
            <div className="time-digits">{istTime}</div>
            <div className="date-string">{istDate}</div>
          </div>

          <Link to="/data-health" style={{ textDecoration: 'none' }}>
            <div className="system-health-pill" title="Click to view sensor data health">
              <span className="dot" />
              <div className="label-group">
                <span className="title">System Health</span>
                <span className="subtitle">All Systems Operational</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Right: Theme Switcher & Actions */}
        <div className="header-right-actions">
          <div className="theme-switch-container">
            <Sun size={14} color={theme === 'light' ? '#F59E0B' : '#94A3B8'} />
            <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>
              {theme === 'light' ? 'Light' : 'Dark'} Mode
            </span>
            <div
              className={`switch-track ${theme === 'dark' ? 'active-dark' : ''}`}
              onClick={onToggleTheme}
              role="button"
              tabIndex={0}
              aria-label="Toggle dark/light mode"
              onKeyDown={(e) => e.key === 'Enter' && onToggleTheme()}
            >
              <div className="switch-thumb" />
            </div>
            <Moon size={14} color={theme === 'dark' ? '#60A5FA' : '#94A3B8'} />
          </div>
        </div>
      </div>

      {/* Global Navigation Bar */}
      <nav
        style={{
          backgroundColor: 'var(--brand-navy)',
          padding: '4px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          overflowX: 'auto'
        }}
      >
        <div className="nav-links-bar">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link-btn ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};
