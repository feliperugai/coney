"use client";

import { type User } from "next-auth";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";
import { AccountsCard } from "./accounts-card";
import { EditNameModal } from "./modal";
import { ProfileSkeleton } from "./skeleton";

interface ProfilePageProps {
  user: User;
}

export default function ProfilePage({ user }: ProfilePageProps) {
  const [userName, setUserName] = useState(user.name ?? "");
  const { data: accounts, isLoading: isLoadingAccounts } =
    api.accounts.getUserAccounts.useQuery(user.id!);

  if (isLoadingAccounts) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Perfil do Usuário</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informações do Usuário</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user.image ?? undefined}
                alt={user.name ?? "Avatar do usuário"}
              />
              <AvatarFallback>{userName?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-2xl font-semibold">{userName}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>

              <EditNameModal
                currentName={userName}
                onNameUpdate={(newName) => setUserName(newName)}
              />
            </div>
          </CardContent>
        </Card>
        <AccountsCard accounts={accounts ?? []} />
      </div>
    </div>
  );
}
