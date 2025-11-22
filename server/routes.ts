import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertResidentSchema, insertCollectorSchema, insertAuthoritySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { phone, password } = req.body;
      const user = await storage.getUserByPhone(phone);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Get role-specific profile
      let profile = null;
      if (user.role === "resident") {
        profile = await storage.getResidentByUserId(user.id);
      } else if (user.role === "collector") {
        profile = await storage.getCollectorByUserId(user.id);
      } else if (user.role === "authority") {
        profile = await storage.getAuthorityByUserId(user.id);
      }

      res.json({ user, profile });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { user: userData, profile: profileData } = req.body;
      
      // Validate user data
      const validatedUser = insertUserSchema.parse(userData);
      
      // Check if phone already exists
      const existingUser = await storage.getUserByPhone(validatedUser.phone);
      if (existingUser) {
        return res.status(400).json({ message: "Phone number already registered" });
      }

      // Create user
      const user = await storage.createUser(validatedUser);
      
      // Create role-specific profile
      let profile = null;
      if (user.role === "resident") {
        const validatedProfile = insertResidentSchema.parse({ ...profileData, userId: user.id });
        profile = await storage.createResident(validatedProfile);
      } else if (user.role === "collector") {
        const validatedProfile = insertCollectorSchema.parse({ ...profileData, userId: user.id });
        profile = await storage.createCollector(validatedProfile);
      } else if (user.role === "authority") {
        const validatedProfile = insertAuthoritySchema.parse({ ...profileData, userId: user.id });
        profile = await storage.createAuthority(validatedProfile);
      }

      res.json({ user, profile });
    } catch (error) {
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Resident routes
  app.get("/api/residents/:id/history", async (req, res) => {
    try {
      const history = await storage.getCollectionHistory(req.params.id);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });

  app.post("/api/residents/:id/status", async (req, res) => {
    try {
      const { isAvailable } = req.body;
      await storage.updateResidentStatus(req.params.id, isAvailable);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update status" });
    }
  });

  app.post("/api/overflow-reports", async (req, res) => {
    try {
      const report = await storage.createOverflowReport(req.body);
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to create overflow report" });
    }
  });

  app.post("/api/tips", async (req, res) => {
    try {
      const tip = await storage.createTip(req.body);
      res.json(tip);
    } catch (error) {
      res.status(500).json({ message: "Failed to send tip" });
    }
  });

  app.post("/api/feedback", async (req, res) => {
    try {
      const feedback = await storage.createFeedback(req.body);
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit feedback" });
    }
  });

  app.post("/api/distribute-requests", async (req, res) => {
    try {
      const request = await storage.createDistributeRequest(req.body);
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to create distribute request" });
    }
  });

  // Collector routes
  app.get("/api/collectors", async (req, res) => {
    try {
      const collectors = await storage.getAllCollectors();
      res.json(collectors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collectors" });
    }
  });

  app.get("/api/collectors/:id/tips", async (req, res) => {
    try {
      const tips = await storage.getTipsByCollector(req.params.id);
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tips" });
    }
  });

  app.get("/api/collectors/:id/overflow-reports", async (req, res) => {
    try {
      const reports = await storage.getOverflowReportsByCollector(req.params.id);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch overflow reports" });
    }
  });

  app.get("/api/distribute-requests/pending", async (req, res) => {
    try {
      const requests = await storage.getPendingDistributeRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch distribute requests" });
    }
  });

  app.put("/api/distribute-requests/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      await storage.updateDistributeRequestStatus(req.params.id, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update request status" });
    }
  });

  // Authority routes
  app.get("/api/overflow-reports", async (req, res) => {
    try {
      const reports = await storage.getAllOverflowReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch overflow reports" });
    }
  });

  app.get("/api/tips", async (req, res) => {
    try {
      const tips = await storage.getAllTips();
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tips" });
    }
  });

  app.get("/api/feedback", async (req, res) => {
    try {
      const feedback = await storage.getAllFeedback();
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  app.post("/api/broadcasts", async (req, res) => {
    try {
      const broadcast = await storage.createBroadcast(req.body);
      res.json(broadcast);
    } catch (error) {
      res.status(500).json({ message: "Failed to send broadcast" });
    }
  });

  app.get("/api/broadcasts", async (req, res) => {
    try {
      const broadcasts = await storage.getAllBroadcasts();
      res.json(broadcasts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch broadcasts" });
    }
  });

  // Chat routes
  app.get("/api/chats/private/:userId1/:userId2", async (req, res) => {
    try {
      const chats = await storage.getPrivateChats(req.params.userId1, req.params.userId2);
      res.json(chats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch private chats" });
    }
  });

  app.get("/api/chats/group", async (req, res) => {
    try {
      const chats = await storage.getGroupChats();
      res.json(chats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch group chats" });
    }
  });

  app.post("/api/chats", async (req, res) => {
    try {
      const chat = await storage.createChat(req.body);
      res.json(chat);
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
