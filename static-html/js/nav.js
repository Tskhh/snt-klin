/** Выпадающее меню — единая структура для всех страниц */
const SITE_NAV = [
  {
    label: "Доска объявлений",
    subtitle: "Новости",
    href: "news.html",
    children: [
      { label: "Оперативные сообщения от правления", href: "news.html#pravlenie" },
      { label: "Графики отключений и работ", href: "news.html#otklucheniya" },
      { label: "Объявления от садоводов", href: "news.html#sadovody" },
    ],
  },
  {
    label: "Мои платежи",
    subtitle: "Личный кабинет",
    href: "login.html",
    hrefLoggedIn: "cabinet.html#pay",
    children: [
      { label: "Членские взносы", href: "cabinet.html#membership" },
      { label: "Целевые взносы", href: "cabinet.html#target" },
      { label: "Оплата электроэнергии", href: "cabinet.html#electricity" },
      { label: "Реквизиты для оплаты", href: "cabinet.html#requisites" },
    ],
  },
  {
    label: "Уставные документы",
    href: "documents.html",
    children: [
      { label: "Устав СНТ", href: "documents.html#ustav" },
      { label: "Протоколы общих собраний", href: "documents.html#protocols" },
      { label: "Приходно-расходная смета", href: "documents.html#budget" },
      { label: "Отчёты ревизионной комиссии", href: "documents.html#revision" },
      { label: "Правила внутреннего распорядка", href: "documents.html#rules" },
    ],
  },
  {
    label: "Контакты",
    href: "contacts.html",
    children: [
      { label: "Председатель (часы приёма)", href: "contacts.html#chairman" },
      { label: "Бухгалтерия", href: "contacts.html#accounting" },
      { label: "Охрана / КПП", href: "contacts.html#security" },
      { label: "Аварийные службы", href: "contacts.html#emergency" },
      { label: "Карта проезда", href: "contacts.html#map" },
    ],
  },
  {
    label: "Жизнь СНТ",
    href: "life.html",
    children: [
      { label: "Фотогалерея мероприятий", href: "life.html#gallery" },
      { label: "Наши достижения (Было / Стало)", href: "life.html#achievements" },
      { label: "Архив субботников", href: "life.html#subbotnik" },
    ],
  },
];

function getSessionQuick() {
  try {
    return JSON.parse(localStorage.getItem("snt_session") || "null");
  } catch {
    return null;
  }
}

function renderSiteNav(container) {
  if (!container) return;

  const session = getSessionQuick();
  const navToggleId = "nav-mobile-toggle";

  let html =
    '<button type="button" class="nav-burger" id="' +
    navToggleId +
    '" aria-label="Меню" aria-expanded="false">☰</button>';
  html += '<ul class="nav-menu">';

  SITE_NAV.forEach(function (item) {
    const mainHref =
      item.label === "Мои платежи" && session
        ? item.hrefLoggedIn || item.href
        : item.href;
    const sub = item.subtitle
      ? '<span class="nav-item-sub">' + item.subtitle + "</span>"
      : "";

    html += '<li class="nav-item has-dropdown">';
    html +=
      '<a href="' +
      mainHref +
      '" class="nav-item-link">' +
      item.label +
      sub +
      ' <span class="nav-chevron" aria-hidden="true">▾</span></a>';
    html += '<ul class="nav-dropdown">';
    item.children.forEach(function (child) {
      html +=
        '<li><a href="' + child.href + '">' + child.label + "</a></li>";
    });
    html += "</ul></li>";
  });

  html += "</ul>";

  container.innerHTML = html;
  container.classList.add("nav-ready");

  const burger = document.getElementById(navToggleId);
  if (burger) {
    burger.addEventListener("click", function () {
      const open = container.classList.toggle("nav-mobile-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.textContent = open ? "✕" : "☰";
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  renderSiteNav(document.getElementById("site-nav"));
});
