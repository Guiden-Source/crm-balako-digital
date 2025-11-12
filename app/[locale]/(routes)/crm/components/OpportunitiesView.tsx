"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Temporariamente desabilitado - módulo de oportunidades removido
// import { columns } from "../opportunities/table-components/columns";
// import { NewOpportunityForm } from "../opportunities/components/NewOpportunityForm";
// import { OpportunitiesDataTable } from "../opportunities/table-components/data-table";

const OpportunitiesView = ({
  data,
  crmData,
  accountId,
}: {
  data: any;
  crmData: any;
  accountId?: string;
}) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <div>
            <CardTitle className="cursor-pointer">
              Oportunidades
            </CardTitle>
            <CardDescription>Módulo em desenvolvimento</CardDescription>
          </div>
          <div className="flex space-x-2"></div>
        </div>
        <Separator />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Nenhuma oportunidade encontrada. Este módulo será implementado em breve.
        </p>
      </CardContent>
    </Card>
  );
};

export default OpportunitiesView;
