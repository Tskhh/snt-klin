import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Clock } from "lucide-react";

export default function PendingPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <Card>
        <Clock className="mx-auto mb-4 h-16 w-16 text-amber-500" />
        <h1 className="mb-2 text-2xl font-bold">Ожидает подтверждения</h1>
        <p className="mb-6 text-gray-600">
          Ваша регистрация отправлена администратору СНТ. После проверки вы получите
          доступ к личному кабинету. Обычно это занимает 1–2 рабочих дня.
        </p>
        <Button href="/" variant="secondary">
          На главную
        </Button>
      </Card>
    </div>
  );
}
