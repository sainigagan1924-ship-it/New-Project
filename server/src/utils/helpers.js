export function parseDuration(isoDuration) {
  if (!isoDuration) return { formatted: '00:00', seconds: 0 };
  if (typeof isoDuration === 'number') {
    const hours = Math.floor(isoDuration / 3600);
    const minutes = Math.floor((isoDuration % 3600) / 60);
    const secs = isoDuration % 60;
    if (hours > 0) {
      return {
        formatted: `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
        seconds: isoDuration
      };
    }
    return {
      formatted: `${minutes}:${secs.toString().padStart(2, '0')}`,
      seconds: isoDuration
    };
  }

  // Parse ISO 8601 like PT1H2M10S or PT8H12M34S or PT45M
  const matches = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) {
    return { formatted: isoDuration, seconds: 0 };
  }
  const hours = parseInt(matches[1] || 0, 10);
  const minutes = parseInt(matches[2] || 0, 10);
  const seconds = parseInt(matches[3] || 0, 10);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  if (hours > 0) {
    return {
      formatted: `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      seconds: totalSeconds
    };
  }
  return {
    formatted: `${minutes}:${seconds.toString().padStart(2, '0')}`,
    seconds: totalSeconds
  };
}

export function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  const n = Number(num);
  if (isNaN(n)) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString();
}

export function formatTimeAgo(dateString) {
  if (!dateString) return 'recently';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'just now';
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

