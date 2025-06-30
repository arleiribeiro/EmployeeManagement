import { funcionarios, type Funcionario, type InsertFuncionario, type UpdateFuncionario, users, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or, sql, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Funcionario methods
  getFuncionarios(params?: {
    search?: string;
    funcao?: string;
    ativo?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ funcionarios: Funcionario[]; total: number }>;
  getFuncionario(id: number): Promise<Funcionario | undefined>;
  createFuncionario(funcionario: InsertFuncionario): Promise<Funcionario>;
  updateFuncionario(id: number, funcionario: UpdateFuncionario): Promise<Funcionario | undefined>;
  deleteFuncionario(id: number): Promise<boolean>;
  checkCpfExists(cpf: string, excludeId?: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getFuncionarios(params?: {
    search?: string;
    funcao?: string;
    ativo?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ funcionarios: Funcionario[]; total: number }> {
    let query = db.select().from(funcionarios);
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(funcionarios);

    const conditions = [];

    if (params?.search) {
      const searchCondition = or(
        ilike(funcionarios.nome, `%${params.search}%`),
        ilike(funcionarios.cpf, `%${params.search}%`),
        ilike(funcionarios.email, `%${params.search}%`),
        ilike(funcionarios.funcao, `%${params.search}%`)
      );
      conditions.push(searchCondition);
    }

    if (params?.funcao) {
      conditions.push(eq(funcionarios.funcao, params.funcao));
    }

    if (params?.ativo !== undefined) {
      conditions.push(eq(funcionarios.ativo, params.ativo));
    }

    if (conditions.length > 0) {
      query = query.where(sql`${conditions.reduce((acc, condition) => sql`${acc} AND ${condition}`, sql`1=1`)}`);
      countQuery = countQuery.where(sql`${conditions.reduce((acc, condition) => sql`${acc} AND ${condition}`, sql`1=1`)}`);
    }

    // Apply sorting
    if (params?.sortBy) {
      const column = funcionarios[params.sortBy as keyof typeof funcionarios];
      if (column) {
        query = query.orderBy(params.sortOrder === 'desc' ? desc(column) : asc(column));
      }
    } else {
      query = query.orderBy(desc(funcionarios.id));
    }

    // Apply pagination
    if (params?.limit) {
      query = query.limit(params.limit);
    }
    if (params?.offset) {
      query = query.offset(params.offset);
    }

    const [funcionarios_result, total_result] = await Promise.all([
      query,
      countQuery
    ]);

    return {
      funcionarios: funcionarios_result,
      total: total_result[0]?.count || 0
    };
  }

  async getFuncionario(id: number): Promise<Funcionario | undefined> {
    const [funcionario] = await db.select().from(funcionarios).where(eq(funcionarios.id, id));
    return funcionario || undefined;
  }

  async createFuncionario(funcionario: InsertFuncionario): Promise<Funcionario> {
    const [created] = await db
      .insert(funcionarios)
      .values(funcionario)
      .returning();
    return created;
  }

  async updateFuncionario(id: number, funcionario: UpdateFuncionario): Promise<Funcionario | undefined> {
    const [updated] = await db
      .update(funcionarios)
      .set(funcionario)
      .where(eq(funcionarios.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteFuncionario(id: number): Promise<boolean> {
    const result = await db.delete(funcionarios).where(eq(funcionarios.id, id));
    return result.rowCount > 0;
  }

  async checkCpfExists(cpf: string, excludeId?: number): Promise<boolean> {
    let query = db.select({ id: funcionarios.id }).from(funcionarios).where(eq(funcionarios.cpf, cpf));
    
    if (excludeId) {
      query = query.where(sql`${funcionarios.id} != ${excludeId}`);
    }
    
    const [result] = await query;
    return !!result;
  }
}

export const storage = new DatabaseStorage();
