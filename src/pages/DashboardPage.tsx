import React, { useState, useEffect } from 'react';
import { FilterPanel } from '../components/dashboard/FilterPanel';
import { InteractiveGisMap } from '../components/map/InteractiveGisMap';
import { ForecastTimeline } from '../components/dashboard/ForecastTimeline';
import { HyperlocalPanel } from '../components/dashboard/HyperlocalPanel';
import { StormDetailDrawer } from '../components/storms/StormDetailDrawer';
import { StormCell, LocationCoordinates, ActiveFiltersState } from '../types/weather';
import { INITIAL_LOCATION, MOCK_STORMS, SEARCHABLE_LOCATIONS } from '../data/mockData';
import { fetchActiveStorms } from '../api/client';
import { Search, X, MapPin } from 'lucide-react';

interface DashboardPageProps {
  theme: 'light' | 'dark';
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ theme }) => {
  const [storms, setStorms] = useState<StormCell[]>(MOCK_STORMS);
  const [selectedStorm, setSelectedStorm] = useState<StormCell | null>(null);
  const [selectedHorizonIndex, setSelectedHorizonIndex] = useState<number>(0);
  const [currentLocation, setCurrentLocation] = useState<LocationCoordinates>(INITIAL_LOCATION);
  const [isLocationSearchOpen, setIsLocationSearchOpen] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');

  const [filters, setFilters] = useState<ActiveFiltersState>({
    hazard: 'all',
    risk: 'all',
    region: 'pune',
    sources: {
      radar: true,
      satellite: true,
      ground: true,
      lightning: true,
      nwp: true
    }
  });

  // Fetch initial storms from client API (falls back gracefully)
  useEffect(() => {
    fetchActiveStorms().then((data) => {
      if (data && data.length > 0) setStorms(data);
    });
  }, []);

  // Filter storms according to active pills
  const filteredStorms = storms.filter((storm) => {
    if (filters.hazard !== 'all') {
      if (!storm.hazard.toLowerCase().includes(filters.hazard)) return false;
    }
    if (filters.risk !== 'all') {
      const riskKey = filters.risk.replace('_', ' ').toLowerCase();
      if (!storm.severity.toLowerCase().includes(riskKey)) return false;
    }
    return true;
  });

  const filteredLocations = SEARCHABLE_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(locationSearchQuery.toLowerCase()) ||
    loc.state.toLowerCase().includes(locationSearchQuery.toLowerCase())
  );

  const handleSelectLocation = (loc: typeof SEARCHABLE_LOCATIONS[0]) => {
    setCurrentLocation({
      name: loc.name,
      state: loc.state,
      district: loc.district,
      lat: loc.lat,
      lon: loc.lon
    });
    setIsLocationSearchOpen(false);
    setLocationSearchQuery('');
  };

  return (
    <main className="dashboard-grid">
      {/* 1. Left Filters Column */}
      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        activeCount={12}
      />

      {/* 2. Center GIS Map & Forecast Timeline Column */}
      <div className="map-center-container">
        <InteractiveGisMap
          storms={filteredStorms}
          selectedStormId={selectedStorm?.id}
          onSelectStorm={(storm) => setSelectedStorm(storm)}
          userLocation={currentLocation}
          theme={theme}
        />

        {/* Bottom Horizon Timeline Slider */}
        <ForecastTimeline
          selectedHorizonIndex={selectedHorizonIndex}
          onSelectHorizon={(idx) => setSelectedHorizonIndex(idx)}
        />
      </div>

      {/* 3. Right Hyperlocal Intelligence Column */}
      <HyperlocalPanel
        location={currentLocation}
        onOpenLocationSearch={() => setIsLocationSearchOpen(true)}
        selectedHorizonIndex={selectedHorizonIndex}
      />

      {/* Storm Detail Drawer (When clicked on map) */}
      <StormDetailDrawer
        storm={selectedStorm}
        onClose={() => setSelectedStorm(null)}
      />

      {/* Location Search Modal */}
      {isLocationSearchOpen && (
        <div className="modal-overlay" onClick={() => setIsLocationSearchOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Search size={18} color="var(--brand-teal)" />
                <span>Search Location Forecast</span>
              </h3>
              <button onClick={() => setIsLocationSearchOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <input
              type="text"
              autoFocus
              placeholder="Search Indian city, district, or state (e.g. Pune, Mumbai, Cherrapunji, Delhi)..."
              value={locationSearchQuery}
              onChange={(e) => setLocationSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '280px', overflowY: 'auto' }}>
              {filteredLocations.map((loc) => (
                <div
                  key={loc.name}
                  onClick={() => handleSelectLocation(loc)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-subtle)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--brand-sky)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                >
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>{loc.name}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginLeft: '6px' }}>
                      ({loc.district}, {loc.state})
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: '3px',
                      background: loc.risk === 'Very High' ? '#EF4444' : (loc.risk === 'High' ? '#F59E0B' : '#10B981'),
                      color: '#FFFFFF'
                    }}
                  >
                    {loc.risk}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
