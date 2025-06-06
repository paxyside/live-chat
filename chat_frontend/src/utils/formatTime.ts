export const formatTime = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
};

export const formatDateTime = (iso: string): string => {
  const date = new Date(iso);
  const day = date.toLocaleDateString("ru-RU");
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${time} | ${day}`;
};
