const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export function getDayName(dateString) {
  const date = new Date(dateString);
  return DAY_NAMES[date.getDay()];
}

export function formatDay(dateString) {
  return getDayName(dateString);
}

export function getTodayString() {
  const now = new Date();
  const dayName = DAY_NAMES[now.getDay()];
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `${dayName} · ${month}月${day}日`;
}

