import { getUser } from "@/actions/get-user";

import Container from "../components/ui/Container";
import { NotionForm } from "./components/NotionForm";
import { ProfileForm } from "./components/ProfileForm";
import { PasswordChangeForm } from "./components/PasswordChange";
import { ProfilePhotoForm } from "./components/ProfilePhotoForm";

import H4Title from "@/components/typography/h4";
import { OpenAiForm } from "./components/OpenAiForm";

const ProfilePage = async () => {
  const data = await getUser();

  if (!data) {
    return <div>Nenhum dado de usuário encontrado.</div>;
  }

  return (
    <Container
      title="Perfil"
      description="Aqui você pode editar seu perfil de usuário"
    >
      <div>
        {/*         <pre>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre> */}
        <H4Title>Foto de Perfil</H4Title>
        <ProfilePhotoForm data={data} />

        <H4Title>Perfil</H4Title>
        <ProfileForm data={data} />

        <H4Title>Alterar Senha</H4Title>
        <PasswordChangeForm userId={data.id} />

        <H4Title>Integração Notion</H4Title>
        <NotionForm userId={data.id} />

        <H4Title>Integração OpenAI</H4Title>
        <OpenAiForm userId={data.id} />
      </div>
    </Container>
  );
};

export default ProfilePage;
