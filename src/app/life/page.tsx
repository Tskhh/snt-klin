import { Card } from "@/components/ui/Card";

export default function LifePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-4 text-4xl font-bold">Жизнь СНТ</h1>
      <p className="mb-10 text-lg text-gray-600">
        Мероприятия, общие работы и то, как меняется наше товарищество.
      </p>

      <section id="gallery" className="mb-12 scroll-mt-24">
        <h2 className="mb-4 text-2xl font-bold">Фотогалерея мероприятий</h2>
        <Card>
          <p className="text-gray-600">
            Скоро здесь появятся фото с общих собраний, праздников и встреч соседей.
          </p>
        </Card>
      </section>

      <section id="achievements" className="mb-12 scroll-mt-24">
        <h2 className="mb-4 text-2xl font-bold">Наши достижения (Было / Стало)</h2>
        <Card>
          <p className="text-gray-600">
            Дороги, освещение, озеленение — расскажем, что уже сделано и что планируется.
          </p>
        </Card>
      </section>

      <section id="subbotnik" className="scroll-mt-24">
        <h2 className="mb-4 text-2xl font-bold">Архив субботников</h2>
        <Card>
          <p className="text-gray-600">
            Отчёты и фото с прошлых субботников появятся в этом разделе.
          </p>
        </Card>
      </section>
    </div>
  );
}
