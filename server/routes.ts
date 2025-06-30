import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFuncionarioSchema, updateFuncionarioSchema } from "@shared/schema";
import { requireAuth, loginUser, logoutUser, type AuthUser } from "./auth";
import session from "express-session";
import MemoryStore from "memorystore";

const MemoryStoreSession = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: new MemoryStoreSession({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      // Mock Microsoft authentication - in production, this would validate MSAL token
      const { token, user } = req.body;
      
      if (!token || !user) {
        return res.status(400).json({ message: "Invalid authentication data" });
      }

      // In a real implementation, verify the Microsoft token here
      const authUser: AuthUser = {
        id: user.id || 'mock-id',
        name: user.name || 'Test User',
        email: user.email || 'user@company.com'
      };

      loginUser(req, authUser);
      res.json({ user: authUser });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    logoutUser(req);
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    res.json({ user: req.user });
  });

  // Funcionarios routes
  app.get("/api/funcionarios", requireAuth, async (req, res) => {
    try {
      const {
        search,
        funcao,
        ativo,
        page = "1",
        limit = "10",
        sortBy,
        sortOrder = "desc"
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const result = await storage.getFuncionarios({
        search: search as string,
        funcao: funcao as string,
        ativo: ativo === "true" ? true : ativo === "false" ? false : undefined,
        limit: limitNum,
        offset,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      });

      res.json({
        funcionarios: result.funcionarios,
        total: result.total,
        page: pageNum,
        totalPages: Math.ceil(result.total / limitNum)
      });
    } catch (error) {
      console.error("Error fetching funcionarios:", error);
      res.status(500).json({ message: "Failed to fetch funcionarios" });
    }
  });

  app.get("/api/funcionarios/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const funcionario = await storage.getFuncionario(id);
      
      if (!funcionario) {
        return res.status(404).json({ message: "Funcionário não encontrado" });
      }
      
      res.json(funcionario);
    } catch (error) {
      console.error("Error fetching funcionario:", error);
      res.status(500).json({ message: "Failed to fetch funcionario" });
    }
  });

  app.post("/api/funcionarios", requireAuth, async (req, res) => {
    try {
      const validatedData = insertFuncionarioSchema.parse(req.body);
      
      // Check if CPF already exists
      const cpfExists = await storage.checkCpfExists(validatedData.cpf);
      if (cpfExists) {
        return res.status(400).json({ message: "CPF já cadastrado" });
      }
      
      const funcionario = await storage.createFuncionario(validatedData);
      res.status(201).json(funcionario);
    } catch (error: any) {
      console.error("Error creating funcionario:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create funcionario" });
    }
  });

  app.put("/api/funcionarios/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateFuncionarioSchema.parse(req.body);
      
      // Check if CPF already exists for another funcionario
      if (validatedData.cpf) {
        const cpfExists = await storage.checkCpfExists(validatedData.cpf, id);
        if (cpfExists) {
          return res.status(400).json({ message: "CPF já cadastrado para outro funcionário" });
        }
      }
      
      const funcionario = await storage.updateFuncionario(id, validatedData);
      
      if (!funcionario) {
        return res.status(404).json({ message: "Funcionário não encontrado" });
      }
      
      res.json(funcionario);
    } catch (error: any) {
      console.error("Error updating funcionario:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update funcionario" });
    }
  });

  app.delete("/api/funcionarios/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteFuncionario(id);
      
      if (!success) {
        return res.status(404).json({ message: "Funcionário não encontrado" });
      }
      
      res.json({ message: "Funcionário excluído com sucesso" });
    } catch (error) {
      console.error("Error deleting funcionario:", error);
      res.status(500).json({ message: "Failed to delete funcionario" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
