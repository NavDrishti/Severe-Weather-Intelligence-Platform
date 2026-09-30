import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { GovernmentHeader } from './components/common/GovernmentHeader';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { Footer } from './components/common/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMapPage } from './pages/LiveMapPage';
import { ForecastPage } from './pages/ForecastPage';
import { StormsPage } from './pages/StormsPage';
import { StormDetailPage } from './pages/StormDetailPage';
import { AlertsPage } from './pages/AlertsPage';
import { LocationsPage } from './pages/LocationsPage';
import { ReplayPage } from './pages/ReplayPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DataHealthPage } from './pages/DataHealthPage';
import { AboutPage } from './pages/AboutPage';
import { HelpPage } from './pages/HelpPage';
import { AdminPage } from './pages/AdminPage';

export const App: React.FC = () => {
  // Default to dark theme to match operational command center screenshot
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('navdrishti-theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('navdrishti-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <BrowserRouter>
      <LanguageProvider>
        <div className="app-container">
          {/* Government Top Strip and Header */}
          <GovernmentHeader theme={theme} onToggleTheme={toggleTheme} />

          {/* Operational Disclaimer Banner */}
          <DisclaimerBanner />

          {/* Route Pages */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage theme={theme} />} />
            <Route path="/live-map" element={<LiveMapPage theme={theme} />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/storms" element={<StormsPage />} />
            <Route path="/storms/:stormId" element={<StormDetailPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/replay" element={<ReplayPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/data-health" element={<DataHealthPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/admin" element={<AdminPage />} />
            {/* Catch-all redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          {/* Footer */}
          <Footer />
        </div>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
