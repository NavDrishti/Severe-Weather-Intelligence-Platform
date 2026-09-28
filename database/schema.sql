-- =====================================================================
-- NavDrishti AI: Database Schema (PostgreSQL + PostGIS)
-- Smart India Hackathon PS 26084: Convective-Scale Nowcasting (0-6h)
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users and Authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL, -- e.g. IMD, SDMA, NDRF, Research
    role VARCHAR(50) NOT NULL DEFAULT 'viewer', -- admin, operator, reviewer, viewer
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Roles and Permissions
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 3. States
CREATE TABLE IF NOT EXISTS states (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    geom GEOMETRY(MultiPolygon, 4326),
    center_lat DOUBLE PRECISION,
    center_lon DOUBLE PRECISION
);

-- 4. Districts
CREATE TABLE IF NOT EXISTS districts (
    id VARCHAR(50) PRIMARY KEY,
    state_code VARCHAR(10) REFERENCES states(code),
    name VARCHAR(100) NOT NULL,
    geom GEOMETRY(MultiPolygon, 4326),
    hq_lat DOUBLE PRECISION,
    hq_lon DOUBLE PRECISION,
    vulnerability_index DOUBLE PRECISION DEFAULT 0.5
);

-- 5. Locations (Cities, Towns, Tehsils)
CREATE TABLE IF NOT EXISTS locations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    district_id VARCHAR(50) REFERENCES districts(id),
    state_code VARCHAR(10) REFERENCES states(code),
    lat DOUBLE PRECISION NOT NULL,
    lon DOUBLE PRECISION NOT NULL,
    elevation_m DOUBLE PRECISION DEFAULT 0.0,
    population INTEGER DEFAULT 0,
    point_geom GEOMETRY(Point, 4326)
);

-- 6. Critical Assets (Airports, Power Grids, Hospitals, Railways)
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- airport, power_substation, dam, hospital, stadium
    district_id VARCHAR(50) REFERENCES districts(id),
    lat DOUBLE PRECISION NOT NULL,
    lon DOUBLE PRECISION NOT NULL,
    threshold_gust_kmph DOUBLE PRECISION DEFAULT 60.0,
    threshold_rain_mm_hr DOUBLE PRECISION DEFAULT 50.0,
    geom GEOMETRY(Point, 4326)
);

-- 7. Geofences
CREATE TABLE IF NOT EXISTS geofences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(150) NOT NULL,
    geom GEOMETRY(Polygon, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Radar Observations
CREATE TABLE IF NOT EXISTS radar_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id VARCHAR(50) NOT NULL,
    station_name VARCHAR(100) NOT NULL,
    observation_time TIMESTAMP WITH TIME ZONE NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lon DOUBLE PRECISION NOT NULL,
    max_reflectivity_dbz DOUBLE PRECISION,
    vil_kg_m2 DOUBLE PRECISION,
    echo_top_km DOUBLE PRECISION,
    raster_url TEXT,
    quality_flag VARCHAR(20) DEFAULT 'good',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Satellite Observations (INSAT-3D/3DR/3DS)
CREATE TABLE IF NOT EXISTS satellite_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    satellite_name VARCHAR(50) NOT NULL, -- INSAT-3DS
    channel VARCHAR(50) NOT NULL, -- TIR1, TIR2, VIS, WV
    observation_time TIMESTAMP WITH TIME ZONE NOT NULL,
    min_cloud_top_temp_k DOUBLE PRECISION,
    raster_url TEXT,
    quality_flag VARCHAR(20) DEFAULT 'good',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Lightning Observations
CREATE TABLE IF NOT EXISTS lightning_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    network_source VARCHAR(50) NOT NULL, -- IMD-IITM Lightning Network
    strike_time TIMESTAMP WITH TIME ZONE NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lon DOUBLE PRECISION NOT NULL,
    peak_current_ka DOUBLE PRECISION,
    type VARCHAR(10) DEFAULT 'CG', -- Cloud-to-Ground (CG) or Intra-Cloud (IC)
    geom GEOMETRY(Point, 4326)
);

-- 11. Ground Observations (AWS / ARG)
CREATE TABLE IF NOT EXISTS ground_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id VARCHAR(50) NOT NULL,
    observation_time TIMESTAMP WITH TIME ZONE NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lon DOUBLE PRECISION NOT NULL,
    temp_c DOUBLE PRECISION,
    rh_pct DOUBLE PRECISION,
    wind_speed_kmph DOUBLE PRECISION,
    wind_gust_kmph DOUBLE PRECISION,
    pressure_hpa DOUBLE PRECISION,
    rain_last_1h_mm DOUBLE PRECISION
);

-- 12. NWP Fields (NCMRWF / IMD WRF / GFS Context)
CREATE TABLE IF NOT EXISTS nwp_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(50) NOT NULL, -- NCUM, WRF-3km
    run_time TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_time TIMESTAMP WITH TIME ZONE NOT NULL,
    cape_j_kg DOUBLE PRECISION,
    cin_j_kg DOUBLE PRECISION,
    deep_shear_0_6km_mps DOUBLE PRECISION,
    freezing_level_m DOUBLE PRECISION
);

-- 13. Storm Cells (Identified Convective Clusters)
CREATE TABLE IF NOT EXISTS storm_cells (
    id VARCHAR(50) PRIMARY KEY, -- e.g. CELL-MH-20250520-01
    centroid_lat DOUBLE PRECISION NOT NULL,
    centroid_lon DOUBLE PRECISION NOT NULL,
    first_detected TIMESTAMP WITH TIME ZONE NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL,
    area_km2 DOUBLE PRECISION NOT NULL,
    max_reflectivity_dbz DOUBLE PRECISION NOT NULL,
    growth_status VARCHAR(30) NOT NULL, -- growing, mature, decaying
    speed_kmph DOUBLE PRECISION NOT NULL,
    direction_deg DOUBLE PRECISION NOT NULL,
    cell_polygon GEOMETRY(Polygon, 4326),
    forecast_corridor GEOMETRY(Polygon, 4326)
);

-- 14. Storm Tracks
CREATE TABLE IF NOT EXISTS storm_tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    storm_id VARCHAR(50) REFERENCES storm_cells(id) ON DELETE CASCADE,
    timestep_minutes INTEGER NOT NULL, -- 0 (now), 15, 30, 45, 60, 90, 120, 180, 240, 360
    valid_time TIMESTAMP WITH TIME ZONE NOT NULL,
    predicted_lat DOUBLE PRECISION NOT NULL,
    predicted_lon DOUBLE PRECISION NOT NULL,
    corridor_width_km DOUBLE PRECISION NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(Point, 4326)
);

-- 15. Forecast Runs
CREATE TABLE IF NOT EXISTS forecast_runs (
    id VARCHAR(100) PRIMARY KEY,
    issue_time TIMESTAMP WITH TIME ZONE NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    pipeline_duration_sec DOUBLE PRECISION,
    data_completeness DOUBLE PRECISION,
    status VARCHAR(30) DEFAULT 'completed'
);

-- 16. Hazard Forecasts
CREATE TABLE IF NOT EXISTS hazard_forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id VARCHAR(100) REFERENCES forecast_runs(id),
    location_id VARCHAR(50) REFERENCES locations(id),
    horizon_minutes INTEGER NOT NULL,
    valid_time TIMESTAMP WITH TIME ZONE NOT NULL,
    hazard_type VARCHAR(50) NOT NULL, -- lightning, hail, cloudburst, downburst, thunderstorm
    probability DOUBLE PRECISION NOT NULL,
    severity_level VARCHAR(20) NOT NULL, -- low, medium, high, very_high
    intensity_value DOUBLE PRECISION, -- e.g. rain_rate 42 mm/hr or gust 55 kmph
    confidence DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. Alerts
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(50) PRIMARY KEY,
    hazard_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    affected_area VARCHAR(255) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- Yellow, Orange, Red
    probability DOUBLE PRECISION NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    issue_time TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending_review', -- pending_review, approved, suppressed, expired
    lead_time_minutes INTEGER,
    evidence JSONB DEFAULT '[]'::jsonb,
    recommended_action TEXT,
    polygon_geom GEOMETRY(Polygon, 4326)
);

-- 18. Alert Reviews (Human-in-the-Loop Audit Trail)
CREATE TABLE IF NOT EXISTS alert_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id VARCHAR(50) REFERENCES alerts(id) ON DELETE CASCADE,
    reviewer_name VARCHAR(150) NOT NULL,
    action VARCHAR(50) NOT NULL, -- approve, suppress, escalate, false_alarm
    notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. Replay Cases
CREATE TABLE IF NOT EXISTS replay_cases (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    hazard_category VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT,
    peak_intensity VARCHAR(100),
    max_lead_time_min INTEGER
);

-- 20. Replay Frames
CREATE TABLE IF NOT EXISTS replay_frames (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id VARCHAR(50) REFERENCES replay_cases(id) ON DELETE CASCADE,
    step_minute INTEGER NOT NULL,
    frame_time TIMESTAMP WITH TIME ZONE NOT NULL,
    radar_dbz_url TEXT,
    forecast_polygon GEOMETRY(Polygon, 4326),
    observed_polygon GEOMETRY(Polygon, 4326),
    position_error_km DOUBLE PRECISION
);

-- 21. Data Source Health
CREATE TABLE IF NOT EXISTS data_source_health (
    source_key VARCHAR(50) PRIMARY KEY,
    source_name VARCHAR(100) NOT NULL,
    data_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'healthy', -- healthy, delayed, unavailable
    last_successful_update TIMESTAMP WITH TIME ZONE,
    expected_cadence_minutes INTEGER NOT NULL,
    current_delay_minutes INTEGER DEFAULT 0,
    coverage_area VARCHAR(100),
    quality_score DOUBLE PRECISION DEFAULT 1.0,
    fallback_source VARCHAR(100),
    last_error_message TEXT
);

-- 22. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for GIS and rapid nowcasting lookups
CREATE INDEX IF NOT EXISTS idx_storm_centroid ON storm_cells(centroid_lat, centroid_lon);
CREATE INDEX IF NOT EXISTS idx_hazard_forecast_lookup ON hazard_forecasts(run_id, location_id, horizon_minutes);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status, valid_until);
CREATE INDEX IF NOT EXISTS idx_lightning_time ON lightning_observations(strike_time);
