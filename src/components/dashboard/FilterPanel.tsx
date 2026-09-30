import React, { useState } from 'react';
import { HazardType, RiskLevel, RegionKey, DataSourceKey, ActiveFiltersState } from '../../types/weather';
import { Filter, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  filters: ActiveFiltersState;
  onFilterChange: (newFilters: ActiveFiltersState) => void;
  activeCount?: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, activeCount = 12 }) => {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  const setHazard = (hazard: HazardType) => {
    onFilterChange({ ...filters, hazard });
  };

  const setRisk = (risk: RiskLevel) => {
    onFilterChange({ ...filters, risk });
  };

  const setRegion = (region: RegionKey) => {
    onFilterChange({ ...filters, region });
  };

  const toggleSource = (source: DataSourceKey) => {
    onFilterChange({
      ...filters,
      sources: {
        ...filters.sources,
        [source]: !filters.sources[source]
      }
    });
  };

  const resetFilters = () => {
    onFilterChange({
      hazard: 'all',
      risk: 'all',
      region: 'maharashtra',
      sources: {
        radar: true,
        satellite: true,
        ground: true,
        lightning: true,
        nwp: true
      }
    });
  };

  return (
    <div className="filter-panel-card" role="region" aria-label="Filters">
      <h3>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={16} /> Filters
        </span>
        <button
          onClick={resetFilters}
          style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}
          title="Reset to default filters"
        >
          <RotateCcw size={12} /> Reset
        </button>
      </h3>

      {/* Hazard Type */}
      <div className="filter-group">
        <span className="filter-group-label">Hazard Type</span>
        <div className="filter-pill-grid">
          {[
            { id: 'all', label: 'All Hazards' },
            { id: 'lightning', label: 'Lightning' },
            { id: 'cloudburst', label: 'Cloudburst' },
            { id: 'hail', label: 'Hail' },
            { id: 'downburst', label: 'Downburst' }
          ].map((item) => (
            <button
              key={item.id}
              className={`filter-pill ${filters.hazard === item.id ? 'active' : ''}`}
              onClick={() => setHazard(item.id as HazardType)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Risk Level */}
      <div className="filter-group">
        <span className="filter-group-label">Risk Level</span>
        <div className="filter-pill-grid">
          {[
            { id: 'all', label: 'All Levels' },
            { id: 'very_high', label: 'Very High' },
            { id: 'high', label: 'High' },
            { id: 'medium', label: 'Medium' },
            { id: 'low', label: 'Low' }
          ].map((item) => (
            <button
              key={item.id}
              className={`filter-pill ${filters.risk === item.id ? 'active' : ''}`}
              onClick={() => setRisk(item.id as RiskLevel)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Region */}
      <div className="filter-group">
        <span className="filter-group-label">Region</span>
        <div className="filter-pill-grid">
          {[
            { id: 'pune', label: 'Pune' },
            { id: 'maharashtra', label: 'Maharashtra' },
            { id: 'west_central', label: 'West/Central India' },
            { id: 'entire_country', label: 'Entire Country' }
          ].map((item) => (
            <button
              key={item.id}
              className={`filter-pill ${filters.region === item.id ? 'active' : ''}`}
              onClick={() => setRegion(item.id as RegionKey)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data Source */}
      <div className="filter-group">
        <span className="filter-group-label">Data Source</span>
        <div className="filter-pill-grid">
          {[
            { key: 'radar', label: 'Radar' },
            { key: 'satellite', label: 'Satellite' },
            { key: 'ground', label: 'Ground Sensors' },
            { key: 'lightning', label: 'Lightning Network' },
            { key: 'nwp', label: 'Numerical Models' }
          ].map((src) => (
            <button
              key={src.key}
              className={`filter-pill ${filters.sources[src.key as DataSourceKey] ? 'active' : ''}`}
              onClick={() => toggleSource(src.key as DataSourceKey)}
            >
              {src.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary Drawer */}
      <div>
        <button
          className="active-filters-summary-btn"
          onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
          aria-expanded={isSummaryExpanded}
        >
          <span>Active Filters ({activeCount})</span>
          {isSummaryExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {isSummaryExpanded && (
          <div
            style={{
              padding: '10px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              marginTop: '6px',
              fontSize: 'var(--font-xs)',
              color: 'var(--text-secondary)',
              lineHeight: 1.5
            }}
          >
            <div>• Current hazard filter: <strong>{filters.hazard.toUpperCase()}</strong></div>
            <div>• Risk threshold: <strong>{filters.risk.replace('_', ' ').toUpperCase()}</strong></div>
            <div>• Spatial focus: <strong>{filters.region.replace('_', ' ').toUpperCase()}</strong></div>
            <div>
              • Active feeds:{' '}
              {Object.entries(filters.sources)
                .filter(([, v]) => v)
                .map(([k]) => k)
                .join(', ')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
