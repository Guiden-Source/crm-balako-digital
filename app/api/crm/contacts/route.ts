import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sendEmail from "@/lib/sendmail";
import { getRoleBasedFilters, isAgency, getUserRole } from "@/lib/auth-helpers";

//Get all contacts route - with role-based filtering
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Verificar autenticação
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Você precisa estar autenticado para acessar este recurso" },
        { status: 401 }
      );
    }

    const userRole = getUserRole(session);
    console.log(`[GET_CONTACTS] User role: ${userRole}, User ID: ${session.user.id}`);

    // Aplicar filtros baseados no role
    const roleFilters = getRoleBasedFilters(session);

    const contacts = await prismadb.crm_Contacts.findMany({
      where: {
        ...roleFilters, // Se client, filtra por ownerId automaticamente
      },
      include: {
        assigned_to_user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        crate_by_user: {
          select: {
            id: true,
            name: true,
          },
        },
        assigned_accounts: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Log para debug
    if (isAgency(session)) {
      console.log(`[GET_CONTACTS] Agency view - returned ${contacts.length} contacts`);
    } else {
      console.log(`[GET_CONTACTS] Client view - returned ${contacts.length} contacts for user ${session.user.id}`);
    }

    return NextResponse.json(
      {
        contacts,
        meta: {
          total: contacts.length,
          role: userRole,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET_CONTACTS_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Erro ao buscar contatos" },
      { status: 500 }
    );
  }
}

//Create route
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Verificar autenticação
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Você precisa estar autenticado para criar contatos" },
        { status: 401 }
      );
    }

    const userRole = getUserRole(session);
    const body = await req.json();
    const userId = session.user.id;

    if (!body) {
      return new NextResponse("No form data", { status: 400 });
    }

    const {
      assigned_to,
      assigned_account,
      birthday_day,
      birthday_month,
      birthday_year,
      description,
      email,
      personal_email,
      first_name,
      last_name,
      office_phone,
      mobile_phone,
      website,
      status,
      social_twitter,
      social_facebook,
      social_linkedin,
      social_skype,
      social_instagram,
      social_youtube,
      social_tiktok,
      type,
    } = body;

    const newContact = await prismadb.crm_Contacts.create({
      data: {
        v: 0,
        createdBy: userId,
        updatedBy: userId,
        ...(assigned_account !== null && assigned_account !== undefined
          ? {
              assigned_accounts: {
                connect: {
                  id: assigned_account,
                },
              },
            }
          : {}),
        assigned_to_user: {
          connect: {
            id: assigned_to,
          },
        },
        birthday: birthday_day + "/" + birthday_month + "/" + birthday_year,
        description,
        email,
        personal_email,
        first_name,
        last_name,
        office_phone,
        mobile_phone,
        website,
        status,
        social_twitter,
        social_facebook,
        social_linkedin,
        social_skype,
        social_instagram,
        social_youtube,
        social_tiktok,
        type,
      },
    });

    if (assigned_to !== userId) {
      const notifyRecipient = await prismadb.users.findFirst({
        where: {
          id: assigned_to,
        },
      });

      if (!notifyRecipient) {
        return new NextResponse("No user found", { status: 400 });
      }

      await sendEmail({
        from: process.env.EMAIL_FROM as string,
        to: notifyRecipient.email || "info@softbase.cz",
        subject:
          notifyRecipient.userLanguage === "en"
            ? `New contact ${first_name} ${last_name} has been added to the system and assigned to you.`
            : `Nový kontakt ${first_name} ${last_name} byla přidána do systému a přidělena vám.`,
        text:
          notifyRecipient.userLanguage === "en"
            ? `New contact ${first_name} ${last_name} has been added to the system and assigned to you. You can click here for detail: ${process.env.NEXT_PUBLIC_APP_URL}/crm/contacts/${newContact.id}`
            : `Nový kontakt ${first_name} ${last_name} byla přidán do systému a přidělena vám. Detaily naleznete zde: ${process.env.NEXT_PUBLIC_APP_URL}/crm/contact/${newContact.id}`,
      });
    }

    console.log(`[CREATE_CONTACT] Created by user ${userId} with role: ${userRole}`);
    return NextResponse.json({ newContact }, { status: 200 });
  } catch (error) {
    console.error("[NEW_CONTACT_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Erro ao criar contato" },
      { status: 500 }
    );
  }
}

//Update route
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Verificar autenticação
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Você precisa estar autenticado para atualizar contatos" },
        { status: 401 }
      );
    }
    const body = await req.json();
    const userId = session.user.id;
    const userRole = getUserRole(session);

    if (!body) {
      return NextResponse.json(
        { error: "Bad Request", message: "Dados do formulário não fornecidos" },
        { status: 400 }
      );
    }

    const {
      id,
      assigned_account,
      assigned_to,
      birthday_day,
      birthday_month,
      birthday_year,
      description,
      email,
      personal_email,
      first_name,
      last_name,
      office_phone,
      mobile_phone,
      website,
      status,
      social_twitter,
      social_facebook,
      social_linkedin,
      social_skype,
      social_instagram,
      social_youtube,
      social_tiktok,
      type,
    } = body;

    console.log(assigned_account, "assigned_account");

    // Verificar se o contato existe
    const existingContact = await prismadb.crm_Contacts.findUnique({
      where: { id },
      select: {
        id: true,
        assigned_to: true,
      },
    });

    if (!existingContact) {
      return NextResponse.json(
        { error: "Not Found", message: "Contato não encontrado" },
        { status: 404 }
      );
    }

    // Verificar permissão - clientes só podem editar seus próprios contatos
    if (!isAgency(session) && existingContact.assigned_to !== userId) {
      return NextResponse.json(
        { error: "Forbidden", message: "Você não tem permissão para editar este contato" },
        { status: 403 }
      );
    }

    const newContact = await prismadb.crm_Contacts.update({
      where: {
        id,
      },
      data: {
        v: 0,
        updatedBy: userId,
        //Update assigned_accountsIDs only if assigned_account is not empty
        ...(assigned_account !== null && assigned_account !== undefined
          ? {
              assigned_accounts: {
                connect: {
                  id: assigned_account,
                },
              },
            }
          : {}),
        assigned_to_user: {
          connect: {
            id: assigned_to,
          },
        },
        birthday: birthday_day + "/" + birthday_month + "/" + birthday_year,
        description,
        email,
        personal_email,
        first_name,
        last_name,
        office_phone,
        mobile_phone,
        website,
        status,
        social_twitter,
        social_facebook,
        social_linkedin,
        social_skype,
        social_instagram,
        social_youtube,
        social_tiktok,
        type,
      },
    });

    /*     if (assigned_to !== userId) {
      const notifyRecipient = await prismadb.users.findFirst({
        where: {
          id: assigned_to,
        },
      });

      if (!notifyRecipient) {
        return new NextResponse("No user found", { status: 400 });
      }

      await sendEmail({
        from: process.env.EMAIL_FROM as string,
        to: notifyRecipient.email || "info@softbase.cz",
        subject:
          notifyRecipient.userLanguage === "en"
            ? `New contact ${first_name} ${last_name} has been added to the system and assigned to you.`
            : `Nový kontakt ${first_name} ${last_name} byla přidána do systému a přidělena vám.`,
        text:
          notifyRecipient.userLanguage === "en"
            ? `New contact ${first_name} ${last_name} has been added to the system and assigned to you. You can click here for detail: ${process.env.NEXT_PUBLIC_APP_URL}/crm/contacts/${newContact.id}`
            : `Nový kontakt ${first_name} ${last_name} byla přidán do systému a přidělena vám. Detaily naleznete zde: ${process.env.NEXT_PUBLIC_APP_URL}/crm/contact/${newContact.id}`,
      });
    } */

    console.log(`[UPDATE_CONTACT] Updated by user ${userId} with role: ${userRole}`);
    return NextResponse.json({ newContact }, { status: 200 });
  } catch (error) {
    console.error("[UPDATE_CONTACT_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Erro ao atualizar contato" },
      { status: 500 }
    );
  }
}

//Delete route - ONLY for agencies
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Verificar autenticação
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Você precisa estar autenticado para deletar contatos" },
        { status: 401 }
      );
    }

    // Apenas agências podem deletar contatos
    if (!isAgency(session)) {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "Apenas agências têm permissão para deletar contatos",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get("id");

    if (!contactId) {
      return NextResponse.json(
        { error: "Bad Request", message: "ID do contato não fornecido" },
        { status: 400 }
      );
    }

    // Verificar se o contato existe
    const existingContact = await prismadb.crm_Contacts.findUnique({
      where: { id: contactId },
    });

    if (!existingContact) {
      return NextResponse.json(
        { error: "Not Found", message: "Contato não encontrado" },
        { status: 404 }
      );
    }

    // Deletar contato
    await prismadb.crm_Contacts.delete({
      where: { id: contactId },
    });

    console.log(
      `[DELETE_CONTACT] Contact ${contactId} deleted by agency user ${session.user.id}`
    );

    return NextResponse.json(
      { success: true, message: "Contato deletado com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE_CONTACT_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Erro ao deletar contato" },
      { status: 500 }
    );
  }
}
