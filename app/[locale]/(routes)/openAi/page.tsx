import { prismadb } from "@/lib/prisma";
import Container from "../components/ui/Container";
import Chat from "./components/Chat";

import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

const ProfilePage = async () => {
  const user = await getServerSession(authOptions);

  const openAiKeyUser = await prismadb.openAi_keys.findFirst({
    where: {
      user: user?.user?.id,
    },
  });

  const openAiKeySystem = await prismadb.systemServices.findFirst({
    where: {
      name: "openAiKey",
    },
  });

  //console.log(openAiKeySystem, "openAiKeySystem");

  if (process.env.OPENAI_API_KEY && !openAiKeyUser && !openAiKeySystem)
    return (
      <Container
        title="Assistente IA"
        description="Pergunte qualquer coisa que você precise saber"
      >
        <div>
          <h1>Chave OpenAI não encontrada</h1>
          <p>
            Por favor, adicione sua chave OpenAI em
            <Link href={"/profile"} className="text-blue-500">
              {" "}configurações de perfil{" "}
            </Link>
            para usar o assistente
          </p>
        </div>
      </Container>
    );

  return (
    <Container
      title="Assistente IA"
      description="Pergunte qualquer coisa que você precise saber"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Chat />
      </Suspense>
    </Container>
  );
};

export default ProfilePage;
