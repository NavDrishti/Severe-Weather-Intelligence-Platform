# NavDrishti AI — Android Mobile Application

Hyperlocal severe-weather intelligence and convective nowcasting mobile application for Android.

Built with **React Native + Expo (TypeScript)**, **Expo Location**, **React Navigation**, and integrated directly with the **NavDrishti AI Core API** and **Open-Meteo High-Resolution Atmospheric Sounding**.

---

## 1. Core Product Principle

> **"The user should not need to understand how NavDrishti AI works. They should simply open the app and immediately understand whether their current location is safe or at risk."**

- **Where am I?** 📍 Automatic GPS location detected on app open (e.g., *Pune, Maharashtra*).
- **What is the current risk?** **HIGH RISK** • Thunderstorm approaching • Expected in 35–50 min.
- **What is the weather?** Vital metrics only: 28°C Temperature, 74% Humidity, 44 km/h Wind Gusts.
- **What should I do?** *Stay indoors and avoid open areas.*
- **Action:** `[ View Live Map ]`

---

## 2. Project Structure

```text
mobile/
├── App.tsx                     # App entry point, Providers & Bottom Tabs
├── app.json                    # Expo config & Android permissions
├── eas.json                    # EAS build configuration (produces direct APK)
├── tsconfig.json               # TypeScript configuration
├── assets/                     # App launcher icons and splash screens
├── android/                    # Generated native Android Gradle project
└── src/
    ├── api/
    │   ├── client.ts           # Base URL routing (LAN IP, Emulator 10.0.2.2, Web)
    │   ├── weatherApi.ts       # Live Open-Meteo convective weather endpoint
    │   ├── riskApi.ts          # Backend /forecast, /storms/active, /arrival
    │   └── alertsApi.ts        # Backend /alerts, /warnings
    ├── services/
    │   ├── locationService.ts  # Expo Location GPS detection & reverse geocoding
    │   ├── storageService.ts   # AsyncStorage offline caching & delayed data tracker
    │   └── translationService.ts # Instant bilingual dictionary (English & Hindi)
    ├── context/
    │   ├── WeatherContext.tsx  # Central weather, location, risk & refresh state
    │   └── LanguageContext.tsx # English / Hindi toggle context
    ├── screens/
    │   ├── HomeScreen.tsx      # Location-first primary focal screen
    │   ├── MapScreen.tsx       # Live GIS radar reflectivity & storm cells map
    │   ├── ForecastScreen.tsx  # 0–6 hour clean risk progression timeline
    │   └── AlertsScreen.tsx    # Official Warnings vs AI Nowcast alerts
    ├── components/
    │   ├── RiskCard.tsx        # High-contrast focal risk level card
    │   ├── WeatherMetrics.tsx  # Temperature, humidity, wind indicators
    │   ├── LocationHeader.tsx  # Brand header, location, refresh, language toggle
    │   ├── DelayedDataBanner.tsx # "Data may be delayed • Last updated X min ago"
    │   ├── PermissionPrompt.tsx # Location access request card
    │   └── LoadingState.tsx    # "Detecting your location..." / "Checking risk..."
    └── theme/
        └── colors.ts           # Slate/Teal emergency palette with WCAG contrast
```

---

## 3. Endpoints & Data Integration

The mobile application connects to the exact same endpoints used by the NavDrishti web application:

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `http://<HOST>:8000/api/v1/forecast?lat={lat}&lon={lon}` | GET | Convective risk calculation, hazards, storm arrival ETA |
| `http://<HOST>:8000/api/v1/storms/active` | GET | Active convective storm cells, intensity (dBZ), speed, direction, track corridors |
| `http://<HOST>:8000/api/v1/alerts` | GET | Active emergency alerts and official warnings |
| `https://api.open-meteo.com/v1/forecast` | GET | Live real-time surface observations, gusts, pressure, and CAPE energy |
| `https://api.rainviewer.com/public/weather-maps.json` | GET | Live composite Doppler weather radar tiles |

---

## 4. How to Run Locally

### Step 1: Ensure Backend is Running
From the repository root:
```bash
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

### Step 2: Start the Mobile Dev Server
Navigate into the `mobile` directory:
```bash
cd mobile
npm start
```

### Step 3: Run on Android
- **On Physical Android Device:**
  1. Install **Expo Go** from Google Play Store.
  2. Make sure your phone is connected to the same Wi-Fi network as your PC.
  3. Scan the QR code displayed in the terminal.
- **On Android Emulator:**
  Press `a` in the terminal to launch on the running emulator.

---

## 5. How to Build the Android APK

### Option A: Standalone APK via EAS Build (Recommended)
1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Build direct APK for sideloading/installing on any Android device:
   ```bash
   eas build -p android --profile preview
   ```
   *This automatically generates the `.apk` file ready to install on Android phones.*

### Option B: Local Native Gradle Build
If you have the Android SDK installed:
```bash
cd mobile/android
./gradlew assembleRelease
```
The output APK will be generated at:
`mobile/android/app/build/outputs/apk/release/app-release.apk`

---

## 6. Android Permissions

Declared in `mobile/app.json` and compiled into `AndroidManifest.xml`:
- `ACCESS_FINE_LOCATION`: For accurate GPS latitude/longitude detection.
- `ACCESS_COARSE_LOCATION`: For cell-tower/Wi-Fi rough location fallback.
- `INTERNET`: For connecting to backend API and live weather services.

---

## 7. Offline & Poor Network Resilience

When network connectivity is weak or lost during adverse weather:
1. The app loads the **last valid cached result** from persistent `AsyncStorage`.
2. A clear amber status banner is displayed:
   `Data may be delayed • Last updated 8 min ago`
3. A **[ Refresh ]** button allows immediate reconnection as soon as network is restored.
4. Old data is never falsely presented as live.

---

## 8. Bilingual Support (English & Hindi)

Tap the language toggle in the top-right corner of the app:
- **English**: LOW / MODERATE / HIGH / SEVERE RISK, "Stay indoors and avoid open areas."
- **हिन्दी**: कम / मध्यम / उच्च / गंभीर जोखिम, "घर के अंदर रहें और खुले स्थानों से बचें।"
