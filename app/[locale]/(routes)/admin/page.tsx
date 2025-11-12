import Link from "next/link";

import { getUser } from "@/actions/get-user";

import { Button } from "@/components/ui/button";
import Container from "../components/ui/Container";

import GptCard from "./_components/GptCard";
import ResendCard from "./_components/ResendCard";
import OpenAiCard from "./_components/OpenAiCard";

const AdminPage = async () => {
  const user = await getUser();

  if (!user?.is_admin) {
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
      title="Administração"
      description="Aqui você pode configurar sua instância do Balako Digital CRM"
    >
      <div className="space-x-2">
        <Button asChild>
          <Link href="/admin/users">Administração de Usuários</Link>
        </Button>
        <Button asChild>
          <Link href="/admin/modules">Administração de Módulos</Link>
        </Button>
      </div>
      <div className="flex flex-row flex-wrap space-y-2 md:space-y-0 gap-2">
        <GptCard />
        <ResendCard />
        <OpenAiCard />
      </div>
    </Container>
  );
};

export default AdminPage;
