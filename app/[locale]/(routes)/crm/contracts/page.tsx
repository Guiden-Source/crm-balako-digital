import React, { Suspense } from "react";
import Container from "../../components/ui/Container";
import SuspenseLoading from "@/components/loadings/suspense";
import { getAllCrmData } from "@/actions/crm/get-crm-data";
import { getContractsWithIncludes } from "@/actions/crm/get-contracts";
import ContractsView from "../components/ContractsView";

const ContractsPage = async () => {
  const crmData = await getAllCrmData();
  const contracts = await getContractsWithIncludes();
  return (
    <Container
      title="Contratos"
      description="Tudo que você precisa saber sobre seus contratos"
    >
      <Suspense fallback={<SuspenseLoading />}>
        <ContractsView crmData={crmData} data={contracts} />
      </Suspense>
    </Container>
  );
};

export default ContractsPage;
