import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { StormCell, LocationCoordinates } from '../../types/weather';
import { fetchLiveRadarTileUrl } from '../../services/weatherService';
import { Layers, ZoomIn, ZoomOut, Compass, RotateCcw, Maximize, AlertTriangle } from 'lucide-react';

interface InteractiveGisMapProps {
  storms: StormCell[];
  selectedStormId?: string;
  onSelectStorm: (storm: StormCell) => void;
  userLocation: LocationCoordinates;
  theme: 'light' | 'dark';
}

export const InteractiveGisMap: React.FC<InteractiveGisMapProps> = ({
  storms,
  selectedStormId,
  onSelectStorm,
  userLocation,
  theme
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const labelsTileLayerRef = useRef<L.TileLayer | null>(null);
  const radarTileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeBaseMap, setActiveBaseMap] = useState<'dark' | 'light' | 'satellite'>('dark');
  const [showLayersMenu, setShowLayersMenu] = useState(false);
  const [layersVisibility, setLayersVisibility] = useState({
    radarReflectivity: true,
    stormTracks: true,
    lightningStrikes: true,
    hailZones: true,
    etaLabels: true,
    districtBoundaries: true
  });

  const getBaseMapUrls = (type: 'dark' | 'light' | 'satellite', currentTheme: 'light' | 'dark') => {
    if (type === 'satellite') {
      return {
        base: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        labels: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        subdomains: ''
      };
    }
    if (type === 'light' || currentTheme === 'light') {
      return {
        base: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        labels: null,
        subdomains: 'abc'
      };
    }
    // Default Dark: ESRI Dark Gray Canvas (Clean, zero watermarks, 100% free)
    return {
      base: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      labels: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
      subdomains: ''
    };
  };

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered over Maharashtra / Pune region (lat: 18.8, lon: 74.2) with zoom 7.2
    const map = L.map(mapContainerRef.current, {
      center: [18.85, 74.15],
      zoom: 7,
      zoomControl: false,
      attributionControl: false
    });

    const config = getBaseMapUrls(activeBaseMap, theme);

    const tileLayer = L.tileLayer(config.base, {
      maxZoom: 19,
      subdomains: config.subdomains || 'abc'
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    if (config.labels) {
      const labelsLayer = L.tileLayer(config.labels, {
        maxZoom: 19,
        zIndex: 350
      }).addTo(map);
      labelsTileLayerRef.current = labelsLayer;
    }

    // Layer group for all dynamic overlays
    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update base tiles on theme or activeBaseMap change
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const map = mapInstanceRef.current;
    const config = getBaseMapUrls(activeBaseMap, theme);

    tileLayerRef.current.setUrl(config.base);

    if (config.labels) {
      if (labelsTileLayerRef.current) {
        labelsTileLayerRef.current.setUrl(config.labels);
      } else {
        const labelsLayer = L.tileLayer(config.labels, {
          maxZoom: 19,
          zIndex: 350
        }).addTo(map);
        labelsTileLayerRef.current = labelsLayer;
      }
    } else {
      if (labelsTileLayerRef.current) {
        labelsTileLayerRef.current.remove();
        labelsTileLayerRef.current = null;
      }
    }
  }, [theme, activeBaseMap]);


  // Sync real-time RainViewer Doppler radar tiles
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (layersVisibility.radarReflectivity) {
      fetchLiveRadarTileUrl().then((tileUrl) => {
        if (!tileUrl || !mapInstanceRef.current) return;
        if (radarTileLayerRef.current) {
          radarTileLayerRef.current.setUrl(tileUrl);
        } else {
          const radarLayer = L.tileLayer(tileUrl, {
            opacity: 0.60,
            maxZoom: 18,
            zIndex: 400
          }).addTo(map);
          radarTileLayerRef.current = radarLayer;
        }
      });
    } else {
      if (radarTileLayerRef.current) {
        radarTileLayerRef.current.remove();
        radarTileLayerRef.current = null;
      }
    }
  }, [layersVisibility.radarReflectivity]);

  // Render radar echoes, corridors, lightning, and ETA markers
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    // 1. User Location Pinpoint
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="display:flex; flex-direction:column; align-items:center;">
          <div style="background:#155EEF; border:2px solid #FFFFFF; width:12px; height:12px; border-radius:50%; box-shadow:0 0 10px #155EEF;"></div>
          <span style="font-size:10px; font-weight:700; color:#FFFFFF; background:rgba(18,48,74,0.85); padding:1px 5px; border-radius:3px; margin-top:2px; white-space:nowrap;">
            ${userLocation.name} (Nowcast Point)
          </span>
        </div>
      `,
      iconSize: [80, 30],
      iconAnchor: [40, 6]
    });
    L.marker([userLocation.lat, userLocation.lon], { icon: userIcon }).addTo(layerGroup);

    // 2. Render Convective Radar Reflectivity Polygons & Storm Corridor
    storms.forEach((storm) => {
      const isSelected = storm.id === selectedStormId;

      if (layersVisibility.radarReflectivity && storm.coordinates && storm.coordinates.length > 2) {
        // Outer echo layer (30-40 dBZ - light cyan/green)
        const outerPoly = L.polygon(storm.coordinates as L.LatLngExpression[], {
          color: '#2DD4BF',
          weight: 1.5,
          opacity: 0.8,
          fillColor: '#0E7490',
          fillOpacity: 0.35
        }).addTo(layerGroup);

        // Core echo layer (45-60 dBZ - yellow to red)
        const coreCoords = storm.coordinates.map(([lat, lon]) => [
          lat + (storm.centroid_lat - lat) * 0.45,
          lon + (storm.centroid_lon - lon) * 0.45
        ]);

        const corePoly = L.polygon(coreCoords as L.LatLngExpression[], {
          color: '#EAB308',
          weight: 2,
          opacity: 0.9,
          fillColor: '#EF4444',
          fillOpacity: 0.65
        }).addTo(layerGroup);

        // Click on polygon selects storm
        outerPoly.on('click', () => onSelectStorm(storm));
        corePoly.on('click', () => onSelectStorm(storm));

        // Tooltip
        outerPoly.bindTooltip(`
          <div style="font-family:Inter, sans-serif; font-size:12px; padding:4px;">
            <strong>${storm.name}</strong><br/>
            Reflectivity: <strong>${storm.max_reflectivity_dbz} dBZ</strong> (${storm.severity})<br/>
            Motion: ${storm.movement} at ${storm.speed_kmph} km/h<br/>
            ${storm.eta}
          </div>
        `, { sticky: true });
      }

      // 3. Forecast Track Line (Dashed Cyan Line)
      if (layersVisibility.stormTracks && storm.track && storm.track.length > 1) {
        const trackPoints = storm.track.map(t => [t.lat, t.lon] as [number, number]);

        L.polyline(trackPoints, {
          color: '#2DD4BF',
          weight: 2.5,
          dashArray: '6, 6',
          opacity: 0.95
        }).addTo(layerGroup);

        // ETA Markers along corridor
        if (layersVisibility.etaLabels) {
          storm.track.forEach((pt, index) => {
            if (index > 0) {
              const etaIcon = L.divIcon({
                className: 'custom-eta-marker',
                html: `<div class="map-eta-pill">${pt.label}</div>`,
                iconSize: [70, 20],
                iconAnchor: [35, 10]
              });
              L.marker([pt.lat, pt.lon], { icon: etaIcon }).addTo(layerGroup);
            }
          });
        }
      }

      // 4. Convective Centroid Marker (Radar Sweep Indicator)
      const centroidIcon = L.divIcon({
        className: 'custom-centroid-marker',
        html: `
          <div style="position:relative; width:22px; height:22px; cursor:pointer;">
            <div style="position:absolute; inset:0; border-radius:50%; background:rgba(239,68,68,0.3); animation:pulse-health 1.5s infinite;"></div>
            <div style="position:absolute; top:4px; left:4px; width:14px; height:14px; border-radius:50%; background:#EF4444; border:2px solid #FFFFFF;"></div>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker([storm.centroid_lat, storm.centroid_lon], { icon: centroidIcon }).addTo(layerGroup);
      marker.on('click', () => onSelectStorm(storm));

      // 5. Lightning Strikes (Red Bolt Icons)
      if (layersVisibility.lightningStrikes) {
        // Scatter realistic strikes around storm centroid
        const strikes = [
          [storm.centroid_lat + 0.12, storm.centroid_lon - 0.08],
          [storm.centroid_lat - 0.15, storm.centroid_lon - 0.22],
          [storm.centroid_lat + 0.25, storm.centroid_lon + 0.15],
          [storm.centroid_lat - 0.05, storm.centroid_lon + 0.28],
          [storm.centroid_lat + 0.32, storm.centroid_lon - 0.18],
          [storm.centroid_lat - 0.22, storm.centroid_lon + 0.05]
        ];

        strikes.forEach(([sLat, sLon]) => {
          const lightningIcon = L.divIcon({
            className: 'custom-lightning-icon',
            html: `
              <div style="color:#F87171; font-size:16px; filter:drop-shadow(0 0 6px #EF4444); cursor:pointer;" title="Ground Lightning Strike">
                ⚡
              </div>
            `,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });
          L.marker([sLat, sLon], { icon: lightningIcon }).addTo(layerGroup);
        });
      }

      // 6. Hail Hazard Markers (Yellow Triangles)
      if (layersVisibility.hailZones && storm.hazard.toLowerCase().includes('hail')) {
        const hailIcon = L.divIcon({
          className: 'custom-hail-icon',
          html: `
            <div style="color:#FBBF24; font-size:15px; filter:drop-shadow(0 0 5px #F59E0B);" title="Hail Risk Area (Diameter 12-25mm)">
              ▲
            </div>
          `,
          iconSize: [15, 15],
          iconAnchor: [7, 7]
        });
        L.marker([storm.centroid_lat + 0.06, storm.centroid_lon + 0.08], { icon: hailIcon }).addTo(layerGroup);
      }
    });

  }, [storms, selectedStormId, userLocation, layersVisibility, onSelectStorm]);

  // Map Controls Handlers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleReset = () => mapInstanceRef.current?.setView([18.85, 74.15], 7);

  return (
    <div className="gis-map-wrapper" style={{ position: 'relative' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '520px' }} />

      {/* Top Left: Zoom and Reset Controls */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          zIndex: 800
        }}
      >
        <button
          onClick={handleZoomIn}
          style={{
            background: 'rgba(17, 24, 39, 0.9)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-sm)',
            color: '#FFFFFF',
            padding: '7px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)'
          }}
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={handleZoomOut}
          style={{
            background: 'rgba(17, 24, 39, 0.9)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-sm)',
            color: '#FFFFFF',
            padding: '7px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)'
          }}
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={handleReset}
          style={{
            background: 'rgba(17, 24, 39, 0.9)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-sm)',
            color: '#FFFFFF',
            padding: '7px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)'
          }}
          title="Reset Map View"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Top Right: Layer Switcher & Basemap */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 800
        }}
      >
        <button
          onClick={() => setShowLayersMenu(!showLayersMenu)}
          style={{
            background: 'rgba(17, 24, 39, 0.9)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-sm)',
            color: '#FFFFFF',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: 'var(--shadow-md)',
            fontSize: '0.75rem',
            fontWeight: 600
          }}
          title="Toggle Layers"
        >
          <Layers size={16} />
          <span>Layers</span>
        </button>

        {showLayersMenu && (
          <div
            style={{
              position: 'absolute',
              top: '40px',
              right: '0',
              background: 'rgba(17, 24, 39, 0.95)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              width: '210px',
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '0.75rem'
            }}
          >
            <div style={{ fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
              Weather Layers
            </div>
            {[
              { key: 'radarReflectivity', label: 'Radar Reflectivity (dBZ)' },
              { key: 'stormTracks', label: 'Forecast Tracks & Corridors' },
              { key: 'lightningStrikes', label: 'Real-time Lightning Strikes' },
              { key: 'hailZones', label: 'Hail Risk Cores' },
              { key: 'etaLabels', label: 'Storm ETA Badges' },
              { key: 'districtBoundaries', label: 'District Boundaries' }
            ].map((layer) => (
              <label key={layer.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={(layersVisibility as any)[layer.key]}
                  onChange={(e) => setLayersVisibility({ ...layersVisibility, [layer.key]: e.target.checked })}
                />
                <span>{layer.label}</span>
              </label>
            ))}

            <div style={{ fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px', marginTop: '6px' }}>
              Base Map (Free / No Key)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
              <button
                onClick={() => setActiveBaseMap('dark')}
                style={{
                  padding: '4px',
                  borderRadius: '3px',
                  background: activeBaseMap === 'dark' ? '#2563EB' : '#1E293B',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Dark
              </button>
              <button
                onClick={() => setActiveBaseMap('light')}
                style={{
                  padding: '4px',
                  borderRadius: '3px',
                  background: activeBaseMap === 'light' ? '#2563EB' : '#1E293B',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Street
              </button>
              <button
                onClick={() => setActiveBaseMap('satellite')}
                style={{
                  padding: '4px',
                  borderRadius: '3px',
                  background: activeBaseMap === 'satellite' ? '#2563EB' : '#1E293B',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Satellite
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Embedded Bottom Map Legend Bar (Matching Photo Reference) */}
      <div className="map-embedded-legend" role="group" aria-label="Map Legend">
        <div className="legend-item">
          <span className="icon-storm">▲</span>
          <span>Storm Cell</span>
        </div>
        <div className="legend-item">
          <span className="icon-hail">▲</span>
          <span>Hail</span>
        </div>
        <div className="legend-item">
          <span className="icon-lightning">⚡</span>
          <span>Lightning</span>
        </div>
        <div className="legend-item">
          <span className="track-dash" />
          <span>Forecast Track</span>
        </div>
        <div className="legend-item">
          <span style={{ color: '#60A5FA' }}>⬢</span>
          <span>City</span>
        </div>
        <div className="legend-item">
          <span style={{ borderBottom: '1px solid #64748B', width: '12px', display: 'inline-block' }} />
          <span>District Boundary</span>
        </div>
        <div className="legend-item" style={{ cursor: 'pointer' }} onClick={handleReset} title="Reset rotation">
          <span>🔄</span>
          <span>Map Rotate</span>
        </div>
      </div>

      {/* Scale & Attribution Strip (Bottom Left & Right) */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '12px',
          background: 'rgba(15, 23, 42, 0.75)',
          padding: '2px 8px',
          borderRadius: '2px',
          color: '#CBD5E1',
          fontSize: '0.62rem',
          fontFamily: 'monospace',
          zIndex: 700
        }}
      >
        100 km | 25 mi
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '12px',
          background: 'rgba(15, 23, 42, 0.75)',
          padding: '2px 8px',
          borderRadius: '2px',
          color: '#94A3B8',
          fontSize: '0.62rem',
          zIndex: 700
        }}
      >
        © OpenStreetMap © Esri © NavDrishti AI
      </div>
    </div>
  );
};
