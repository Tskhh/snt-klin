import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Card title="Вход в личный кабинет">
        <Suspense fallback={<p>Загрузка...</p>}>
          <LoginForm />
        </Suspense>
      </Card>
    </div>
  );
}
