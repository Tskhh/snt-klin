export type NavItem = {
  label: string;
  subtitle?: string;
  href: string;
  children: { label: string; href: string }[];
};

export const SITE_NAV: NavItem[] = [
  {
    label: "Доска объявлений",
    subtitle: "Новости",
    href: "/news",
    children: [
      { label: "Оперативные сообщения от правления", href: "/news#pravlenie" },
      { label: "Графики отключений и работ", href: "/outages" },
      { label: "Объявления от садоводов", href: "/news#sadovody" },
    ],
  },
  {
    label: "Мои платежи",
    subtitle: "Личный кабинет",
    href: "/login",
    children: [
      { label: "Членские взносы", href: "/cabinet/billing#membership" },
      { label: "Целевые взносы", href: "/cabinet/billing#target" },
      { label: "Оплата электроэнергии", href: "/cabinet/billing#electricity" },
      { label: "Реквизиты для оплаты", href: "/cabinet/billing#requisites" },
    ],
  },
  {
    label: "Уставные документы",
    href: "/documents",
    children: [
      { label: "Устав СНТ", href: "/documents#ustav" },
      { label: "Протоколы общих собраний", href: "/documents#protocols" },
      { label: "Приходно-расходная смета", href: "/documents#budget" },
      { label: "Отчёты ревизионной комиссии", href: "/documents#revision" },
      { label: "Правила внутреннего распорядка", href: "/documents#rules" },
    ],
  },
  {
    label: "Контакты",
    href: "/contacts",
    children: [
      { label: "Председатель (часы приёма)", href: "/contacts#chairman" },
      { label: "Бухгалтерия", href: "/contacts#accounting" },
      { label: "Охрана / КПП", href: "/contacts#security" },
      { label: "Аварийные службы", href: "/contacts#emergency" },
      { label: "Карта проезда", href: "/contacts#map" },
    ],
  },
  {
    label: "Жизнь СНТ",
    href: "/life",
    children: [
      { label: "Фотогалерея мероприятий", href: "/life#gallery" },
      { label: "Наши достижения (Было / Стало)", href: "/life#achievements" },
      { label: "Архив субботников", href: "/life#subbotnik" },
    ],
  },
];
