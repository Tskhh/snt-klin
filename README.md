# СНТ «Клин» — сайт и личные кабинеты

Веб-приложение для садового товарищества: новости, показания счётчиков, начисления, оплата (демо), обращения, голосования, админ-панель.

## Быстрый старт

```bash
cd snt-klin
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## Демо-аккаунты

| Роль | Email | Пароль |
|------|-------|--------|
| Администратор | admin@snt-klin.ru | admin123 |
| Житель | petrov@example.ru | resident123 |

## Возможности MVP

- Публичный сайт: главная, новости, документы, отключения, контакты
- Регистрация жителя с модерацией админом
- Личный кабинет: участок, счётчики, оплата, обращения, голосования
- Админ-панель: пользователи, участки, показания, начисления, обращения
- Демо-оплата (без реального эквайринга)

## Стек

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4
- Prisma 7 + PostgreSQL (Neon)
- JWT-сессии (httpOnly cookie)

## Продакшен (Vercel + Neon)

1. Создайте бесплатную БД на [neon.tech](https://neon.tech) и скопируйте `DATABASE_URL`
2. Войдите в Vercel: `npx vercel login`
3. Запустите деплой:

```powershell
cd snt-klin
.\scripts\deploy.ps1 -DatabaseUrl "postgresql://..." -JwtSecret "ваш-длинный-секрет"
```

Сайт получит постоянную ссылку вида `https://snt-klin.vercel.app`.

Демо-аккаунты после seed: `admin@snt-klin.ru` / `admin123`

## Структура

```
src/app/          — страницы (публичные, cabinet, admin)
src/app/api/      — REST API
src/components/   — UI-компоненты
src/lib/          — prisma, auth, billing
prisma/           — схема БД и seed
```
