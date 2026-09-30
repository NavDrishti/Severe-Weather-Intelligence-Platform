import React, { useState } from 'react';
import { useLanguage } from '../../context/useLanguage';
import { AlertTriangle, X } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const { t } = useLanguage();

  if (!visible) return null;

  return (
    <aside className="disclaimer-strip" role="complementary" aria-label="Official Disclaimer">
      <AlertTriangle size={15} className="alert-symbol" />
      <span>
        <strong>{t('disclaimer.bold', 'Demonstration data — Not an official warning.')}</strong>{' '}
        {t('disclaimer.body', 'Forecasts are AI-assisted probabilistic decision support and do not replace statutory advisories issued by IMD or disaster management authorities.')}
      </span>
      <button
        onClick={() => setVisible(false)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
          color: 'var(--text-muted)'
        }}
        title="Dismiss notice"
        aria-label="Dismiss disclaimer banner"
      >
        <X size={14} />
      </button>
    </aside>
  );
};
