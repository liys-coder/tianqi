const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export function getDayName(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return DAY_NAMES[date.getDay()];
}

export function formatDay(dateString) {
  // 强制使用 Asia/Shanghai 时区，避免用户本地时区偏差导致日期比较错误
  const shanghaiFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const today = new Date();
  const tomorrow = new Date(today);

  // 转换为上海时区的日期字符串进行比较
  const todayStr = shanghaiFormatter.format(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = shanghaiFormatter.format(tomorrow);

  // API 返回的日期格式为 YYYY-MM-DD，直接比较
  const apiDate = dateString; // 格式: 2026-05-05
  if (apiDate === todayStr) return '今天';
  if (apiDate === tomorrowStr) return '明天';

  const date = new Date(dateString + 'T00:00:00');
  return DAY_NAMES[date.getDay()];
}

export function formatDate(date) {
  // 强制使用 Asia/Shanghai 时区显示
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
  return formatter.format(date).replace(',', ' ·');
}

export function getTodayString() {
  const now = new Date();
  const dayName = DAY_NAMES[now.getDay()];
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `${dayName} · ${month}月${day}日`;
}

export function formatHour(timeString) {
  const date = new Date(timeString);
  return `${String(date.getHours()).padStart(2, '0')}:00`;
}

