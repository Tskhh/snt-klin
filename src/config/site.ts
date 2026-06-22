export const SITE = {
  shortName: "СНТ «Клин»",
  fullName: "Садовое некоммерческое товарищество «Клин»",
  slogan: "СНТ «Клин»: всё для садовода в один клик.",
  sloganSub: "Переход к новому формату общения!",
  email: "snt.klin@mail.ru",
  address: {
    zip: "141650",
    region: "Московская область",
    city: "г. о. Клин",
    village: "деревня Макшеево",
    name: "СНТ «Клин»",
  },
  officeHours: "будние дни, 11:00–19:00",
  officeNote:
    "По любым волнующим вопросам пишите в личные сообщения или звоните в будние дни с 11:00 до 19:00. Звонки в другое время — только в экстренных случаях.",
} as const;

export type BoardMember = {
  role: string;
  name: string;
  plot?: string;
  phone: string;
  tel: string;
};

export const BOARD: BoardMember[] = [
  {
    role: "Председатель",
    name: "Кузьмина Анастасия Александровна",
    plot: "участок 104",
    phone: "+7 926 488-94-47",
    tel: "+79264889447",
  },
  {
    role: "Правление",
    name: "Калягина Елена Викторовна",
    plot: "участок 110",
    phone: "+7 916 576-60-32",
    tel: "+79165766032",
  },
  {
    role: "Правление",
    name: "Толстых Андрей Николаевич",
    plot: "участок 105",
    phone: "+7 925 740-87-27",
    tel: "+79257408727",
  },
  {
    role: "Правление",
    name: "Ерчева Ольга Сергеевна",
    plot: "участок 91",
    phone: "+7 910 556-22-16",
    tel: "+79105562216",
  },
  {
    role: "Правление",
    name: "Смирнов Дмитрий Викторович",
    plot: "участок 142",
    phone: "+7 910 661-79-75",
    tel: "+79106617975",
  },
];

/** Участки СНТ: 1–205 и 219 */
export const PLOT_NUMBERS: string[] = [
  ...Array.from({ length: 205 }, (_, i) => String(i + 1)),
  "219",
];

export function formatAddress(): string {
  const a = SITE.address;
  return `${a.zip}\n${a.region},\n${a.city},\n${a.village},\n${a.name}`;
}

export function formatAddressInline(): string {
  const a = SITE.address;
  return `${a.zip}, ${a.region}, ${a.city}, ${a.village}, ${a.name}`;
}
