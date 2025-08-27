function timeAgo(dateString) {
  const past = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now - past) / 1000);

  if (diffSec < 60) return `${diffSec}s`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}hr`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d`;
}
export default timeAgo;
