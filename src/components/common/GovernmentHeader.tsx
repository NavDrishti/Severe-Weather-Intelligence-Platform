import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import { useLanguage } from '../../context/useLanguage';
import { Sun, Moon, Languages } from 'lucide-react';

interface GovernmentHeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const GovernmentHeader: React.FC<GovernmentHeaderProps> = ({ theme, onToggleTheme }) => {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [istTime, setIstTime] = useState<string>('17:35:42 IST');
  const [istDate, setIstDate] = useState<string>('20 May 2025, Tuesday');

  // Real-time IST clock update respecting current language locale
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
      setIstDate(istDateObj.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  const navLinks = [
    { to: '/', label: t('nav.overview', 'Overview') },
    { to: '/dashboard', label: t('nav.dashboard', 'Dashboard') },
    { to: '/live-map', label: t('nav.liveMap', 'Live GIS Map') },
    { to: '/forecast', label: t('nav.forecast', 'Forecast') },
    { to: '/storms', label: t('nav.storms', 'Active Storms') },
    { to: '/alerts', label: t('nav.alerts', 'Alert Centre') },
    { to: '/locations', label: t('nav.locations', 'Locations') },
    { to: '/replay', label: t('nav.replay', 'Case Replay') },
    { to: '/analytics', label: t('nav.analytics', 'Verification') },
    { to: '/data-health', label: t('nav.dataHealth', 'Data Health') },
    { to: '/about', label: t('nav.about', 'Methodology') },
    { to: '/help', label: t('nav.help', 'Help & Safety') },
    { to: '/admin', label: t('nav.admin', 'Admin') }
  ];

  return (
    <header>
      {/* Official Government Information Ribbon - Pure Black */}
      <div className="top-gov-strip">
        <div className="emblem-tag">
          <span>🇮🇳 {t('header.govTitle', 'Government of India — Disaster Management Decision Support')}</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span>{t('header.sihTag', 'SIH PS 26084: Convective-Scale Nowcasting (0–6 hr)')}</span>
        </div>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <span>{t('header.releaseTag', 'Research & Prototype Release v1.4')}</span>
          <span style={{ opacity: 0.5 }}>|</span>
          {/* Interactive Language Selector */}
          <div className="language-toggle-pill" role="group" aria-label="Language selection">
            <Languages size={12} color="#94A3B8" style={{ marginLeft: '4px' }} />
            <button
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
              type="button"
              aria-label="Switch to English"
            >
              English
            </button>
            <button
              className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
              onClick={() => setLanguage('hi')}
              type="button"
              aria-label="हिन्दी में बदलें"
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* Main Operational Header Bar - Pure Black Command Deck */}
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
                <span className="title">{t('header.systemHealth', 'System Health')}</span>
                <span className="subtitle">{t('header.allOperational', 'All Systems Operational')}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Right: Theme Switcher & Actions */}
        <div className="header-right-actions">
          {/* Compact Quick Language Switcher */}
          <div className="language-toggle-pill" role="group" aria-label="Quick language toggle">
            <Languages size={13} color="#94A3B8" style={{ marginLeft: '4px' }} />
            <button
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
              type="button"
            >
              EN
            </button>
            <button
              className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
              onClick={() => setLanguage('hi')}
              type="button"
            >
              हिन्दी
            </button>
          </div>

          {/* Dark / Light Mode Switcher */}
          <div className="theme-switch-container">
            <Sun size={14} color={theme === 'light' ? '#F59E0B' : '#94A3B8'} />
            <span style={{ fontSize: 'var(--font-xs)', fontWeight: 500 }}>
              {theme === 'light' ? t('header.lightMode', 'Light Mode') : t('header.darkMode', 'Dark Mode')}
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

      {/* Global Green Navigation Menu Bar */}
      <nav className="global-nav-bar" aria-label="Main Navigation Menu">
        <div className="nav-links-bar">
          {navLinks.map((link) => {
            const isActive = link.to === '/'
              ? location.pathname === '/'
              : (location.pathname === link.to || location.pathname.startsWith(link.to + '/'));
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link-btn ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
