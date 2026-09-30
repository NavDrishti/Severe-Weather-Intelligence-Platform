import React, { useState } from 'react';
import { AlertItem } from '../../types/weather';
import { X, CheckCircle, Ban, AlertOctagon, HelpCircle } from 'lucide-react';

interface AlertReviewModalProps {
  alert: AlertItem | null;
  onClose: () => void;
  onSubmitReview: (alertId: string, action: string, notes: string) => void;
}

export const AlertReviewModal: React.FC<AlertReviewModalProps> = ({
  alert,
  onClose,
  onSubmitReview
}) => {
  const [action, setAction] = useState<'approved' | 'suppressed' | 'escalated' | 'false_alarm'>('approved');
  const [notes, setNotes] = useState('');
  const [reviewerName, setReviewerName] = useState('Duty Meteorologist / SDMA Lead');

  if (!alert) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReview(alert.id, action, notes);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--brand-teal)', fontFamily: 'monospace' }}>
              {alert.id}
            </span>
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginTop: '2px' }}>
              Human-in-the-Loop Alert Review
            </h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Prototype Banner */}
        <div
          style={{
            background: 'var(--status-amber-bg)',
            border: '1px solid var(--status-amber)',
            color: 'var(--status-amber)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--font-xs)',
            lineHeight: 1.4
          }}
        >
          <strong>Operational Decision Support Workflow:</strong> Alert approval and dissemination are simulated unless connected to an authorized IMD/NDMA Common Alerting Protocol (CAP) warning system.
        </div>

        {/* Alert Details Summary */}
        <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-sm)' }}>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{alert.title}</div>
          <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Target Area: <strong>{alert.affected_area}</strong>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
            <span>Probability: <strong>{(alert.probability * 100).toFixed(0)}%</strong></span>
            <span>Confidence: <strong>{(alert.confidence * 100).toFixed(0)}%</strong></span>
            <span>Lead Time: <strong>{alert.lead_time_min} min</strong></span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-xs)', fontWeight: 600, marginBottom: '6px' }}>
              Review Action
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { id: 'approved', label: 'Approve & Issue Warning', icon: <CheckCircle size={14} />, color: '#16803C' },
                { id: 'suppressed', label: 'Suppress / Low Impact', icon: <Ban size={14} />, color: '#64748B' },
                { id: 'escalated', label: 'Escalate to Chief Met', icon: <AlertOctagon size={14} />, color: '#C53030' },
                { id: 'false_alarm', label: 'Mark False Alarm', icon: <HelpCircle size={14} />, color: '#B7791F' }
              ].map((btn) => (
                <button
                  type="button"
                  key={btn.id}
                  onClick={() => setAction(btn.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: action === btn.id ? `2px solid ${btn.color}` : '1px solid var(--border-color)',
                    background: action === btn.id ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--font-xs)',
                    fontWeight: action === btn.id ? 700 : 500,
                    textAlign: 'left'
                  }}
                >
                  <span style={{ color: btn.color }}>{btn.icon}</span>
                  <span>{btn.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-xs)', fontWeight: 600, marginBottom: '4px' }}>
              Reviewer Name & Designation
            </label>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: 'var(--font-sm)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-xs)', fontWeight: 600, marginBottom: '4px' }}>
              Operational Justification / Audit Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Cross-referenced with Pashan AWS gust speed 52 km/h and radar VIL core. Convective initiation verified."
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: 'var(--font-sm)',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontSize: 'var(--font-sm)',
                color: 'var(--text-secondary)'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--brand-blue)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: 'var(--font-sm)'
              }}
            >
              Commit Decision to Audit Trail
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
