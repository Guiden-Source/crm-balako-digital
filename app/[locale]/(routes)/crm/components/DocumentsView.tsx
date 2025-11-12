"use client";

// Temporariamente desabilitado - módulo de documentos removido
// import { columns } from "@/app/[locale]/(routes)/documents/components/columns";
// import { DocumentsDataTable } from "@/app/[locale]/(routes)/documents/components/data-table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

interface DocumentsViewProps {
  data: any;
}

const DocumentsView = ({ data }: DocumentsViewProps) => {
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
              Documentos
            </CardTitle>
            <CardDescription>Módulo em desenvolvimento</CardDescription>
          </div>
          <div className="flex space-x-2"></div>
        </div>
        <Separator />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Nenhum documento encontrado. Este módulo será implementado em breve.
        </p>
      </CardContent>
    </Card>
  );
};

export default DocumentsView;
