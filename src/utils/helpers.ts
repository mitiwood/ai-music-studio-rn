export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ':' + s.toString().padStart(2, '0');
}

export function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return '\ubc29\uae08 \uc804';
  if (min < 60) return min + '\ubd84 \uc804';
  const hr = Math.floor(min / 60);
  if (hr < 24) return hr + '\uc2dc\uac04 \uc804';
  const day = Math.floor(hr / 24);
  if (day < 30) return day + '\uc77c \uc804';
  return new Date(date).toLocaleDateString('ko-KR');
}

export function truncate(s: string, len: number): string {
  return s.length > len ? s.slice(0, len) + '...' : s;
}

export function ensureHttps(url: string): string {
  if (!url) return url;
  return url.replace(/^http:/, 'https:');
}

export function randomId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
