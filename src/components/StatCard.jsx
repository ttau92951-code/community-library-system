import React from 'react';

export default function StatCard({ label, value, borderAccent }) {
  return (
    <div className="stat-box" style={{ borderLeftColor: borderAccent || '#2563eb' }}>
      <h3>{label}</h3>
      <p>{value}</p>
    </div>
  );
}