import React from "react";
import Container from "../../components/ui/Container";
import { getTasks } from "@/actions/projects/get-tasks";
import { TasksDataTable } from "./components/data-table";
import { columns } from "./components/columns";

import { Button } from "@/components/ui/button";

const TasksPage = async () => {
  const tasks: any = await getTasks();

  return (
    <Container
      title="Todas as Tarefas"
      description="Tudo que você precisa saber sobre suas tarefas"
    >
      <div className="py-5">
        <Button>Nova Tarefa</Button>
      </div>
      <div>
        <TasksDataTable data={tasks} columns={columns} />
      </div>
    </Container>
  );
};

export default TasksPage;
