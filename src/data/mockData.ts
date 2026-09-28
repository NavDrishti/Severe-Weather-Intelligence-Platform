import { StormCell, DataSourceHealth, AlertItem, ReplayCase, HourlyForecastStep, LocationCoordinates } from '../types/weather';

export const BASE_TIME_IST = '17:35:42 IST';
export const BASE_DATE_IST = '20 May 2025, Tuesday';

export const INITIAL_LOCATION: LocationCoordinates = {
  name: 'Pune',
  state: 'Maharashtra',
  district: 'Pune',
  lat: 18.52,
  lon: 73.86,
  elevation_m: 560
};

export const MOCK_STORMS: StormCell[] = [
  {
    id: 'CELL-MH-01',
    name: 'Pune-Ahmednagar Squall Line',
    region: 'Maharashtra (Western Ghats)',
    hazard: 'Lightning & Heavy Rain',
    severity: 'Very High',
    current_intensity: '58 dBZ (Severe)',
    movement: 'ENE (65°)',
    speed_kmph: 38,
    direction_deg: 65,
    centroid_lat: 18.72,
    centroid_lon: 73.68,
    area_km2: 420,
    max_reflectivity_dbz: 58.5,
    echo_top_km: 14.2,
    vil_kg_m2: 48.0,
    growth_status: 'growing',
    nearest_district: 'Pune (Haveli / Khed)',
    nearest_city: 'Pune',
    eta: 'Expected in 25–40 min',
    eta_window: '17:30 – 18:30 IST',
    confidence: 0.78,
    data_completeness: 0.92,
    last_updated: '2 min ago',
    coordinates: [
      [18.95, 73.40],
      [19.10, 73.90],
      [18.75, 74.20],
      [18.45, 73.80],
      [18.55, 73.45],
      [18.95, 73.40]
    ],
    track: [
      { time: '17:35', lat: 18.72, lon: 73.68, label: 'NOW', status: 'observed' },
      { time: '18:00', lat: 18.82, lon: 73.88, label: 'ETA 18:00', status: 'forecast_corridor' },
      { time: '18:30', lat: 18.95, lon: 74.12, label: 'ETA 18:30', status: 'forecast_corridor' },
      { time: '19:15', lat: 19.12, lon: 74.45, label: 'ETA 19:15', status: 'forecast_corridor' },
      { time: '20:00', lat: 19.30, lon: 74.80, label: 'ETA 20:00', status: 'forecast_corridor' }
    ],
    evidence: [
      'Radar reflectivity increasing (+4 dBZ in 10 min)',
      'Cloud-to-ground lightning flash rate jumped to 42/min',
      'INSAT-3DS TIR1 cloud-top cooling down to -64°C',
      'Surface convergence along Bhor Ghat axis'
    ],
    affected_assets: [
      { name: 'Pune International Airport (PNQ)', type: 'Airport', eta_min: 35 },
      { name: 'Chakan Industrial Zone Substations', type: 'Power Grid', eta_min: 25 },
      { name: 'Mumbai-Pune Expressway (Ghat section)', type: 'Expressway', eta_min: 15 }
    ]
  },
  {
    id: 'CELL-MH-02',
    name: 'Satara-Mahabaleshwar Cell',
    region: 'Maharashtra (South Konkan Ghats)',
    hazard: 'Cloudburst & Lightning',
    severity: 'High',
    current_intensity: '52 dBZ',
    movement: 'NE (50°)',
    speed_kmph: 32,
    direction_deg: 50,
    centroid_lat: 17.68,
    centroid_lon: 73.85,
    area_km2: 310,
    max_reflectivity_dbz: 54.0,
    echo_top_km: 12.8,
    vil_kg_m2: 39.5,
    growth_status: 'mature',
    nearest_district: 'Satara',
    nearest_city: 'Satara',
    eta: 'Expected in 45–60 min',
    eta_window: '18:15 – 18:45 IST',
    confidence: 0.72,
    data_completeness: 0.88,
    last_updated: '4 min ago',
    coordinates: [
      [17.85, 73.70],
      [17.95, 74.05],
      [17.60, 74.15],
      [17.45, 73.80],
      [17.85, 73.70]
    ],
    track: [
      { time: '17:35', lat: 17.68, lon: 73.85, label: 'NOW', status: 'observed' },
      { time: '18:05', lat: 17.82, lon: 74.02, label: 'ETA 18:05', status: 'forecast_corridor' },
      { time: '18:45', lat: 18.05, lon: 74.25, label: 'ETA 18:45', status: 'forecast_corridor' }
    ],
    evidence: [
      'Heavy orographic lift along western slope',
      'Estimated instantaneous rain rate 78 mm/hr',
      'High VIL (>38 kg/m²) indicating deep moisture column'
    ],
    affected_assets: [
      { name: 'Koyna Hydroelectric Complex', type: 'Hydro Dam', eta_min: 40 },
      { name: 'Satara Central Hospital', type: 'Hospital', eta_min: 55 }
    ]
  },
  {
    id: 'CELL-NCR-03',
    name: 'Gurugram-Faridabad Convective Cluster',
    region: 'Delhi-NCR / Haryana',
    hazard: 'Downburst & Hail',
    severity: 'High',
    current_intensity: '55 dBZ',
    movement: 'E (90°)',
    speed_kmph: 45,
    direction_deg: 90,
    centroid_lat: 28.45,
    centroid_lon: 77.02,
    area_km2: 280,
    max_reflectivity_dbz: 56.0,
    echo_top_km: 13.5,
    vil_kg_m2: 44.0,
    growth_status: 'growing',
    nearest_district: 'Gurugram',
    nearest_city: 'New Delhi / Gurugram',
    eta: 'Expected in 30–50 min',
    eta_window: '18:05 – 18:25 IST',
    confidence: 0.81,
    data_completeness: 0.95,
    last_updated: '1 min ago',
    coordinates: [
      [28.58, 76.90],
      [28.62, 77.20],
      [28.35, 77.25],
      [28.30, 76.95],
      [28.58, 76.90]
    ],
    track: [
      { time: '17:35', lat: 28.45, lon: 77.02, label: 'NOW', status: 'observed' },
      { time: '18:00', lat: 28.48, lon: 77.25, label: 'ETA 18:00', status: 'forecast_corridor' },
      { time: '18:30', lat: 28.52, lon: 77.55, label: 'ETA 18:30', status: 'forecast_corridor' }
    ],
    evidence: [
      'Inverted-V sounding dry boundary layer favoring downbursts',
      'Surface gust front detected by Delhi Palam radar',
      'Radial velocity divergence 32 m/s'
    ],
    affected_assets: [
      { name: 'Indira Gandhi International Airport (DEL)', type: 'Airport', eta_min: 20 },
      { name: 'Delhi Metro Yellow Line Overhead Equipments', type: 'Metro Transit', eta_min: 25 }
    ]
  },
  {
    id: 'CELL-NE-04',
    name: 'Cherrapunji-Shillong Cloudburst Core',
    region: 'Meghalaya / Assam border',
    hazard: 'Cloudburst & Flash Flood',
    severity: 'Very High',
    current_intensity: '62 dBZ (Extreme)',
    movement: 'NNE (25°)',
    speed_kmph: 22,
    direction_deg: 25,
    centroid_lat: 25.28,
    centroid_lon: 91.72,
    area_km2: 390,
    max_reflectivity_dbz: 62.0,
    echo_top_km: 15.1,
    vil_kg_m2: 58.0,
    growth_status: 'growing',
    nearest_district: 'East Khasi Hills',
    nearest_city: 'Shillong',
    eta: 'Active Cloudburst Trigger',
    eta_window: 'Now – 18:30 IST',
    confidence: 0.85,
    data_completeness: 0.87,
    last_updated: '3 min ago',
    coordinates: [
      [25.40, 91.55],
      [25.48, 91.90],
      [25.18, 91.95],
      [25.12, 91.60],
      [25.40, 91.55]
    ],
    track: [
      { time: '17:35', lat: 25.28, lon: 91.72, label: 'NOW', status: 'observed' },
      { time: '18:05', lat: 25.42, lon: 91.78, label: 'ETA 18:05', status: 'forecast_corridor' },
      { time: '18:45', lat: 25.60, lon: 91.85, label: 'ETA 18:45', status: 'forecast_corridor' }
    ],
    evidence: [
      'Rain rate exceeding 105 mm/hr in radar Z-R conversion',
      'Steep terrain orographic compression',
      'Continuous lightning pulse discharge >70/min'
    ],
    affected_assets: [
      { name: 'Umiam Dam Spillway Catchment', type: 'Hydro Dam', eta_min: 30 },
      { name: 'NH-6 Shillong-Guwahati Corridor', type: 'Highway', eta_min: 15 }
    ]
  },
  {
    id: 'CELL-KA-05',
    name: 'Bengaluru Pre-Monsoon Thunderstorm',
    region: 'Karnataka (South Interior)',
    hazard: 'Lightning & Urban Waterlogging',
    severity: 'Medium',
    current_intensity: '48 dBZ',
    movement: 'SE (135°)',
    speed_kmph: 28,
    direction_deg: 135,
    centroid_lat: 12.98,
    centroid_lon: 77.58,
    area_km2: 210,
    max_reflectivity_dbz: 49.0,
    echo_top_km: 11.4,
    vil_kg_m2: 32.0,
    growth_status: 'decaying',
    nearest_district: 'Bengaluru Urban',
    nearest_city: 'Bengaluru',
    eta: 'Expected in 40–55 min',
    eta_window: '18:15 – 18:30 IST',
    confidence: 0.69,
    data_completeness: 0.91,
    last_updated: '5 min ago',
    coordinates: [
      [13.10, 77.48],
      [13.12, 77.72],
      [12.88, 77.70],
      [12.85, 77.45],
      [13.10, 77.48]
    ],
    track: [
      { time: '17:35', lat: 12.98, lon: 77.58, label: 'NOW', status: 'observed' },
      { time: '18:00', lat: 12.88, lon: 77.68, label: 'ETA 18:00', status: 'forecast_corridor' },
      { time: '18:30', lat: 12.75, lon: 77.80, label: 'ETA 18:30', status: 'forecast_corridor' }
    ],
    evidence: [
      'Convective cloud top warming (-48°C to -42°C)',
      'Downdraft rain cores reaching surface',
      'Flash rate decreasing over Electronic City'
    ],
    affected_assets: [
      { name: 'Kempegowda International Airport (BLR)', type: 'Airport', eta_min: 50 },
      { name: 'Silk Board Junction / Bellandur Catchment', type: 'Drainage Basin', eta_min: 25 }
    ]
  }
];

export const HOURLY_TIMELINE: HourlyForecastStep[] = [
  { horizon: 'NOW', time: '17:35', horizon_pct: 0, lightning_prob: 85, hail_prob: 40, cloudburst_prob: 30, downburst_prob: 25, rain_rate: 8.5, mode: 'Observation-dominant', weather: 'thunderstorm' },
  { horizon: '+30 min', time: '18:05', horizon_pct: 8, lightning_prob: 90, hail_prob: 45, cloudburst_prob: 35, downburst_prob: 30, rain_rate: 28.0, mode: 'Observation-dominant', weather: 'heavy_rain_lightning' },
  { horizon: '+1h', time: '18:35', horizon_pct: 16, lightning_prob: 80, hail_prob: 35, cloudburst_prob: 40, downburst_prob: 35, rain_rate: 45.0, mode: 'Observation-dominant', weather: 'cloudburst_watch' },
  { horizon: '+1h 30', time: '19:05', horizon_pct: 25, lightning_prob: 65, hail_prob: 25, cloudburst_prob: 28, downburst_prob: 20, rain_rate: 24.0, mode: 'Observation-dominant', weather: 'rain_thunder' },
  { horizon: '+2h', time: '19:35', horizon_pct: 33, lightning_prob: 50, hail_prob: 15, cloudburst_prob: 20, downburst_prob: 18, rain_rate: 16.0, mode: 'Multi-source Fusion', weather: 'moderate_rain' },
  { horizon: '+2h 30', time: '20:05', horizon_pct: 41, lightning_prob: 38, hail_prob: 10, cloudburst_prob: 15, downburst_prob: 15, rain_rate: 9.5, mode: 'Multi-source Fusion', weather: 'light_rain' },
  { horizon: '+3h', time: '20:35', horizon_pct: 50, lightning_prob: 28, hail_prob: 5, cloudburst_prob: 10, downburst_prob: 12, rain_rate: 4.0, mode: 'Multi-source Fusion', weather: 'passing_showers' },
  { horizon: '+3h 30', time: '21:05', horizon_pct: 58, lightning_prob: 22, hail_prob: 5, cloudburst_prob: 8, downburst_prob: 10, rain_rate: 2.5, mode: 'NWP-Assisted', weather: 'cloudy' },
  { horizon: '+4h', time: '21:35', horizon_pct: 66, lightning_prob: 18, hail_prob: 2, cloudburst_prob: 5, downburst_prob: 8, rain_rate: 1.0, mode: 'NWP-Assisted', weather: 'cloudy' },
  { horizon: '+4h 30', time: '22:05', horizon_pct: 75, lightning_prob: 15, hail_prob: 0, cloudburst_prob: 3, downburst_prob: 5, rain_rate: 0.5, mode: 'NWP-Assisted', weather: 'partly_cloudy' },
  { horizon: '+5h', time: '22:35', horizon_pct: 83, lightning_prob: 12, hail_prob: 0, cloudburst_prob: 2, downburst_prob: 5, rain_rate: 0.0, mode: 'NWP-Assisted', weather: 'clear' },
  { horizon: '+5h 30', time: '23:05', horizon_pct: 91, lightning_prob: 10, hail_prob: 0, cloudburst_prob: 0, downburst_prob: 5, rain_rate: 0.0, mode: 'NWP-Assisted', weather: 'clear' },
  { horizon: '+6h', time: '23:35', horizon_pct: 100, lightning_prob: 8, hail_prob: 0, cloudburst_prob: 0, downburst_prob: 3, rain_rate: 0.0, mode: 'NWP-Assisted', weather: 'clear' }
];

export const MOCK_DATA_HEALTH: DataSourceHealth[] = [
  {
    key: 'radar',
    name: 'Doppler Weather Radar (DWR)',
    type: 'Ground Active Sensor',
    status: 'healthy',
    status_label: 'Healthy',
    last_updated_minutes: 2,
    cadence_minutes: 10,
    quality_score: 0.96,
    coverage: 'Mumbai, Goa, Nagpur, Delhi, Patiala, Cherrapunji',
    observations_count: 1420,
    fallback: 'INSAT-3DS Rapid Scan',
    history: ['OK', 'OK', 'OK', 'OK', 'OK']
  },
  {
    key: 'satellite',
    name: 'INSAT-3D / 3DR / 3DS',
    type: 'Geostationary Imagery (MOSDAC)',
    status: 'healthy',
    status_label: 'Healthy',
    last_updated_minutes: 5,
    cadence_minutes: 15,
    quality_score: 0.98,
    coverage: 'All-India Pan Indian Ocean Basin',
    observations_count: 890,
    fallback: 'HIMAWARI-9 / Meteosat-9 Regional',
    history: ['OK', 'OK', 'OK', 'OK', 'OK']
  },
  {
    key: 'lightning',
    name: 'Ground Lightning Detection (LIDEN)',
    type: 'Electromagnetic Sensors',
    status: 'healthy',
    status_label: 'Healthy',
    last_updated_minutes: 1,
    cadence_minutes: 1,
    quality_score: 0.94,
    coverage: 'Nationwide Sensor Array (85 Stations)',
    observations_count: 3410,
    fallback: 'Radar VIL proxy estimation',
    history: ['OK', 'OK', 'OK', 'OK', 'OK']
  },
  {
    key: 'ground',
    name: 'Automatic Weather Stations (AWS/ARG)',
    type: 'Surface Telemetry (IMD & States)',
    status: 'delayed',
    status_label: 'Delayed (6 min)',
    last_updated_minutes: 16,
    cadence_minutes: 15,
    quality_score: 0.88,
    coverage: '5,400 Ground Telemetry Terminals',
    observations_count: 4820,
    fallback: 'Interpolated Mesonet Climatology',
    history: ['OK', 'OK', 'DELAYED', 'OK', 'DELAYED']
  },
  {
    key: 'nwp',
    name: 'Numerical Weather Prediction (NCUM/WRF)',
    type: 'High-Res NWP Model (NCMRWF)',
    status: 'healthy',
    status_label: 'Healthy',
    last_updated_minutes: 45,
    cadence_minutes: 360,
    quality_score: 0.92,
    coverage: '1.5 km - 4 km Convective Permitting Grid',
    observations_count: 12,
    fallback: 'Global GFS 0.25° Assimilation',
    history: ['OK', 'OK', 'OK', 'OK', 'OK']
  }
];

export const MOCK_ALERTS: AlertItem[] = [
  {
    id: 'ALT-2025-0520-001',
    title: 'Severe Thunderstorm & Lightning Warning: Pune & Pimpri-Chinchwad',
    hazard: 'Lightning & Heavy Rain',
    severity: 'Orange (Be Prepared)',
    severity_code: 'orange',
    affected_area: 'Pune Metropolitan Area, Haveli, Maval, Mulshi',
    issue_time: '2025-05-20T17:20:00+05:30',
    valid_until: '2025-05-20T19:30:00+05:30',
    probability: 0.85,
    confidence: 0.78,
    lead_time_min: 35,
    status: 'pending_review',
    reviewer: 'Duty Meteorologist / SDMA Operator',
    evidence: [
      'Radar reflectivity peaked at 58.5 dBZ over Talegaon-Lonavala',
      'High rate of Cloud-to-Ground lightning (42 strikes/min)',
      'Observed wind gusts exceeding 50 km/h at Pashan AWS'
    ],
    recommended_action: 'Issue prompt mobile safety alert; suspend airport ground operations; alert traffic control for low-lying waterlogged roads.',
    polygon: [
      [18.95, 73.40],
      [19.10, 73.90],
      [18.75, 74.20],
      [18.45, 73.80],
      [18.55, 73.45]
    ]
  },
  {
    id: 'ALT-2025-0520-002',
    title: 'Cloudburst & Flash Flood Watch: East Khasi Hills (Cherrapunji)',
    hazard: 'Cloudburst',
    severity: 'Red (Take Action)',
    severity_code: 'red',
    affected_area: 'Sohra (Cherrapunji), Shillong, Mawphlang Catchment',
    issue_time: '2025-05-20T17:05:00+05:30',
    valid_until: '2025-05-20T20:00:00+05:30',
    probability: 0.76,
    confidence: 0.85,
    lead_time_min: 20,
    status: 'approved',
    reviewer: 'Dr. R. Sengupta (Chief Meteorologist, NE Circle)',
    evidence: [
      'Instantaneous radar rain rate > 105 mm/hr',
      'VIL exceeding 58 kg/m² indicating intense precipitable water column',
      'Rapid runoff detected in upstream river sensor tributaries'
    ],
    recommended_action: 'Evacuate vulnerable riparian settlements immediately; activate State Disaster Response Force (SDRF) standby.',
    polygon: [
      [25.40, 91.55],
      [25.48, 91.90],
      [25.18, 91.95],
      [25.12, 91.60]
    ]
  },
  {
    id: 'ALT-2025-0520-003',
    title: 'Severe Downburst & Squall Watch: Gurugram & IGI Airport Corridor',
    hazard: 'Downburst & Hail',
    severity: 'Orange (Be Prepared)',
    severity_code: 'orange',
    affected_area: 'Gurugram, Manesar, South West Delhi, Dwarka',
    issue_time: '2025-05-20T17:15:00+05:30',
    valid_until: '2025-05-20T19:00:00+05:30',
    probability: 0.68,
    confidence: 0.81,
    lead_time_min: 30,
    status: 'approved',
    reviewer: 'ATC Met Support Unit, Palam',
    evidence: [
      'Radial velocity divergence 32 m/s detected at 1.5 km altitude',
      'Hail probability index 40% with possible small hail (<15 mm)',
      'Microburst signature forming on leading edge of gust front'
    ],
    recommended_action: 'Notify aviation flight controllers; halt outdoor construction tower cranes; secure public hoardings.',
    polygon: [
      [28.58, 76.90],
      [28.62, 77.20],
      [28.35, 77.25],
      [28.30, 76.95]
    ]
  },
  {
    id: 'ALT-2025-0520-004',
    title: 'Moderate Convective Thunderstorm Watch: Bengaluru City',
    hazard: 'Thunderstorm',
    severity: 'Yellow (Watch)',
    severity_code: 'yellow',
    affected_area: 'Bengaluru Urban, Yelahanka, Whitefield, Electronic City',
    issue_time: '2025-05-20T17:00:00+05:30',
    valid_until: '2025-05-20T18:45:00+05:30',
    probability: 0.52,
    confidence: 0.69,
    lead_time_min: 45,
    status: 'suppressed',
    reviewer: 'Automated Filter (Cell Decaying Trend Detected)',
    evidence: [
      'Cell max reflectivity decaying from 54 to 48 dBZ',
      'Cloud-top temperature warming over past 20 minutes',
      'Below threshold for severe disruption issuance'
    ],
    recommended_action: 'Maintain monitoring; do not trigger civilian sirens unless cell re-intensifies.',
    polygon: [
      [13.10, 77.48],
      [13.12, 77.72],
      [12.88, 77.70],
      [12.85, 77.45]
    ]
  }
];

export const MOCK_REPLAY_CASES: ReplayCase[] = [
  {
    id: 'CASE-2023-PUNE-SQUALL',
    title: 'Severe Pre-Monsoon Squall & Hail: Pune Urban Basin',
    hazard_category: 'Severe Thunderstorm & Hail',
    region: 'Maharashtra (Pune & Western Ghats)',
    date_str: 'May 13, 2023',
    duration_hours: 4,
    peak_intensity: '61 dBZ radar core / 55 mm/hr rain / 68 km/h gust',
    lead_time_achieved: '48 minutes ahead of cell landfall',
    description: 'Explosive convective initiation over Lonavala ridge resulting in severe hail, power substation outages, and wind gusts across Kothrud, Shivajinagar, and Hadapsar.',
    metrics: {
      pod: 0.88,
      far: 0.14,
      csi: 0.77,
      brier_score: 0.12,
      mae_rain: '6.2 mm/hr',
      position_error_km: 4.1
    },
    frames_count: 16
  },
  {
    id: 'CASE-2022-AMARNATH-CLOUDBURST',
    title: 'Orographic Extreme Convective Cloudburst: J&K Mountain Terrain',
    hazard_category: 'Cloudburst (>100 mm/h) & Flash Flood',
    region: 'Jammu & Kashmir / Himalayas',
    date_str: 'July 8, 2022',
    duration_hours: 3,
    peak_intensity: 'Estimated 115 mm/hr localized convective burst',
    lead_time_achieved: '32 minutes nowcast initiation advisory',
    description: 'Extreme convective cluster confined by steep valley walls producing rapid hydrological surge. Demonstrates the critical role of INSAT-3DS rapid-scan cooling detection in radar-shadowed mountainous valleys.',
    metrics: {
      pod: 0.82,
      far: 0.18,
      csi: 0.70,
      brier_score: 0.15,
      mae_rain: '12.4 mm/hr',
      position_error_km: 5.8
    },
    frames_count: 12
  },
  {
    id: 'CASE-2024-DELHI-DOWNBURST',
    title: 'Intense Wet Microburst & Hail Event: Delhi-NCR & Airport',
    hazard_category: 'Downburst & Severe Wind Shear',
    region: 'Delhi-NCR (Palam, Gurugram, Noida)',
    date_str: 'May 25, 2024',
    duration_hours: 2.5,
    peak_intensity: 'Wind gust 82 km/h / 22 mm hail diameter',
    lead_time_achieved: '42 minutes prior to runway gust-front arrival',
    description: 'Multi-cell squall line with dry sub-cloud evaporative cooling generating rapid descending downburst. Enabled aviation ground stop before surface arrival.',
    metrics: {
      pod: 0.91,
      far: 0.11,
      csi: 0.82,
      brier_score: 0.09,
      mae_rain: '4.8 mm/hr',
      position_error_km: 3.2
    },
    frames_count: 14
  },
  {
    id: 'CASE-2023-BENGAL-NORWESTER',
    title: "Kalbaishakhi (Nor'wester) Severe Convective Outbreak: West Bengal",
    hazard_category: 'Squall Line & High-Density Lightning',
    region: 'West Bengal & Kolkata Metro',
    date_str: 'April 30, 2023',
    duration_hours: 5,
    peak_intensity: '140 lightning strikes/min / 72 km/h squall',
    lead_time_achieved: '55 minutes lead time across Kolkata',
    description: 'Rapidly propagating line convection fueled by moist Bay of Bengal air colliding with dry Chota Nagpur plateau westerly dryline.',
    metrics: {
      pod: 0.86,
      far: 0.16,
      csi: 0.74,
      brier_score: 0.13,
      mae_rain: '7.1 mm/hr',
      position_error_km: 4.8
    },
    frames_count: 20
  }
];

export const SEARCHABLE_LOCATIONS = [
  { name: 'Pune', state: 'Maharashtra', district: 'Pune', lat: 18.52, lon: 73.86, risk: 'Very High', active_hazard: 'Lightning & Heavy Rain' },
  { name: 'Mumbai', state: 'Maharashtra', district: 'Mumbai City', lat: 19.07, lon: 72.87, risk: 'Medium', active_hazard: 'Passing Rain Cells' },
  { name: 'Satara', state: 'Maharashtra', district: 'Satara', lat: 17.68, lon: 73.98, risk: 'High', active_hazard: 'Cloudburst Watch' },
  { name: 'Ahmednagar', state: 'Maharashtra', district: 'Ahmednagar', lat: 19.09, lon: 74.74, risk: 'High', active_hazard: 'Severe Thunderstorm' },
  { name: 'Nashik', state: 'Maharashtra', district: 'Nashik', lat: 19.99, lon: 73.78, risk: 'Low', active_hazard: 'No Significant Hazard' },
  { name: 'New Delhi', state: 'Delhi', district: 'New Delhi', lat: 28.61, lon: 77.20, risk: 'High', active_hazard: 'Downburst & Hail' },
  { name: 'Gurugram', state: 'Haryana', district: 'Gurugram', lat: 28.45, lon: 77.02, risk: 'High', active_hazard: 'Downburst & Wind Shear' },
  { name: 'Noida', state: 'Uttar Pradesh', district: 'Gautam Buddha Nagar', lat: 28.53, lon: 77.39, risk: 'Moderate', active_hazard: 'Thunderstorm Watch' },
  { name: 'Shillong', state: 'Meghalaya', district: 'East Khasi Hills', lat: 25.57, lon: 91.89, risk: 'Very High', active_hazard: 'Cloudburst Active' },
  { name: 'Cherrapunji', state: 'Meghalaya', district: 'East Khasi Hills', lat: 25.28, lon: 91.72, risk: 'Very High', active_hazard: 'Cloudburst Alert' },
  { name: 'Guwahati', state: 'Assam', district: 'Kamrup Metropolitan', lat: 26.14, lon: 91.73, risk: 'Moderate', active_hazard: 'Thunderstorm' },
  { name: 'Bengaluru', state: 'Karnataka', district: 'Bengaluru Urban', lat: 12.97, lon: 77.59, risk: 'Medium', active_hazard: 'Urban Waterlogging' },
  { name: 'Kolkata', state: 'West Bengal', district: 'Kolkata', lat: 22.57, lon: 88.36, risk: 'Low-Moderate', active_hazard: 'Showers' },
  { name: 'Hyderabad', state: 'Telangana', district: 'Hyderabad', lat: 17.38, lon: 78.48, risk: 'Low', active_hazard: 'Clear Sky' },
  { name: 'Nagpur', state: 'Maharashtra', district: 'Nagpur', lat: 21.14, lon: 79.08, risk: 'Low', active_hazard: 'Dry Conditions' }
];
