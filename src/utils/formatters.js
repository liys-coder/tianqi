const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export function getDayName(dateString) {
  const date = new Date(dateString);
  return DAY_NAMES[date.getDay()];
}

export function formatDay(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return '今天';
  if (date.toDateString() === tomorrow.toDateString()) return '明天';
  return DAY_NAMES[date.getDay()];
}

export function formatDate(date) {
  const dayName = DAY_NAMES[date.getDay()];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${dayName} · ${month}月${day}日`;
}

export function getTodayString() {
  const now = new Date();
  const dayName = DAY_NAMES[now.getDay()];
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `${dayName} · ${month}月${day}日`;
}

