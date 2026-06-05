import "dotenv/config";
import { createPrismaClient } from "../src/lib/create-prisma";
import bcrypt from "bcryptjs";

const prisma = createPrismaClient();

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.ticketMessage.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.voteBallot.deleteMany();
  await prisma.voteOption.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.paymentAllocation.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.charge.deleteMany();
  await prisma.meterReading.deleteMany();
  await prisma.meter.deleteMany();
  await prisma.userPlot.deleteMany();
  await prisma.plot.deleteMany();
  await prisma.user.deleteMany();
  await prisma.news.deleteMany();
  await prisma.document.deleteMany();
  await prisma.outage.deleteMany();
  await prisma.tariff.deleteMany();
  await prisma.siteSetting.deleteMany();

  const passwordHash = await bcrypt.hash("admin123", 12);

  const superAdmin = await prisma.user.create({
    data: {
      email: "admin@snt-klin.ru",
      phone: "+79001234567",
      fullName: "Иванов Иван Иванович",
      passwordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      emailVerifiedAt: new Date(),
    },
  });

  const residentHash = await bcrypt.hash("resident123", 12);

  const resident = await prisma.user.create({
    data: {
      email: "petrov@example.ru",
      phone: "+79007654321",
      fullName: "Петров Пётр Петрович",
      passwordHash: residentHash,
      role: "RESIDENT",
      status: "ACTIVE",
      emailVerifiedAt: new Date(),
    },
  });

  const plots = [];
  for (let i = 1; i <= 20; i++) {
    plots.push(
      await prisma.plot.create({
        data: {
          number: String(i),
          areaSqm: 600 + i * 10,
          status: i <= 15 ? "ACTIVE" : "VACANT",
          balance: i === 5 ? -4500 : i === 8 ? -1200 : 0,
        },
      })
    );
  }

  const plot1 = plots[0];
  await prisma.userPlot.create({
    data: {
      userId: resident.id,
      plotId: plot1.id,
      isPrimary: true,
      approvedAt: new Date(),
    },
  });

  await prisma.userPlot.create({
    data: {
      userId: superAdmin.id,
      plotId: plots[1].id,
      isPrimary: true,
      approvedAt: new Date(),
    },
  });

  const elecMeter = await prisma.meter.create({
    data: { plotId: plot1.id, type: "ELECTRICITY", serialNumber: "EL-001", lastReading: 1250 },
  });
  const waterMeter = await prisma.meter.create({
    data: { plotId: plot1.id, type: "WATER", serialNumber: "W-001", lastReading: 340 },
  });

  const period = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;

  await prisma.meterReading.create({
    data: {
      meterId: elecMeter.id,
      period,
      value: 1285,
      consumption: 35,
      status: "APPROVED",
      submittedById: resident.id,
      reviewedById: superAdmin.id,
      reviewedAt: new Date(),
    },
  });

  await prisma.meter.update({
    where: { id: elecMeter.id },
    data: { lastReading: 1285 },
  });

  await prisma.tariff.createMany({
    data: [
      {
        type: "MEMBERSHIP",
        name: "Членский взнос",
        pricePerUnit: 150,
        unit: "per_sotka",
        validFrom: new Date("2025-01-01"),
      },
      {
        type: "ELECTRICITY",
        name: "Электричество",
        pricePerUnit: 6.5,
        unit: "kwh",
        validFrom: new Date("2025-01-01"),
      },
      {
        type: "WATER",
        name: "Вода",
        pricePerUnit: 45,
        unit: "cubic_meter",
        validFrom: new Date("2025-01-01"),
      },
    ],
  });

  await prisma.charge.createMany({
    data: [
      {
        plotId: plot1.id,
        period,
        type: "MEMBERSHIP",
        amount: 900,
        description: `Членский взнос за ${period}`,
        status: "ISSUED",
      },
      {
        plotId: plot1.id,
        period,
        type: "ELECTRICITY",
        amount: 227.5,
        description: "Электричество: 35 кВт·ч",
        status: "ISSUED",
      },
    ],
  });

  await prisma.plot.update({
    where: { id: plot1.id },
    data: { balance: -1127.5 },
  });

  await prisma.news.createMany({
    data: [
      {
        title: "Добро пожаловать на сайт СНТ «Клин»",
        slug: "dobro-pozhalovat",
        excerpt: "Запущен новый сайт с личными кабинетами для жителей.",
        body: "Уважаемые садоводы! Мы запустили обновлённый сайт СНТ «Клин». Теперь вы можете передавать показания счётчиков, оплачивать взносы и получать новости онлайн.\n\nДля входа зарегистрируйтесь и дождитесь подтверждения администратором.",
        category: "news",
        isPinned: true,
        authorId: superAdmin.id,
      },
      {
        title: "Срок сдачи показаний — до 28 числа",
        slug: "srok-pokazanij",
        excerpt: "Не забудьте передать показания электричества и воды.",
        body: "Напоминаем: показания счётчиков принимаются с 20 по 28 число каждого месяца. Приложите фото счётчика для ускорения проверки.",
        category: "announcement",
        isPinned: true,
        authorId: superAdmin.id,
      },
      {
        title: "Плановое отключение воды 25 мая",
        slug: "otkluchenie-vody",
        excerpt: "С 10:00 до 14:00 — ремонт магистрали.",
        body: "25 мая с 10:00 до 14:00 будет отключена холодная вода на участках 1–50 в связи с ремонтом магистрали. Приносим извинения за неудобства.",
        category: "announcement",
        isEmergency: false,
        authorId: superAdmin.id,
      },
    ],
  });

  await prisma.document.createMany({
    data: [
      { title: "Устав СНТ «Клин»", category: "charter", accessLevel: "PUBLIC", fileUrl: "#" },
      { title: "Тарифы на 2025 год", category: "tariffs", accessLevel: "PUBLIC", fileUrl: "#" },
      { title: "Инструкция по передаче показаний", category: "instructions", accessLevel: "PUBLIC", fileUrl: "#" },
      { title: "Протокол общего собрания №12", category: "protocols", accessLevel: "RESIDENTS", fileUrl: "#" },
    ],
  });

  await prisma.outage.create({
    data: {
      title: "Отключение воды — ремонт",
      description: "Участки 1–50, холодная вода",
      startsAt: new Date("2026-05-25T10:00:00"),
      endsAt: new Date("2026-05-25T14:00:00"),
      type: "water",
    },
  });

  await prisma.siteSetting.createMany({
    data: [
      { key: "site_name", value: "СНТ «Клин»" },
      { key: "phone", value: "+7 (495) 123-45-67" },
      { key: "email", value: "info@snt-klin.ru" },
      { key: "address", value: "Московская область, д. Клин, СНТ «Клин»" },
      { key: "chairman", value: "Иванов Иван Иванович" },
      { key: "reading_day_start", value: "20" },
      { key: "reading_day_end", value: "28" },
    ],
  });

  const vote = await prisma.vote.create({
    data: {
      title: "Установка видеонаблюдения на въезде",
      description: "Голосование за установку камер на центральном въезде. Стоимость — 120 000 ₽ из фонда СНТ.",
      status: "ACTIVE",
      startsAt: new Date("2026-05-01"),
      endsAt: new Date("2026-06-30"),
      quorumPercent: 50,
      options: {
        create: [
          { label: "За" },
          { label: "Против" },
          { label: "Воздержался" },
        ],
      },
    },
  });

  await prisma.notification.create({
    data: {
      userId: resident.id,
      title: "Передайте показания",
      body: "До 28 числа необходимо передать показания счётчиков в личном кабинете.",
    },
  });

  console.log("Seed completed!");
  console.log("Admin: admin@snt-klin.ru / admin123");
  console.log("Resident: petrov@example.ru / resident123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
