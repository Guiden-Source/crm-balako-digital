import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";
import Container from "../../../components/ui/Container";
import { getAccountsTasks } from "@/actions/crm/account/get-tasks";
import { getUserCRMTasks } from "@/actions/crm/tasks/get-user-tasks";

const UserCRMDashboard = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const task = await getUserCRMTasks(session.user.id);

  return (
    <div>
      <Container
        title={`${session.user.name} | Dashboard CRM (em desenvolvimento)`}
        description="Seus dados de vendas em um só lugar"
      >
        <div className="grid grid-cols-2 w-full ">
          <div className="">Visão Geral de Ligações</div>
          <div className="">
            <h1>Tarefas nas Empresas</h1>
            <pre>{JSON.stringify(task, null, 2)}</pre>
          </div>
          <div className="">Visão Geral de Reuniões</div>
          <div className="">
            <h1></h1>
          </div>
          <div className="">Visão Geral de Leads</div>
          <div className="">
            <h1></h1>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default UserCRMDashboard;
