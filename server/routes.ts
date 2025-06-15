import type { Express, Request } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertWasteReportSchema, insertCollectionScheduleSchema, insertRouteSchema,
  insertEducationalContentSchema, insertNotificationSchema, insertResidentSchema
} from "@shared/schema";
import multer from "multer";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const upload = multer({ dest: 'uploads/' });

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Waste Reports
  app.get("/api/waste-reports", async (req, res) => {
    try {
      const reports = await storage.getAllWasteReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch waste reports" });
    }
  });

  app.post("/api/waste-reports", upload.single('image'), async (req: MulterRequest, res) => {
    try {
      const validatedData = insertWasteReportSchema.parse(req.body);
      
      // If image was uploaded, add the path
      if (req.file) {
        validatedData.imageUrl = `/uploads/${req.file.filename}`;
      }
      
      const report = await storage.createWasteReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      res.status(400).json({ error: "Invalid report data" });
    }
  });

  app.patch("/api/waste-reports/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedReport = await storage.updateWasteReport(id, req.body);
      
      if (!updatedReport) {
        return res.status(404).json({ error: "Report not found" });
      }
      
      res.json(updatedReport);
    } catch (error) {
      res.status(400).json({ error: "Failed to update report" });
    }
  });

  // Collection Schedules
  app.get("/api/collection-schedules", async (req, res) => {
    try {
      const schedules = await storage.getAllCollectionSchedules();
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch collection schedules" });
    }
  });

  app.post("/api/collection-schedules", async (req, res) => {
    try {
      const validatedData = insertCollectionScheduleSchema.parse(req.body);
      const schedule = await storage.createCollectionSchedule(validatedData);
      res.status(201).json(schedule);
    } catch (error) {
      res.status(400).json({ error: "Invalid schedule data" });
    }
  });

  app.patch("/api/collection-schedules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedSchedule = await storage.updateCollectionSchedule(id, req.body);
      
      if (!updatedSchedule) {
        return res.status(404).json({ error: "Schedule not found" });
      }
      
      res.json(updatedSchedule);
    } catch (error) {
      res.status(400).json({ error: "Failed to update schedule" });
    }
  });

  // Routes
  app.get("/api/routes", async (req, res) => {
    try {
      const routes = await storage.getAllRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch routes" });
    }
  });

  app.post("/api/routes", async (req, res) => {
    try {
      const validatedData = insertRouteSchema.parse(req.body);
      const route = await storage.createRoute(validatedData);
      res.status(201).json(route);
    } catch (error) {
      res.status(400).json({ error: "Invalid route data" });
    }
  });

  // Educational Content
  app.get("/api/educational-content", async (req, res) => {
    try {
      const content = await storage.getAllEducationalContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch educational content" });
    }
  });

  app.post("/api/educational-content", async (req, res) => {
    try {
      const validatedData = insertEducationalContentSchema.parse(req.body);
      const content = await storage.createEducationalContent(validatedData);
      res.status(201).json(content);
    } catch (error) {
      res.status(400).json({ error: "Invalid content data" });
    }
  });

  app.patch("/api/educational-content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedContent = await storage.updateEducationalContent(id, req.body);
      
      if (!updatedContent) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      res.json(updatedContent);
    } catch (error) {
      res.status(400).json({ error: "Failed to update content" });
    }
  });

  // Residents
  app.get("/api/residents", async (req, res) => {
    try {
      const residents = await storage.getAllResidents();
      res.json(residents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch residents" });
    }
  });

  app.post("/api/residents", async (req, res) => {
    try {
      const validatedData = insertResidentSchema.parse(req.body);
      const resident = await storage.createResident(validatedData);
      res.status(201).json(resident);
    } catch (error) {
      res.status(400).json({ error: "Invalid resident data" });
    }
  });

  // Notifications
  app.get("/api/notifications", async (req, res) => {
    try {
      const notifications = await storage.getAllNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const validatedData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(validatedData);
      res.status(201).json(notification);
    } catch (error) {
      res.status(400).json({ error: "Invalid notification data" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  const httpServer = createServer(app);
  return httpServer;
}
