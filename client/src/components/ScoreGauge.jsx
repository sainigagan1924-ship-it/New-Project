import React from 'react';

export function ScoreGauge({ score = 85, size = 'md', showClassification = true, classification = '' }) {
  let colorClass = 'text-emerald-600 border-emerald-500';
  let bgClass = 'bg-emerald-50';
  let badgeColor = 'bg-emerald-100 text-emerald-800';

  if (score >= 90) {
    colorClass = 'text-emerald-600 border-emerald-500';
    bgClass = 'bg-emerald-50/60';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  } else if (score >= 80) {
    colorClass = 'text-emerald-600 border-emerald-500';
    bgClass = 'bg-emerald-50/50';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  } else if (score >= 70) {
    colorClass = 'text-amber-600 border-amber-500';
    bgClass = 'bg-amber-50/50';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
  } else if (score >= 50) {
    colorClass = 'text-orange-500 border-orange-400';
    bgClass = 'bg-orange-50/50';
    badgeColor = 'bg-orange-100 text-orange-800 border-orange-200';
  } else {
    colorClass = 'text-red-500 border-red-400';
    bgClass = 'bg-red-50/50';
    badgeColor = 'bg-red-100 text-red-800 border-red-200';
  }

  const determinedClassification = classification || (
    score >= 90 ? 'Excellent' :
    score >= 80 ? 'Very Good' :
    score >= 70 ? 'Good' :
    score >= 50 ? 'Average' : 'Not Recommended'
  );

  if (size === 'lg') {
    return (
      <div className="flex items-center gap-4">
        <div className={`relative flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 ${colorClass} ${bgClass} shadow-subtle`}>
          <span className="text-3xl font-extrabold tracking-tight text-[#111111]">{score}</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
            {determinedClassification}
          </span>
        </div>
      </div>
    );
  }

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2">
        <span className={`text-base font-bold ${score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
          {score}/100
        </span>
        {showClassification && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${badgeColor}`}>
            {determinedClassification}
          </span>
        )}
      </div>
    );
  }

  // Default medium
  return (
    <div className="flex items-center gap-2">
      <div className={`px-2.5 py-1 rounded-md border text-sm font-bold flex items-center gap-1.5 ${badgeColor}`}>
        <span>{score}/100</span>
        <span className="text-xs font-medium opacity-90">• {determinedClassification}</span>
      </div>
    </div>
  );
}

