import { format } from "date-fns";
import { ru } from "date-fns/locale";

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "d MMMM yyyy", { locale: ru });
}

export function formatDateTime(date: Date | string) {
  return format(new Date(date), "d MMMM yyyy, HH:mm", { locale: ru });
}

const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh",
  з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c",
  ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

export function slugify(text: string) {
  const latin = text
    .toLowerCase()
    .split("")
    .map((ch) => TRANSLIT[ch] ?? ch)
    .join("");

  const slug = latin
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || `novost-${Date.now()}`;
}

export function currentPeriod() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function readingDeadlineDay() {
  return 28;
}

export function statusLabel(status: string) {
  const map: Record<string, string> = {
    PENDING: "Ожидает подтверждения",
    ACTIVE: "Активен",
    BLOCKED: "Заблокирован",
    SUBMITTED: "На проверке",
    APPROVED: "Принято",
    REJECTED: "Отклонено",
    NEW: "Новое",
    IN_PROGRESS: "В работе",
    ANSWERED: "Отвечено",
    CLOSED: "Закрыто",
    ISSUED: "Выставлено",
    PAID: "Оплачено",
    PARTIALLY_PAID: "Частично оплачено",
    DRAFT: "Черновик",
    CANCELLED: "Отменено",
  };
  return map[status] || status;
}
