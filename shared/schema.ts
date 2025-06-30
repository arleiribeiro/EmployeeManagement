import { pgTable, text, serial, integer, boolean, date, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const funcionarios = pgTable("funcionarios", {
  id: serial("id").primaryKey(),
  empresa_id: integer("empresa_id"),
  nome: varchar("nome", { length: 255 }).notNull(),
  cpf: varchar("cpf", { length: 14 }).notNull().unique(),
  rg: varchar("rg", { length: 20 }),
  data_nascimento: date("data_nascimento"),
  funcao: varchar("funcao", { length: 100 }),
  data_admissao: date("data_admissao"),
  ctps_numero: varchar("ctps_numero", { length: 20 }),
  ctps_serie: varchar("ctps_serie", { length: 20 }),
  pis: varchar("pis", { length: 20 }),
  telefone: varchar("telefone", { length: 20 }),
  whatsapp: varchar("whatsapp", { length: 50 }),
  email: varchar("email", { length: 100 }),
  endereco: text("endereco"),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 2 }),
  cep: varchar("cep", { length: 10 }),
  ativo: boolean("ativo").default(true),
  supervisor: boolean("supervisor").default(false),
});

export const insertFuncionarioSchema = createInsertSchema(funcionarios).omit({ id: true });
export const selectFuncionarioSchema = createSelectSchema(funcionarios);
export const updateFuncionarioSchema = insertFuncionarioSchema.partial();

export type InsertFuncionario = z.infer<typeof insertFuncionarioSchema>;
export type Funcionario = typeof funcionarios.$inferSelect;
export type UpdateFuncionario = z.infer<typeof updateFuncionarioSchema>;

// Keep existing users table for auth
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
