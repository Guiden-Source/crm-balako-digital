import React from "react";
import { getServerSession } from "next-auth";

import { columns } from "./components/Columns";
import { DataTable } from "./components/data-table";
import Container from "../../components/ui/Container";

import { authOptions } from "@/lib/auth";
import { getModules } from "@/actions/get-modules";

const AdminModulesPage = async () => {
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

  const modules: any = await getModules();
  return (
    <Container
      title="Administração de Módulos"
      description="Aqui você pode gerenciar os módulos do Balako Digital CRM"
    >
      <DataTable columns={columns} data={modules} search="name" />
    </Container>
  );
};

export default AdminModulesPage;
