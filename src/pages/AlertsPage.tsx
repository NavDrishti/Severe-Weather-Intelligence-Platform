import React, { useState } from 'react';
import { MOCK_ALERTS } from '../data/mockData';
import { AlertItem } from '../types/weather';
import { AlertReviewModal } from '../components/alerts/AlertReviewModal';
import { ShieldAlert, CheckCircle, Ban, Clock, Filter, AlertTriangle, UserCheck, MessageSquare } from 'lucide-react';
import { reviewAlert } from '../api/client';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'suppressed' | 'all'>('pending');
  const [reviewingAlert, setReviewingAlert] = useState<AlertItem | null>(null);

  const handleReviewSubmit = async (alertId: string, action: string, notes: string) => {
    await reviewAlert(alertId, action, 'Duty Officer', notes);
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: action as any, notes, reviewer: 'Duty Officer (Reviewed)' } : a))
    );
  };

  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === 'pending') return a.status === 'pending_review';
    if (activeTab === 'approved') return a.status === 'approved';
    if (activeTab === 'suppressed') return a.status === 'suppressed';
    return true;
  });

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Operational Alert Centre</h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Human-in-the-Loop decision verification and emergency advisory approval for disaster management
        </p>
      </div>

      {/* Mandatory Prototype Banner */}
      <div
        style={{
          background: 'var(--status-amber-bg)',
          border: '1px solid var(--status-amber)',
          color: 'var(--status-amber)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <AlertTriangle size={20} style={{ flexShrink: 0 }} />
        <div>
          <strong>Operational Workflow Notice:</strong> Alert approval and dissemination shown in this interface are simulated prototypes. In operational deployment, approved alerts pass to the National Disaster Management Authority (NDMA) Common Alerting Protocol (CAP) and IMD SMS gateway.
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
        {[
          { id: 'pending', label: `Pending Review (${alerts.filter(a => a.status === 'pending_review').length})` },
          { id: 'approved', label: `Approved / Disseminated (${alerts.filter(a => a.status === 'approved').length})` },
          { id: 'suppressed', label: `Suppressed (${alerts.filter(a => a.status === 'suppressed').length})` },
          { id: 'all', label: `All Historical (${alerts.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: activeTab === tab.id ? 700 : 500,
              background: activeTab === tab.id ? 'var(--brand-teal)' : 'var(--bg-subtle)',
              color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredAlerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
            No alerts found in category '{activeTab}'.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`alert-card severity-${alert.severity_code}`}
              style={{ background: 'var(--bg-surface)' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.75rem', color: 'var(--brand-teal)' }}>
                    {alert.id}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: alert.severity_code === 'red' ? '#FEE2E2' : (alert.severity_code === 'orange' ? '#FEF3C7' : '#FEF9C3'),
                      color: alert.severity_code === 'red' ? '#C53030' : (alert.severity_code === 'orange' ? '#B7791F' : '#854D0E')
                    }}
                  >
                    {alert.severity}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Valid: {new Date(alert.valid_until).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {alert.title}
                </h3>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Target Zone: <strong>{alert.affected_area}</strong>
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', lineHeight: 1.4 }}>
                  <strong>Recommended Operational Action:</strong> {alert.recommended_action}
                </div>

                {alert.evidence && alert.evidence.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    <strong>Sensor Evidence:</strong>
                    {alert.evidence.map((ev, i) => (
                      <span key={i}>• {ev}</span>
                    ))}
                  </div>
                )}

                {alert.notes && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--brand-teal)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MessageSquare size={13} />
                    <span>Reviewer Audit Note: {alert.notes}</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '16px', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>Probability: <strong>{(alert.probability * 100).toFixed(0)}%</strong></span>
                  <span>Confidence: <strong>{(alert.confidence * 100).toFixed(0)}%</strong></span>
                  <span>Lead Time: <strong>{alert.lead_time_min} min</strong></span>
                  <span>Reviewer: <strong>{alert.reviewer}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '130px' }}>
                <button
                  onClick={() => setReviewingAlert(alert)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--brand-blue)',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <UserCheck size={14} />
                  <span>Review Alert</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      <AlertReviewModal
        alert={reviewingAlert}
        onClose={() => setReviewingAlert(null)}
        onSubmitReview={handleReviewSubmit}
      />
    </div>
  );
};
