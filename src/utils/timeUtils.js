// утилита для времени приготовления

export const formatCookingTime = (totalMinutes) => {
  if (!totalMinutes || totalMinutes <= 0 || isNaN(totalMinutes)) return 'Время не указано';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours > 0 ? `${hours} ч ` : ''}${minutes} мин`;
};
