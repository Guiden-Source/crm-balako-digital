import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sendEmail from "@/lib/sendmail";

export async function POST(req: Request, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  try {
    const user = await prismadb.users.update({
      where: {
        id: params.userId,
      },
      data: {
        userStatus: "ACTIVE",
      },
    });

    // Sistema configurado apenas para Português do Brasil
    const message = `Sua conta no ${process.env.NEXT_PUBLIC_APP_NAME} foi ativada! \n\n Seu nome de usuário é: ${user.email} \n\n Por favor, faça login em ${process.env.NEXT_PUBLIC_APP_URL} \n\n Obrigado! \n\n ${process.env.NEXT_PUBLIC_APP_NAME}`;

    await sendEmail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Invitation to ${process.env.NEXT_PUBLIC_APP_NAME}`,
      text: message,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_ACTIVATE_POST]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}
