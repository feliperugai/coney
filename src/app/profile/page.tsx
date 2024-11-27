import { auth } from "~/server/auth";
import ProfilePage from "./_components/client";

export default async function ServerProfilePage() {
  const session = await auth();

  if (!session) {
    return <div>Acesso negado. Por favor, faça login.</div>;
  }

  return <ProfilePage user={session.user} />;
}
