import React from 'react';

export function ProgressBar({ label, value = 0, maxValue = 100, showLabel = true, height = 'h-2', color = 'emerald' }) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / maxValue) * 100)));

  let barBg = 'bg-emerald-500';
  if (value < 50) barBg = 'bg-orange-500';
  else if (value < 70) barBg = 'bg-amber-500';

  if (color === 'brand') barBg = 'bg-brand-600';

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-gray-700 mb-1">
          <span className="truncate pr-2 text-gray-600">{label}</span>
          <span className="font-semibold text-gray-900 shrink-0">{value}/100</span>
        </div>
      )}
      <div className={`w-full bg-[#EAEAEA] rounded-full overflow-hidden ${height}`}>
        <div
          className={`${barBg} ${height} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

