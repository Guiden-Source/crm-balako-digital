import { getUsers } from "@/actions/get-users";
import React from "react";
import Container from "../../components/ui/Container";
import { InviteForm } from "./components/IviteForm";
import { Separator } from "@/components/ui/separator";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminUserDataTable } from "./table-components/data-table";
import { columns } from "./table-components/columns";
import { Button } from "@/components/ui/button";
import SendMailToAll from "./components/send-mail-to-all";

const AdminUsersPage = async () => {
  const users = await getUsers();

  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return (
      <Container
        title="Administração"
        description="Você não é administrador, acesso não permitido"
      >
        <div className="flex w-full h-full items-center justify-center">
          Acesso não permitido
        </div>
      </Container>
    );
  }

  return (
    <Container
      title="Administração de Usuários"
      description="Gerencie os usuários do Balako Digital CRM"
    >
      <div className="flex-col1">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Convidar novo usuário para o Balako Digital CRM
        </h4>
        <InviteForm />
      </div>
      <Separator />
      <div>
        <SendMailToAll />
      </div>
      <Separator />

      <AdminUserDataTable columns={columns} data={users} />
    </Container>
  );
};

export default AdminUsersPage;
