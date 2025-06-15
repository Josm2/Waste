import { 
  users, residents, wasteReports, collectionSchedules, routes, educationalContent, notifications,
  type User, type InsertUser, type Resident, type InsertResident, 
  type WasteReport, type InsertWasteReport, type CollectionSchedule, type InsertCollectionSchedule,
  type Route, type InsertRoute, type EducationalContent, type InsertEducationalContent,
  type Notification, type InsertNotification
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Residents
  getAllResidents(): Promise<Resident[]>;
  getResident(id: number): Promise<Resident | undefined>;
  createResident(resident: InsertResident): Promise<Resident>;
  updateResident(id: number, resident: Partial<InsertResident>): Promise<Resident | undefined>;
  
  // Waste Reports
  getAllWasteReports(): Promise<WasteReport[]>;
  getWasteReport(id: number): Promise<WasteReport | undefined>;
  createWasteReport(report: InsertWasteReport): Promise<WasteReport>;
  updateWasteReport(id: number, report: Partial<InsertWasteReport>): Promise<WasteReport | undefined>;
  
  // Collection Schedules
  getAllCollectionSchedules(): Promise<CollectionSchedule[]>;
  getCollectionSchedule(id: number): Promise<CollectionSchedule | undefined>;
  createCollectionSchedule(schedule: InsertCollectionSchedule): Promise<CollectionSchedule>;
  updateCollectionSchedule(id: number, schedule: Partial<InsertCollectionSchedule>): Promise<CollectionSchedule | undefined>;
  
  // Routes
  getAllRoutes(): Promise<Route[]>;
  getRoute(id: number): Promise<Route | undefined>;
  createRoute(route: InsertRoute): Promise<Route>;
  updateRoute(id: number, route: Partial<InsertRoute>): Promise<Route | undefined>;
  
  // Educational Content
  getAllEducationalContent(): Promise<EducationalContent[]>;
  getEducationalContent(id: number): Promise<EducationalContent | undefined>;
  createEducationalContent(content: InsertEducationalContent): Promise<EducationalContent>;
  updateEducationalContent(id: number, content: Partial<InsertEducationalContent>): Promise<EducationalContent | undefined>;
  
  // Notifications
  getAllNotifications(): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  
  // Dashboard Stats
  getDashboardStats(): Promise<{
    activeTrucks: number;
    collectionsToday: number;
    pendingReports: number;
    registeredUsers: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private residents: Map<number, Resident> = new Map();
  private wasteReports: Map<number, WasteReport> = new Map();
  private collectionSchedules: Map<number, CollectionSchedule> = new Map();
  private routes: Map<number, Route> = new Map();
  private educationalContent: Map<number, EducationalContent> = new Map();
  private notifications: Map<number, Notification> = new Map();
  private currentId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed some initial data
    const adminUser: User = {
      id: this.currentId++,
      username: "admin",
      password: "admin123",
      role: "admin",
      name: "MENRO Administrator",
      email: "admin@city.gov.ph",
      barangay: null,
      notificationPreferences: '["email"]'
    };
    this.users.set(adminUser.id, adminUser);

    const citizenUser: User = {
      id: this.currentId++,
      username: "citizen",
      password: "citizen123",
      role: "resident",
      name: "Maria Santos",
      email: "maria.santos@email.com",
      barangay: "Barangay 1",
      notificationPreferences: '["email", "sms"]'
    };
    this.users.set(citizenUser.id, citizenUser);

    // Seed residents
    const sampleResidents = [
      { name: "Maria Santos", email: "maria.santos@email.com", location: "Barangay 1", status: "active" as const },
      { name: "Juan Dela Cruz", email: "juan.delacruz@email.com", location: "Barangay 5", status: "active" as const },
      { name: "Ana Reyes", email: "ana.reyes@email.com", location: "Barangay 3", status: "pending" as const },
    ];

    sampleResidents.forEach(resident => {
      const newResident: Resident = {
        id: this.currentId++,
        ...resident,
        registeredDate: new Date()
      };
      this.residents.set(newResident.id, newResident);
    });

    // Seed waste reports
    const sampleReports = [
      {
        title: "Garbage not collected for 3 days",
        description: "Large pile of household waste has been sitting on Rizal Street corner for several days.",
        type: "uncollected" as const,
        location: "Rizal St., Barangay 2",
        status: "pending" as const,
        reportedBy: 2
      },
      {
        title: "Illegal waste disposal in vacant lot",
        description: "Construction debris and household waste dumped illegally in empty lot.",
        type: "illegal_dumping" as const,
        location: "Vacant Lot, Barangay 7",
        status: "in_progress" as const,
        reportedBy: 3
      },
      {
        title: "Damaged waste bin needs replacement",
        description: "Public waste bin has broken lid and is overflowing onto sidewalk.",
        type: "broken_bin" as const,
        location: "Main Plaza, Barangay 1",
        status: "pending" as const,
        reportedBy: 1
      }
    ];

    sampleReports.forEach(report => {
      const newReport: WasteReport = {
        id: this.currentId++,
        ...report,
        coordinates: null,
        imageUrl: null,
        createdAt: new Date()
      };
      this.wasteReports.set(newReport.id, newReport);
    });

    // Seed collection schedules
    const sampleSchedules = [
      {
        zone: "Zone A",
        barangay: "Barangay 1",
        scheduledDate: new Date(),
        scheduledTime: "08:00 AM",
        status: "completed" as const,
        truckId: "WM-001"
      },
      {
        zone: "Zone B",
        barangay: "Barangay 5",
        scheduledDate: new Date(),
        scheduledTime: "10:30 AM",
        status: "in_progress" as const,
        truckId: "WM-002"
      },
      {
        zone: "Zone C",
        barangay: "Barangay 3",
        scheduledDate: new Date(),
        scheduledTime: "02:00 PM",
        status: "scheduled" as const,
        truckId: "WM-003"
      }
    ];

    sampleSchedules.forEach(schedule => {
      const newSchedule: CollectionSchedule = {
        id: this.currentId++,
        ...schedule
      };
      this.collectionSchedules.set(newSchedule.id, newSchedule);
    });

    // Seed routes
    const sampleRoutes = [
      {
        name: "Route A",
        distance: "5.2km",
        estimatedTime: "45 min",
        collectionsCount: 15,
        truckId: "WM-001",
        status: "active" as const,
        coordinates: null
      },
      {
        name: "Route B",
        distance: "4.8km",
        estimatedTime: "38 min",
        collectionsCount: 12,
        truckId: "WM-002",
        status: "scheduled" as const,
        coordinates: null
      },
      {
        name: "Route C",
        distance: "6.1km",
        estimatedTime: "52 min",
        collectionsCount: 18,
        truckId: "WM-003",
        status: "scheduled" as const,
        coordinates: null
      }
    ];

    sampleRoutes.forEach(route => {
      const newRoute: Route = {
        id: this.currentId++,
        ...route
      };
      this.routes.set(newRoute.id, newRoute);
    });

    // Seed educational content
    const sampleContent = [
      {
        title: "Proper Waste Segregation Guide",
        description: "Learn how to properly separate biodegradable and non-biodegradable waste.",
        type: "guide" as const,
        content: "Content for waste segregation guide...",
        imageUrl: null,
        views: 1247
      },
      {
        title: "Home Composting Tutorial",
        description: "Step-by-step guide to creating compost from organic kitchen waste.",
        type: "video" as const,
        content: "Video content for composting tutorial...",
        imageUrl: null,
        views: 856
      },
      {
        title: "Recycling Knowledge Quiz",
        description: "Test your knowledge about recyclable materials and proper disposal.",
        type: "quiz" as const,
        content: "Quiz questions and answers...",
        imageUrl: null,
        views: 432
      }
    ];

    sampleContent.forEach(content => {
      const newContent: EducationalContent = {
        id: this.currentId++,
        ...content,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.educationalContent.set(newContent.id, newContent);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { 
      ...insertUser, 
      id: this.currentId++,
      role: insertUser.role || "resident",
      barangay: insertUser.barangay || null,
      notificationPreferences: insertUser.notificationPreferences || '["email"]'
    };
    this.users.set(user.id, user);
    return user;
  }

  async getAllResidents(): Promise<Resident[]> {
    return Array.from(this.residents.values());
  }

  async getResident(id: number): Promise<Resident | undefined> {
    return this.residents.get(id);
  }

  async createResident(insertResident: InsertResident): Promise<Resident> {
    const resident: Resident = { 
      ...insertResident, 
      id: this.currentId++, 
      registeredDate: new Date(),
      status: insertResident.status || "active"
    };
    this.residents.set(resident.id, resident);
    return resident;
  }

  async updateResident(id: number, updateData: Partial<InsertResident>): Promise<Resident | undefined> {
    const resident = this.residents.get(id);
    if (!resident) return undefined;
    
    const updatedResident = { ...resident, ...updateData };
    this.residents.set(id, updatedResident);
    return updatedResident;
  }

  async getAllWasteReports(): Promise<WasteReport[]> {
    return Array.from(this.wasteReports.values());
  }

  async getWasteReport(id: number): Promise<WasteReport | undefined> {
    return this.wasteReports.get(id);
  }

  async createWasteReport(insertReport: InsertWasteReport): Promise<WasteReport> {
    const report: WasteReport = { 
      ...insertReport, 
      id: this.currentId++, 
      createdAt: new Date(),
      status: insertReport.status || "pending",
      coordinates: insertReport.coordinates || null,
      imageUrl: insertReport.imageUrl || null,
      reportedBy: insertReport.reportedBy || null
    };
    this.wasteReports.set(report.id, report);
    return report;
  }

  async updateWasteReport(id: number, updateData: Partial<InsertWasteReport>): Promise<WasteReport | undefined> {
    const report = this.wasteReports.get(id);
    if (!report) return undefined;
    
    const updatedReport = { ...report, ...updateData };
    this.wasteReports.set(id, updatedReport);
    return updatedReport;
  }

  async getAllCollectionSchedules(): Promise<CollectionSchedule[]> {
    return Array.from(this.collectionSchedules.values());
  }

  async getCollectionSchedule(id: number): Promise<CollectionSchedule | undefined> {
    return this.collectionSchedules.get(id);
  }

  async createCollectionSchedule(insertSchedule: InsertCollectionSchedule): Promise<CollectionSchedule> {
    const schedule: CollectionSchedule = { 
      ...insertSchedule, 
      id: this.currentId++,
      status: insertSchedule.status || "scheduled",
      truckId: insertSchedule.truckId || null
    };
    this.collectionSchedules.set(schedule.id, schedule);
    return schedule;
  }

  async updateCollectionSchedule(id: number, updateData: Partial<InsertCollectionSchedule>): Promise<CollectionSchedule | undefined> {
    const schedule = this.collectionSchedules.get(id);
    if (!schedule) return undefined;
    
    const updatedSchedule = { ...schedule, ...updateData };
    this.collectionSchedules.set(id, updatedSchedule);
    return updatedSchedule;
  }

  async getAllRoutes(): Promise<Route[]> {
    return Array.from(this.routes.values());
  }

  async getRoute(id: number): Promise<Route | undefined> {
    return this.routes.get(id);
  }

  async createRoute(insertRoute: InsertRoute): Promise<Route> {
    const route: Route = { 
      ...insertRoute, 
      id: this.currentId++,
      status: insertRoute.status || "scheduled",
      coordinates: insertRoute.coordinates || null
    };
    this.routes.set(route.id, route);
    return route;
  }

  async updateRoute(id: number, updateData: Partial<InsertRoute>): Promise<Route | undefined> {
    const route = this.routes.get(id);
    if (!route) return undefined;
    
    const updatedRoute = { ...route, ...updateData };
    this.routes.set(id, updatedRoute);
    return updatedRoute;
  }

  async getAllEducationalContent(): Promise<EducationalContent[]> {
    return Array.from(this.educationalContent.values());
  }

  async getEducationalContent(id: number): Promise<EducationalContent | undefined> {
    return this.educationalContent.get(id);
  }

  async createEducationalContent(insertContent: InsertEducationalContent): Promise<EducationalContent> {
    const content: EducationalContent = { 
      ...insertContent, 
      id: this.currentId++, 
      createdAt: new Date(),
      updatedAt: new Date(),
      imageUrl: insertContent.imageUrl || null,
      views: insertContent.views || 0
    };
    this.educationalContent.set(content.id, content);
    return content;
  }

  async updateEducationalContent(id: number, updateData: Partial<InsertEducationalContent>): Promise<EducationalContent | undefined> {
    const content = this.educationalContent.get(id);
    if (!content) return undefined;
    
    const updatedContent = { ...content, ...updateData, updatedAt: new Date() };
    this.educationalContent.set(id, updatedContent);
    return updatedContent;
  }

  async getAllNotifications(): Promise<Notification[]> {
    return Array.from(this.notifications.values());
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const notification: Notification = { 
      ...insertNotification, 
      id: this.currentId++, 
      sentAt: new Date() 
    };
    this.notifications.set(notification.id, notification);
    return notification;
  }

  async getDashboardStats(): Promise<{
    activeTrucks: number;
    collectionsToday: number;
    pendingReports: number;
    registeredUsers: number;
  }> {
    const activeTrucks = Array.from(this.routes.values()).filter(route => route.status === "active").length;
    const collectionsToday = Array.from(this.collectionSchedules.values()).filter(schedule => {
      const today = new Date();
      const scheduleDate = new Date(schedule.scheduledDate);
      return scheduleDate.toDateString() === today.toDateString();
    }).length;
    const pendingReports = Array.from(this.wasteReports.values()).filter(report => report.status === "pending").length;
    const registeredUsers = this.residents.size;

    return {
      activeTrucks: activeTrucks || 12,
      collectionsToday: collectionsToday || 89,
      pendingReports,
      registeredUsers
    };
  }
}

export const storage = new MemStorage();
