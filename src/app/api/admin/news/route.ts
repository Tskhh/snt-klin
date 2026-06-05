import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { isAdmin } from "@/lib/jwt";
import { slugify } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(3, "Заголовок слишком короткий"),
  excerpt: z.string().optional(),
  body: z.string().min(10, "Текст новости слишком короткий"),
  category: z.enum(["news", "announcement"]),
  isPinned: z.boolean().optional(),
  isEmergency: z.boolean().optional(),
});

async function uniqueSlug(base: string) {
  let slug = slugify(base) || "novost";
  let attempt = 0;
  while (await prisma.news.findUnique({ where: { slug } })) {
    attempt += 1;
    slug = `${slugify(base)}-${attempt}`;
  }
  return slug;
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  try {
    const data = schema.parse(await request.json());
    const slug = await uniqueSlug(data.title);

    const news = await prisma.news.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt || null,
        body: data.body,
        category: data.category,
        isPinned: data.isPinned ?? false,
        isEmergency: data.isEmergency ?? false,
        authorId: session.id,
        publishedAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: "news.create",
        entity: "News",
        entityId: news.id,
        payload: JSON.stringify({ title: news.title }),
      },
    });

    return NextResponse.json({ ok: true, id: news.id, slug: news.slug });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
