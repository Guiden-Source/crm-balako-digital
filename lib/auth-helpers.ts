import { Session } from "next-auth";

/**
 * Roles disponíveis no sistema Balako Digital CRM
 */
export enum UserRole {
  AGENCY = "agency",
  CLIENT = "client",
}

/**
 * Erro customizado para quando o usuário não possui permissões adequadas
 */
export class UnauthorizedError extends Error {
  constructor(message: string = "Você não tem permissão para acessar este recurso") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Verifica se o usuário possui role de "agency" (agência)
 * 
 * Agências têm acesso total ao sistema, incluindo:
 * - Visualizar TODOS os contatos de TODOS os clientes
 * - CRUD completo em qualquer recurso
 * - Enviar WhatsApp para qualquer contato
 * - Dashboard completo com todas as métricas
 * 
 * @param session - Sessão do NextAuth contendo dados do usuário
 * @returns true se o usuário for uma agência, false caso contrário
 * 
 * @example
 * ```typescript
 * const session = await getServerSession(authOptions);
 * if (isAgency(session)) {
 *   // Usuário tem acesso de agência
 *   const allContacts = await prisma.contacts.findMany();
 * }
 * ```
 */
export function isAgency(session: Session | null): boolean {
  if (!session?.user) {
    return false;
  }
  return session.user.role === UserRole.AGENCY;
}

/**
 * Verifica se o usuário possui role de "client" (cliente)
 * 
 * Clientes têm acesso limitado ao sistema:
 * - Visualizam APENAS seus próprios contatos (filtrados por ownerId)
 * - Podem editar apenas seus próprios registros
 * - Não podem deletar dados
 * - Dashboard simplificado com apenas seus números
 * 
 * @param session - Sessão do NextAuth contendo dados do usuário
 * @returns true se o usuário for um cliente, false caso contrário
 * 
 * @example
 * ```typescript
 * const session = await getServerSession(authOptions);
 * if (isClient(session)) {
 *   // Usuário tem acesso de cliente
 *   const myContacts = await prisma.contacts.findMany({
 *     where: { ownerId: session.user.id }
 *   });
 * }
 * ```
 */
export function isClient(session: Session | null): boolean {
  if (!session?.user) {
    return false;
  }
  return session.user.role === UserRole.CLIENT;
}

/**
 * Verifica se o usuário é uma agência e lança erro caso não seja
 * 
 * Use esta função em rotas/actions que devem ser acessíveis APENAS por agências
 * 
 * @param session - Sessão do NextAuth contendo dados do usuário
 * @throws {UnauthorizedError} Se o usuário não for uma agência ou não estiver autenticado
 * 
 * @example
 * ```typescript
 * // Em uma API route ou Server Action
 * export async function deleteContact(contactId: string) {
 *   const session = await getServerSession(authOptions);
 *   requireAgency(session); // Lança erro se não for agency
 *   
 *   // Código executado apenas por agências
 *   await prisma.contacts.delete({ where: { id: contactId } });
 * }
 * ```
 */
export function requireAgency(session: Session | null): void {
  if (!session?.user) {
    throw new UnauthorizedError("Você precisa estar autenticado para acessar este recurso");
  }
  
  if (!isAgency(session)) {
    throw new UnauthorizedError(
      "Apenas agências têm permissão para acessar este recurso"
    );
  }
}

/**
 * Retorna o role do usuário autenticado
 * 
 * @param session - Sessão do NextAuth contendo dados do usuário
 * @returns O role do usuário ("agency" ou "client") ou "guest" se não autenticado
 * 
 * @example
 * ```typescript
 * const session = await getServerSession(authOptions);
 * const role = getUserRole(session);
 * 
 * console.log(`Usuário logado como: ${role}`);
 * // Output: "Usuário logado como: agency" ou "client" ou "guest"
 * ```
 */
export function getUserRole(session: Session | null): string {
  if (!session?.user) {
    return "guest";
  }
  return session.user.role || UserRole.CLIENT; // Default para client se não definido
}

/**
 * Verifica se o usuário tem permissão para acessar um recurso específico
 * 
 * @param session - Sessão do NextAuth contendo dados do usuário
 * @param resourceOwnerId - ID do proprietário do recurso
 * @returns true se o usuário pode acessar o recurso, false caso contrário
 * 
 * @example
 * ```typescript
 * // Verificar se usuário pode editar um contato
 * const contact = await prisma.contacts.findUnique({ where: { id } });
 * const session = await getServerSession(authOptions);
 * 
 * if (canAccessResource(session, contact.ownerId)) {
 *   // Usuário pode editar
 *   await prisma.contacts.update({ where: { id }, data });
 * }
 * ```
 */
export function canAccessResource(
  session: Session | null,
  resourceOwnerId: string
): boolean {
  if (!session?.user) {
    return false;
  }

  // Agências podem acessar qualquer recurso
  if (isAgency(session)) {
    return true;
  }

  // Clientes só podem acessar seus próprios recursos
  return session.user.id === resourceOwnerId;
}

/**
 * Aplica filtros baseados no role do usuário para queries do Prisma
 * 
 * @param session - Sessão do NextAuth contendo dados do usuário
 * @returns Objeto de filtro para usar no Prisma where clause
 * 
 * @example
 * ```typescript
 * // Em uma API route que lista contatos
 * const session = await getServerSession(authOptions);
 * const filters = getRoleBasedFilters(session);
 * 
 * const contacts = await prisma.contacts.findMany({
 *   where: {
 *     ...filters, // Filtra automaticamente por ownerId se for client
 *     // outros filtros...
 *   }
 * });
 * ```
 */
export function getRoleBasedFilters(session: Session | null): Record<string, any> {
  if (!session?.user) {
    return { id: null }; // Retorna filtro que não encontra nada
  }

  // Agências veem tudo, não precisam de filtro
  if (isAgency(session)) {
    return {};
  }

  // Clientes veem apenas seus próprios dados (criados ou atribuídos a eles)
  return {
    OR: [
      { created_by: session.user.id },
      { assigned_to: session.user.id },
    ],
  };
}
