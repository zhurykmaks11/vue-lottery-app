// Валідаційні константи (перенесені з вашого коду)
export const emailRegex = /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/
export const phoneRegex = /^[+()0-9\s-]{6,}$/
export const flexiblePhoneRegex = /^\+380\d{9}$/;// Валідація дати в майбутньому
export function isFutureDate(dateStr: string): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const today = new Date()
  d.setHours(0,0,0,0)
  today.setHours(0,0,0,0)
  return d > today
}
// Функція для генерації простого унікального ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
export function isTooOldDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const minDate = new Date('1900-01-01'); // Мінімально дозволена дата
  return d < minDate;
}


