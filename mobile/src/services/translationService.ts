export type Language = 'en' | 'hi';

export const DICTIONARY: Record<string, { en: string; hi: string }> = {
  // Brand
  'app.name': { en: 'NavDrishti AI', hi: 'नवदृष्टि एआई' },
  'app.subtitle': { en: 'Severe Weather Intelligence', hi: 'तीव्र मौसम आसूचना' },

  // Tabs
  'tab.home': { en: 'Home', hi: 'होम' },
  'tab.map': { en: 'Map', hi: 'नक्शा' },
  'tab.forecast': { en: 'Forecast', hi: 'पूर्वानुमान' },
  'tab.alerts': { en: 'Alerts', hi: 'अलर्ट' },

  // Location & Loading
  'loc.detecting': { en: 'Detecting your location...', hi: 'आपका स्थान खोजा जा रहा है...' },
  'loc.checkingRisk': { en: 'Checking weather risk...', hi: 'मौसम जोखिम की जांच की जा रही है...' },
  'loc.permissionNeeded': { en: 'Location access is needed to show weather risk for your area.', hi: 'आपके क्षेत्र में मौसम जोखिम दिखाने के लिए लोकेशन अनुमति आवश्यक है।' },
  'loc.allowBtn': { en: 'Allow Location', hi: 'लोकेशन की अनुमति दें' },
  'loc.unableToDetect': { en: 'Unable to detect your location.', hi: 'स्थान का पता लगाने में असमर्थ।' },
  'loc.retry': { en: 'Retry', hi: 'पुनः प्रयास करें' },
  'loc.refresh': { en: 'Refresh', hi: 'रिफ्रेश करें' },
  'loc.yourLocation': { en: 'Your Location', hi: 'आपका स्थान' },

  // Risk Levels
  'risk.LOW': { en: 'LOW RISK', hi: 'कम जोखिम' },
  'risk.MODERATE': { en: 'MODERATE RISK', hi: 'मध्यम जोखिम' },
  'risk.HIGH': { en: 'HIGH RISK', hi: 'उच्च जोखिम' },
  'risk.SEVERE': { en: 'SEVERE RISK', hi: 'गंभीर जोखिम' },

  // Risk Headlines
  'headline.safe': { en: 'No immediate severe-weather risk detected.', hi: 'कोई तत्काल गंभीर मौसम जोखिम नहीं पाया गया।' },
  'headline.thunderstorm': { en: 'Thunderstorm approaching', hi: 'तूफान निकट आ रहा है' },
  'headline.hail': { en: 'Hailstorm and high winds expected', hi: 'ओलावृष्टि और तेज हवाओं की संभावना' },
  'headline.cloudburst': { en: 'Severe convective deluge / cloudburst risk', hi: 'अति भारी वर्षा / बादल फटने का खतरा' },
  'headline.downburst': { en: 'Severe squall & downburst winds detected', hi: 'तेज आंधी और विनाशकारी हवाएं सक्रिय' },

  // Safety Advice
  'advice.safe': { en: 'Conditions are currently calm in your area. Safe for normal outdoor activities.', hi: 'वर्तमान में आपके क्षेत्र में स्थिति सामान्य है। सामान्य गतिविधियों के लिए सुरक्षित।' },
  'advice.indoor': { en: 'Stay indoors and avoid open areas.', hi: 'घर के अंदर रहें और खुले स्थानों से बचें।' },
  'advice.shelter': { en: 'Seek immediate sturdy shelter. Unplug sensitive electricals and stay clear of trees.', hi: 'तुरंत पक्के आश्रय में जाएं। पेड़ों और बिजली के खंभों से दूर रहें।' },
  'advice.travel': { en: 'Thunderstorm activity detected nearby. Avoid outdoor travel.', hi: 'आस-पास तूफान की गतिविधि देखी गई है। अनावश्यक यात्रा से बचें।' },
  'advice.flashFlood': { en: 'Avoid low-lying underpasses and waterlogged roads.', hi: 'निचले पुलों और जलभराव वाले रास्तों पर जाने से बचें।' },

  // Weather Metrics
  'weather.temperature': { en: 'Temperature', hi: 'तापमान' },
  'weather.humidity': { en: 'Humidity', hi: 'नमी' },
  'weather.wind': { en: 'Wind Gusts', hi: 'हवा की गति' },
  'weather.rain': { en: 'Rain Rate', hi: 'वर्षा दर' },
  'weather.pressure': { en: 'Pressure', hi: 'वायुदाब' },

  // Map
  'map.viewLive': { en: 'View Live Map', hi: 'लाइव मैप देखें' },
  'map.legend': { en: 'Live Storm Radar & Lightning', hi: 'लाइव स्टॉर्म रडार एवं आकाशीय बिजली' },
  'map.yourPosition': { en: 'You are here', hi: 'आप यहाँ हैं' },
  'map.activeStorms': { en: 'Active Storm Cells', hi: 'सक्रिय तूफान' },

  // Forecast
  'forecast.title': { en: '0–6 Hour Weather Outlook', hi: '0–6 घंटे का मौसम दृष्टिकोण' },
  'forecast.now': { en: 'Now', hi: 'अभी' },
  'forecast.hourly': { en: 'Hourly Risk Timeline', hi: 'घंटेवार जोखिम समयरेखा' },

  // Alerts
  'alerts.title': { en: 'Active Weather Warnings', hi: 'सक्रिय मौसम चेतावनियाँ' },
  'alerts.official': { en: 'OFFICIAL WARNING', hi: 'आधिकारिक चेतावनी' },
  'alerts.aiNowcast': { en: 'AI RISK NOWCAST', hi: 'एआई जोखिम पूर्वानुमान' },
  'alerts.noAlerts': { en: 'No active weather alerts for your area.', hi: 'आपके क्षेत्र के लिए कोई सक्रिय मौसम चेतावनी नहीं है।' },
  'alerts.disclaimer': { en: 'Official warnings sourced from IMD/NDMA bulletins. AI nowcast provides rapid decision support.', hi: 'आधिकारिक चेतावनियाँ आईएमडी/एनडीएमए द्वारा जारी की जाती हैं।' },

  // Network & Delay
  'network.delayed': { en: 'Data may be delayed', hi: 'डेटा में देरी हो सकती है' },
  'network.lastUpdated': { en: 'Last updated', hi: 'अंतिम अपडेट' },
  'network.minAgo': { en: 'min ago', hi: 'मिनट पहले' },
  'network.justNow': { en: 'Just now', hi: 'अभी-अभी' },
  'network.error': { en: 'Weather information is temporarily unavailable.', hi: 'मौसम की जानकारी अस्थायी रूप से अनुपलब्ध है।' }
};

export function t(key: string, lang: Language): string {
  const item = DICTIONARY[key];
  if (!item) return key;
  return item[lang] || item.en || key;
}
