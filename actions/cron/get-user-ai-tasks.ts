"use server";

import dayjs from "dayjs";
import axios from "axios";

import { prismadb } from "@/lib/prisma";
import resendHelper from "@/lib/resend";
import AiTasksReportEmail from "@/emails/AiTasksReport";

export async function getUserAiTasks(session: any) {
  /*
  Resend.com function init - this is a helper function that will be used to send emails
  */
  const resend = await resendHelper();

  const today = dayjs().startOf("day");
  const nextWeek = dayjs().add(7, "day").startOf("day");

  let prompt = "";

  const user = await prismadb.users.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) return { message: "No user found" };

  const getTaskPastDue = await prismadb.tasks.findMany({
    where: {
      AND: [
        {
          user: session.user.id,
          taskStatus: "ACTIVE",
          dueDateAt: {
            lte: new Date(),
          },
        },
      ],
    },
  });

  const getTaskPastDueInSevenDays = await prismadb.tasks.findMany({
    where: {
      AND: [
        {
          user: session.user.is,
          taskStatus: "ACTIVE",
          dueDateAt: {
            //lte: dayjs().add(7, "day").toDate(),
            gt: today.toDate(), // Due date is greater than or equal to today
            lt: nextWeek.toDate(), // Due date is less than next week (not including today)
          },
        },
      ],
    },
  });

  if (!getTaskPastDue || !getTaskPastDueInSevenDays) {
    return { message: "No tasks found" };
  }

  // Sistema configurado apenas para Português do Brasil
  prompt = `Olá, sou o assistente virtual da ${process.env.NEXT_PUBLIC_APP_URL}.
  \n\n
  Existem ${getTaskPastDue.length} tarefas atrasadas e ${
    getTaskPastDueInSevenDays.length
  } tarefas a vencer nos próximos 7 dias.
  \n\n
  Detalhes das tarefas de hoje: ${JSON.stringify(getTaskPastDue, null, 2)}
  \n\n
  Detalhes das tarefas dos próximos 7 dias: ${JSON.stringify(
    getTaskPastDueInSevenDays,
    null,
    2
  )}
  \n\n
  Como assistente pessoal, escreva uma mensagem para lembrar as tarefas e faça um resumo detalhado. Não se esqueça de enviar vibrações positivas e motivação.
  \n\n
  O resultado final deve estar em formato MDX e em português do Brasil.
  `;

  if (!prompt) return { message: "No prompt found" };

  const getAiResponse = await axios
    .post(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/openai/create-chat-completion`,
      {
        prompt: prompt,
        userId: session.user.id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => res.data);

  //console.log(getAiResponse, "getAiResponse");
  //console.log(getAiResponse.response.message.content, "getAiResponse");

  //skip if api response is error
  if (getAiResponse.error) {
    console.log("Error from OpenAI API");
  } else {
    try {
      const data = await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: user.email!,
        subject: `${process.env.NEXT_PUBLIC_APP_NAME} OpenAI Project manager assistant from: ${process.env.NEXT_PUBLIC_APP_URL}`,
        text: getAiResponse.response.message.content,
        react: AiTasksReportEmail({
          username: session.user.name,
          avatar: session.user.avatar,
          userLanguage: session.user.userLanguage,
          data: getAiResponse.response.message.content,
        }),
      });
      //console.log(data, "Email sent");
    } catch (error) {
      console.log(error, "Error from get-user-ai-tasks");
    }
  }

  return { user: user.email };
}
