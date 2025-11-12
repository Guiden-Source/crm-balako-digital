import { prismadb } from "@/lib/prisma";

export const getTaskDocuments = async (taskId: string) => {
  // Módulo documents temporariamente desabilitado
  return [];
  
  // const data = await prismadb.documents.findMany({
  //   where: {
  //     tasksIDs: {
  //       has: taskId,
  //     },
  //   },
  //   include: {
  //     created_by: {
  //       select: {
  //         name: true,
  //       },
  //     },
  //     assigned_to_user: {
  //       select: {
  //         name: true,
  //       },
  //     },
  //   },
  // });
  // return data;
};
