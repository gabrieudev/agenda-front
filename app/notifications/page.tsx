import { ProtectedRoute } from "@/components/protected-route";

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Notificações</h1>
          <p className="text-muted-foreground">
            Você não tem nenhuma notificação ainda.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
