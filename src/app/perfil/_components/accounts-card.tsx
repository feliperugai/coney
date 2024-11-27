import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { type Account } from "~/server/db/tables/accounts";

interface AccountCardProps {
  accounts: Account[];
}

export function AccountsCard({ accounts }: AccountCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contas Vinculadas</CardTitle>
      </CardHeader>
      <CardContent>
        {accounts && accounts.length > 0 ? (
          <ul className="space-y-2">
            {accounts.map((account) => (
              <li key={account.type} className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://authjs.dev/img/providers/${account.provider}.svg`}
                    alt={`${account.provider} icon`}
                  />
                  <AvatarFallback>
                    {account.provider[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{account.provider}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma conta vinculada.</p>
        )}
      </CardContent>
    </Card>
  );
}
