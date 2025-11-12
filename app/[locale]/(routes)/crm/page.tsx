import { Suspense } from "react";
import Container from "../components/ui/Container";
import MainPageView from "./components/MainPageView";
import SuspenseLoading from "@/components/loadings/suspense";

const CrmPage = async () => {
  return (
    <Container
      title="CRM"
      description="Tudo que você precisa saber sobre vendas"
    >
      {/*
      TODO: Pensar em como lidar com o carregamento de dados para melhorar a UX com suspense
      */}
      <Suspense fallback={<SuspenseLoading />}>
        <MainPageView />
      </Suspense>
    </Container>
  );
};

export default CrmPage;
