import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("resident"), // "admin" | "resident"
  name: text("name").notNull(),
  email: text("email").notNull(),
  barangay: text("barangay"),
  notificationPreferences: text("notification_preferences").default('["email"]'), // JSON array
});

export const residents = pgTable("residents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  location: text("location").notNull(),
  registeredDate: timestamp("registered_date").notNull().defaultNow(),
  status: text("status").notNull().default("active"), // "active" | "pending" | "inactive"
});

export const wasteReports = pgTable("waste_reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "uncollected" | "illegal_dumping" | "broken_bin" | "other"
  location: text("location").notNull(),
  coordinates: text("coordinates"), // JSON string of lat/lng
  imageUrl: text("image_url"),
  status: text("status").notNull().default("pending"), // "pending" | "in_progress" | "resolved"
  reportedBy: integer("reported_by").references(() => residents.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const collectionSchedules = pgTable("collection_schedules", {
  id: serial("id").primaryKey(),
  zone: text("zone").notNull(),
  barangay: text("barangay").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  scheduledTime: text("scheduled_time").notNull(),
  status: text("status").notNull().default("scheduled"), // "scheduled" | "in_progress" | "completed"
  truckId: text("truck_id"),
});

export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  distance: text("distance").notNull(),
  estimatedTime: text("estimated_time").notNull(),
  collectionsCount: integer("collections_count").notNull(),
  truckId: text("truck_id").notNull(),
  status: text("status").notNull().default("scheduled"), // "scheduled" | "active" | "completed"
  coordinates: text("coordinates"), // JSON string of route points
});

export const educationalContent = pgTable("educational_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "guide" | "video" | "quiz"
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // "collection_reminder" | "schedule_change" | "announcement"
  recipientGroup: text("recipient_group").notNull(),
  sentAt: timestamp("sent_at").notNull().defaultNow(),
  channels: text("channels").notNull(), // JSON array of channels: email, sms, push
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertResidentSchema = createInsertSchema(residents).omit({ id: true, registeredDate: true });
export const insertWasteReportSchema = createInsertSchema(wasteReports).omit({ id: true, createdAt: true });
export const insertCollectionScheduleSchema = createInsertSchema(collectionSchedules).omit({ id: true });
export const insertRouteSchema = createInsertSchema(routes).omit({ id: true });
export const insertEducationalContentSchema = createInsertSchema(educationalContent).omit({ id: true, createdAt: true, updatedAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, sentAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Resident = typeof residents.$inferSelect;
export type InsertResident = z.infer<typeof insertResidentSchema>;
export type WasteReport = typeof wasteReports.$inferSelect;
export type InsertWasteReport = z.infer<typeof insertWasteReportSchema>;
export type CollectionSchedule = typeof collectionSchedules.$inferSelect;
export type InsertCollectionSchedule = z.infer<typeof insertCollectionScheduleSchema>;
export type Route = typeof routes.$inferSelect;
export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type EducationalContent = typeof educationalContent.$inferSelect;
export type InsertEducationalContent = z.infer<typeof insertEducationalContentSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
