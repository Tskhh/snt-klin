import { getResidentContext } from "@/lib/user-data";
import { Card } from "@/components/ui/Card";
import { statusLabel } from "@/lib/utils";

export default async function ProfilePage() {
  const ctx = await getResidentContext();
  if (!ctx) return null;

  const { session, user, plot } = ctx;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Профиль</h1>
      <Card>
        <dl className="space-y-4 text-lg">
          <div>
            <dt className="text-sm text-gray-500">ФИО</dt>
            <dd className="font-semibold">{user.fullName}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Email</dt>
            <dd className="font-semibold">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Телефон</dt>
            <dd className="font-semibold">{user.phone}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Статус</dt>
            <dd className="font-semibold">{statusLabel(user.status)}</dd>
          </div>
          {plot && (
            <div>
              <dt className="text-sm text-gray-500">Участок</dt>
              <dd className="font-semibold">№ {plot.number}, {plot.areaSqm} м²</dd>
            </div>
          )}
        </dl>
      </Card>
    </div>
  );
}
