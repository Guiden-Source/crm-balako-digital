import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

import Container from "../components/ui/Container";

import NewTask from "./components/NewTask";

import H4Title from "@/components/typography/h4";

import { columns } from "./table-components/columns";
import { SecondBrainDataTable } from "./table-components/data-table";

import { getNotions } from "@/actions/get-notions";
import { getActiveUsers } from "@/actions/get-users";
import { getBoards } from "@/actions/projects/get-boards";
import { Button } from "@/components/ui/button";
import Youtube from "./components/Youtube";

const SecondBrainPage = async () => {
  const notions: any = await getNotions();
  const users: any = await getActiveUsers();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const boards: any = await getBoards(userId!);

  if (!notions || notions.error) {
    return (
      <div>
        <H4Title>
          Notion não está habilitado. Por favor, habilite em seu perfil
        </H4Title>

        <div>
          Como habilitar:
          <ol>1. Registre-se e faça login no Notion.so</ol>
          <ol>
            2. Crie (Clique em duplicar) um novo banco de dados desta fonte -{" "}
            <Link href="http://abdulhadeahmad.notion.site/87bfd5b5862e425d82de6ce47c88a2d4">
              http://abdulhadeahmad.notion.site/87bfd5b5862e425d82de6ce47c88a2d4
            </Link>
          </ol>
          <ol>
            3. Crie uma integração Balako CRM no Notion (
            <a href="https://www.notion.so/my-integrations">
              https://www.notion.so/my-integrations
            </a>
            ) e conecte a nova integração com seu banco de dados clicando em ...
            (três pontos no canto superior direito do banco de dados), encontre sua 
            integração recém-criada e clique nela
          </ol>
          <ol>4. Copie o token de integração</ol>
          <ol>
            5. Cole o token de integração em seu{" "}
            <Link href={"/profile"} className="text-blue-500">
              perfil
            </Link>
          </ol>
          <ol>
            6. Copie o ID do BD Notion (é a primeira string na URL, está em vermelho no
            exemplo) - (https://www.notion.so/
            <span className="text-red-500">
              2e5524886ae743ae8c2e47b9a39df133
            </span>
            ?v=e563b6c36b6649bba29eaad6b4c52ab4)
          </ol>
          <Button asChild className="my-3">
            <Link href="/profile">Habilitar Second Brain</Link>
          </Button>
        </div>
        <div className="w-full ">
          <Youtube />
        </div>
      </div>
    );
  }
  return (
    <>
      <NewTask users={users} boards={boards} />
      <Container
        title="Second Brain"
        description="Tudo que você precisa saber sobre suas anotações no Notion"
      >
        <SecondBrainDataTable columns={columns} data={notions} />
      </Container>
    </>
  );
};

export default SecondBrainPage;
