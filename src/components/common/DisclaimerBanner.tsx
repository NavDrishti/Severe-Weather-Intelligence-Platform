import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <aside className="disclaimer-strip" role="complementary" aria-label="Official Disclaimer">
      <AlertTriangle size={15} className="alert-symbol" />
      <span>
        <strong>Demonstration data — Not an official warning.</strong> Forecasts are AI-assisted probabilistic decision support and do not replace statutory advisories issued by IMD or disaster management authorities.
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
