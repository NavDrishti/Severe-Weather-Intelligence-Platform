import React from 'react';
import { useLanguage } from '../../context/useLanguage';

interface BrandLogoProps {
  size?: number;
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 38, showSubtitle = true }) => {
  const { language } = useLanguage();

  return (
    <div className="brand-section">
      <svg
        className="brand-logo-svg"
        viewBox="0 0 100 100"
        style={{ width: size, height: size }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="NavDrishti AI Logo"
      >
        {/* Outer Shield / Horizon Arc - Pure Black base */}
        <circle cx="50" cy="50" r="46" fill="#000000" stroke="#059669" strokeWidth="2" />
        
        {/* Radar Range Rings */}
        <circle cx="50" cy="50" r="36" stroke="#2DD4BF" strokeWidth="1.5" strokeOpacity="0.4" />
        <circle cx="50" cy="50" r="24" stroke="#60A5FA" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="5 3" />
        <circle cx="50" cy="50" r="12" stroke="#38BDF8" strokeWidth="1.2" strokeOpacity="0.8" />
        
        {/* Radar Azimuth Crosshairs */}
        <line x1="50" y1="4" x2="50" y2="96" stroke="#2DD4BF" strokeWidth="1.2" strokeOpacity="0.35" />
        <line x1="4" y1="50" x2="96" y2="50" stroke="#2DD4BF" strokeWidth="1.2" strokeOpacity="0.35" />

        {/* Convective Iris / Eye Swirl (Drishti / Vision) */}
        <path
          d="M 50 20 C 66 20 80 35 80 50 C 80 66 66 80 50 80 C 34 80 20 66 20 50 C 20 40 25 32 32 26"
          stroke="#2DD4BF"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Active Convective Core Pinpoint */}
        <circle cx="50" cy="50" r="4.5" fill="#F87171" />
        <circle cx="50" cy="50" r="9" stroke="#F87171" strokeWidth="1.2" strokeOpacity="0.5" />
      </svg>
      <div className="brand-titles">
        <h1>{language === 'hi' ? 'नवदृष्टि AI' : 'NavDrishti AI'}</h1>
        {showSubtitle && (
          <p>{language === 'hi' ? 'तीव्र मौसम आसूचना मंच' : 'Severe Weather Intelligence Platform'}</p>
        )}
      </div>
    </div>
  );
};
