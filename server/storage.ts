import { randomUUID } from "crypto";
import type {
  User, InsertUser, Resident, InsertResident, Collector, InsertCollector,
  Authority, InsertAuthority, CollectionHistory, InsertCollectionHistory,
  OverflowReport, InsertOverflowReport, Tip, InsertTip, Chat, InsertChat,
  Feedback, InsertFeedback, DistributeRequest, InsertDistributeRequest,
  Broadcast, InsertBroadcast
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Residents
  getResident(id: string): Promise<Resident | undefined>;
  getResidentByUserId(userId: string): Promise<Resident | undefined>;
  getResidentByDoorNumber(doorNumber: string): Promise<Resident | undefined>;
  createResident(resident: InsertResident): Promise<Resident>;
  updateResidentStatus(id: string, isAvailable: boolean): Promise<void>;
  updateBeaconScore(id: string, score: number): Promise<void>;
  
  // Collectors
  getCollector(id: string): Promise<Collector | undefined>;
  getCollectorByUserId(userId: string): Promise<Collector | undefined>;
  getAllCollectors(): Promise<Collector[]>;
  createCollector(collector: InsertCollector): Promise<Collector>;
  updateCollectionProgress(id: string, progress: number): Promise<void>;
  
  // Authorities
  getAuthority(id: string): Promise<Authority | undefined>;
  getAuthorityByUserId(userId: string): Promise<Authority | undefined>;
  createAuthority(authority: InsertAuthority): Promise<Authority>;
  
  // Collection History
  getCollectionHistory(residentId: string): Promise<CollectionHistory[]>;
  createCollectionHistory(history: InsertCollectionHistory): Promise<CollectionHistory>;
  
  // Overflow Reports
  getAllOverflowReports(): Promise<OverflowReport[]>;
  getOverflowReportsByCollector(collectorId: string): Promise<OverflowReport[]>;
  createOverflowReport(report: InsertOverflowReport): Promise<OverflowReport>;
  updateOverflowReportStatus(id: string, status: string, assignedCollectorId?: string): Promise<void>;
  
  // Tips
  getTipsByCollector(collectorId: string): Promise<Tip[]>;
  getAllTips(): Promise<Tip[]>;
  createTip(tip: InsertTip): Promise<Tip>;
  
  // Chats
  getPrivateChats(userId1: string, userId2: string): Promise<Chat[]>;
  getGroupChats(): Promise<Chat[]>;
  createChat(chat: InsertChat): Promise<Chat>;
  
  // Feedback
  getFeedbackByCollector(collectorId: string): Promise<Feedback[]>;
  getAllFeedback(): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  
  // Distribute Requests
  getDistributeRequestsByResident(residentId: string): Promise<DistributeRequest[]>;
  getPendingDistributeRequests(): Promise<DistributeRequest[]>;
  createDistributeRequest(request: InsertDistributeRequest): Promise<DistributeRequest>;
  updateDistributeRequestStatus(id: string, status: string): Promise<void>;
  
  // Broadcasts
  getAllBroadcasts(): Promise<Broadcast[]>;
  createBroadcast(broadcast: InsertBroadcast): Promise<Broadcast>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private residents: Map<string, Resident> = new Map();
  private collectors: Map<string, Collector> = new Map();
  private authorities: Map<string, Authority> = new Map();
  private collectionHistory: Map<string, CollectionHistory> = new Map();
  private overflowReports: Map<string, OverflowReport> = new Map();
  private tips: Map<string, Tip> = new Map();
  private chats: Map<string, Chat> = new Map();
  private feedback: Map<string, Feedback> = new Map();
  private distributeRequests: Map<string, DistributeRequest> = new Map();
  private broadcasts: Map<string, Broadcast> = new Map();

  constructor() {
    this.seedMockData();
  }

  private seedMockData() {
    // Create demo users
    const demoResident: User = {
      id: "user-resident-1",
      name: "Demo Resident",
      phone: "+919876543210",
      password: "resident123",
      role: "resident",
      createdAt: new Date(),
    };
    
    const demoCollector: User = {
      id: "user-collector-1",
      name: "Demo Collector",
      phone: "+919876543211",
      password: "garbage23",
      role: "collector",
      createdAt: new Date(),
    };
    
    const demoAuthority: User = {
      id: "user-authority-1",
      name: "Chennai Municipal Corporation",
      phone: "+914423456789",
      password: "authority123",
      role: "authority",
      createdAt: new Date(),
    };

    this.users.set(demoResident.id, demoResident);
    this.users.set(demoCollector.id, demoCollector);
    this.users.set(demoAuthority.id, demoAuthority);

    // Create demo profiles
    const residentProfile: Resident = {
      id: "resident-1",
      userId: demoResident.id,
      doorNumber: "DR001",
      address: "123 Anna Nagar, Chennai - 600040",
      beaconScore: 80,
      isAvailable: true,
    };
    
    const collectorProfile: Collector = {
      id: "collector-1",
      userId: demoCollector.id,
      employeeId: "GC001",
      areaAssigned: "Anna Nagar",
      collectionProgress: 65,
    };
    
    const authorityProfile: Authority = {
      id: "authority-1",
      userId: demoAuthority.id,
      authorityName: "Chennai Municipal Corporation",
      employeeId: "CMC001",
      email: "admin@chennai.gov.in",
    };

    this.residents.set(residentProfile.id, residentProfile);
    this.collectors.set(collectorProfile.id, collectorProfile);
    this.authorities.set(authorityProfile.id, authorityProfile);

    // Mock collection history
    const historyItems: CollectionHistory[] = [
      {
        id: "history-1",
        residentId: "resident-1",
        collectorId: "collector-1",
        wasteType: "General Waste",
        status: "collected",
        collectionDate: new Date("2024-01-15"),
      },
      {
        id: "history-2",
        residentId: "resident-1",
        collectorId: "collector-1",
        wasteType: "Recyclable",
        status: "collected",
        collectionDate: new Date("2024-01-12"),
      },
      {
        id: "history-3",
        residentId: "resident-1",
        collectorId: "collector-1",
        wasteType: "Organic",
        status: "pending",
        collectionDate: new Date("2024-01-10"),
      },
    ];

    historyItems.forEach(item => this.collectionHistory.set(item.id, item));

    // Mock overflow reports
    const overflowReportsData: OverflowReport[] = [
      {
        id: "overflow-1",
        residentId: "resident-1",
        overflowType: "dumps",
        location: { lat: 13.0827, lng: 80.2707, address: "T Nagar Junction" },
        status: "pending",
        assignedCollectorId: null,
        reportedAt: new Date(),
      },
    ];

    overflowReportsData.forEach(report => this.overflowReports.set(report.id, report));

    // Mock tips
    const tipsData: Tip[] = [
      {
        id: "tip-1",
        fromResidentId: "resident-1",
        toCollectorId: "collector-1",
        amount: 50,
        sentAt: new Date(),
      },
    ];

    tipsData.forEach(tip => this.tips.set(tip.id, tip));

    // Mock chats
    const chatsData: Chat[] = [
      {
        id: "chat-1",
        senderId: "user-collector-1",
        receiverId: "user-resident-1",
        message: "Will be there in 10 minutes",
        chatType: "private",
        sentAt: new Date(),
      },
      {
        id: "chat-2",
        senderId: "user-resident-1",
        receiverId: "user-collector-1",
        message: "Thank you!",
        chatType: "private",
        sentAt: new Date(),
      },
    ];

    chatsData.forEach(chat => this.chats.set(chat.id, chat));

    // Mock feedback
    const feedbackData: Feedback[] = [
      {
        id: "feedback-1",
        residentId: "resident-1",
        collectorId: "collector-1",
        rating: 5,
        comment: "Very punctual and polite service",
        submittedAt: new Date(),
      },
    ];

    feedbackData.forEach(feedback => this.feedback.set(feedback.id, feedback));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.phone === phone);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Resident methods
  async getResident(id: string): Promise<Resident | undefined> {
    return this.residents.get(id);
  }

  async getResidentByUserId(userId: string): Promise<Resident | undefined> {
    return Array.from(this.residents.values()).find(resident => resident.userId === userId);
  }

  async getResidentByDoorNumber(doorNumber: string): Promise<Resident | undefined> {
    return Array.from(this.residents.values()).find(resident => resident.doorNumber === doorNumber);
  }

  async createResident(insertResident: InsertResident): Promise<Resident> {
    const id = randomUUID();
    const resident: Resident = { 
      ...insertResident, 
      id,
      beaconScore: insertResident.beaconScore ?? 80,
      isAvailable: insertResident.isAvailable ?? true
    };
    this.residents.set(id, resident);
    return resident;
  }

  async updateResidentStatus(id: string, isAvailable: boolean): Promise<void> {
    const resident = this.residents.get(id);
    if (resident) {
      this.residents.set(id, { ...resident, isAvailable });
    }
  }

  async updateBeaconScore(id: string, score: number): Promise<void> {
    const resident = this.residents.get(id);
    if (resident) {
      this.residents.set(id, { ...resident, beaconScore: score });
    }
  }

  // Collector methods
  async getCollector(id: string): Promise<Collector | undefined> {
    return this.collectors.get(id);
  }

  async getCollectorByUserId(userId: string): Promise<Collector | undefined> {
    return Array.from(this.collectors.values()).find(collector => collector.userId === userId);
  }

  async getAllCollectors(): Promise<Collector[]> {
    return Array.from(this.collectors.values());
  }

  async createCollector(insertCollector: InsertCollector): Promise<Collector> {
    const id = randomUUID();
    const collector: Collector = { 
      ...insertCollector, 
      id,
      collectionProgress: insertCollector.collectionProgress ?? 0
    };
    this.collectors.set(id, collector);
    return collector;
  }

  async updateCollectionProgress(id: string, progress: number): Promise<void> {
    const collector = this.collectors.get(id);
    if (collector) {
      this.collectors.set(id, { ...collector, collectionProgress: progress });
    }
  }

  // Authority methods
  async getAuthority(id: string): Promise<Authority | undefined> {
    return this.authorities.get(id);
  }

  async getAuthorityByUserId(userId: string): Promise<Authority | undefined> {
    return Array.from(this.authorities.values()).find(authority => authority.userId === userId);
  }

  async createAuthority(insertAuthority: InsertAuthority): Promise<Authority> {
    const id = randomUUID();
    const authority: Authority = { ...insertAuthority, id };
    this.authorities.set(id, authority);
    return authority;
  }

  // Collection History methods
  async getCollectionHistory(residentId: string): Promise<CollectionHistory[]> {
    return Array.from(this.collectionHistory.values())
      .filter(history => history.residentId === residentId)
      .sort((a, b) => {
        const aDate = a.collectionDate?.getTime() ?? 0;
        const bDate = b.collectionDate?.getTime() ?? 0;
        return bDate - aDate;
      });
  }

  async createCollectionHistory(insertHistory: InsertCollectionHistory): Promise<CollectionHistory> {
    const id = randomUUID();
    const history: CollectionHistory = { 
      ...insertHistory, 
      id, 
      collectionDate: new Date(),
      collectorId: insertHistory.collectorId ?? null
    };
    this.collectionHistory.set(id, history);
    return history;
  }

  // Overflow Report methods
  async getAllOverflowReports(): Promise<OverflowReport[]> {
    return Array.from(this.overflowReports.values())
      .sort((a, b) => {
        const aDate = a.reportedAt?.getTime() ?? 0;
        const bDate = b.reportedAt?.getTime() ?? 0;
        return bDate - aDate;
      });
  }

  async getOverflowReportsByCollector(collectorId: string): Promise<OverflowReport[]> {
    return Array.from(this.overflowReports.values())
      .filter(report => report.assignedCollectorId === collectorId);
  }

  async createOverflowReport(insertReport: InsertOverflowReport): Promise<OverflowReport> {
    const id = randomUUID();
    const report: OverflowReport = { 
      ...insertReport, 
      id, 
      reportedAt: new Date(),
      status: insertReport.status ?? "pending",
      assignedCollectorId: insertReport.assignedCollectorId ?? null
    };
    this.overflowReports.set(id, report);
    return report;
  }

  async updateOverflowReportStatus(id: string, status: string, assignedCollectorId?: string): Promise<void> {
    const report = this.overflowReports.get(id);
    if (report) {
      this.overflowReports.set(id, { ...report, status, assignedCollectorId: assignedCollectorId || report.assignedCollectorId });
    }
  }

  // Tips methods
  async getTipsByCollector(collectorId: string): Promise<Tip[]> {
    return Array.from(this.tips.values())
      .filter(tip => tip.toCollectorId === collectorId)
      .sort((a, b) => {
        const aDate = a.sentAt?.getTime() ?? 0;
        const bDate = b.sentAt?.getTime() ?? 0;
        return bDate - aDate;
      });
  }

  async getAllTips(): Promise<Tip[]> {
    return Array.from(this.tips.values())
      .sort((a, b) => {
        const aDate = a.sentAt?.getTime() ?? 0;
        const bDate = b.sentAt?.getTime() ?? 0;
        return bDate - aDate;
      });
  }

  async createTip(insertTip: InsertTip): Promise<Tip> {
    const id = randomUUID();
    const tip: Tip = { ...insertTip, id, sentAt: new Date() };
    this.tips.set(id, tip);
    return tip;
  }

  // Chat methods
  async getPrivateChats(userId1: string, userId2: string): Promise<Chat[]> {
    return Array.from(this.chats.values())
      .filter(chat => 
        chat.chatType === "private" &&
        ((chat.senderId === userId1 && chat.receiverId === userId2) ||
         (chat.senderId === userId2 && chat.receiverId === userId1))
      )
      .sort((a, b) => {
        const aDate = a.sentAt?.getTime() ?? 0;
        const bDate = b.sentAt?.getTime() ?? 0;
        return aDate - bDate;
      });
  }

  async getGroupChats(): Promise<Chat[]> {
    return Array.from(this.chats.values())
      .filter(chat => chat.chatType === "group")
      .sort((a, b) => {
        const aDate = a.sentAt?.getTime() ?? 0;
        const bDate = b.sentAt?.getTime() ?? 0;
        return aDate - bDate;
      });
  }

  async createChat(insertChat: InsertChat): Promise<Chat> {
    const id = randomUUID();
    const chat: Chat = { 
      ...insertChat, 
      id, 
      sentAt: new Date(),
      receiverId: insertChat.receiverId ?? null
    };
    this.chats.set(id, chat);
    return chat;
  }

  // Feedback methods
  async getFeedbackByCollector(collectorId: string): Promise<Feedback[]> {
    return Array.from(this.feedback.values())
      .filter(feedback => feedback.collectorId === collectorId)
      .sort((a, b) => {
        const aDate = a.submittedAt?.getTime() ?? 0;
        const bDate = b.submittedAt?.getTime() ?? 0;
        return bDate - aDate;
      });
  }

  async getAllFeedback(): Promise<Feedback[]> {
    return Array.from(this.feedback.values())
      .sort((a, b) => {
        const aDate = a.submittedAt?.getTime() ?? 0;
        const bDate = b.submittedAt?.getTime() ?? 0;
        return bDate - aDate;
      });
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = randomUUID();
    const feedback: Feedback = { 
      ...insertFeedback, 
      id, 
      submittedAt: new Date(),
      comment: insertFeedback.comment ?? null
    };
    this.feedback.set(id, feedback);
    return feedback;
  }

  // Distribute Request methods
  async getDistributeRequestsByResident(residentId: string): Promise<DistributeRequest[]> {
    return Array.from(this.distributeRequests.values())
      .filter(request => request.residentId === residentId)
      .sort((a, b) => {
        const aDate = a.requestedAt?.getTime() ?? 0;
        const bDate = b.requestedAt?.getTime() ?? 0;
        return bDate - aDate;
      });
  }

  async getPendingDistributeRequests(): Promise<DistributeRequest[]> {
    return Array.from(this.distributeRequests.values())
      .filter(request => request.status === "pending")
      .sort((a, b) => {
        const aDate = a.requestedAt?.getTime() ?? 0;
        const bDate = b.requestedAt?.getTime() ?? 0;
        return bDate - aDate;
      });
  }

  async createDistributeRequest(insertRequest: InsertDistributeRequest): Promise<DistributeRequest> {
    const id = randomUUID();
    const request: DistributeRequest = { 
      ...insertRequest, 
      id, 
      requestedAt: new Date(),
      status: insertRequest.status ?? "pending"
    };
    this.distributeRequests.set(id, request);
    return request;
  }

  async updateDistributeRequestStatus(id: string, status: string): Promise<void> {
    const request = this.distributeRequests.get(id);
    if (request) {
      this.distributeRequests.set(id, { ...request, status });
    }
  }

  // Broadcast methods
  async getAllBroadcasts(): Promise<Broadcast[]> {
    return Array.from(this.broadcasts.values())
      .sort((a, b) => {
        const aDate = a.sentAt?.getTime() ?? 0;
        const bDate = b.sentAt?.getTime() ?? 0;
        return bDate - aDate;
      });
  }

  async createBroadcast(insertBroadcast: InsertBroadcast): Promise<Broadcast> {
    const id = randomUUID();
    const broadcast: Broadcast = { ...insertBroadcast, id, sentAt: new Date() };
    this.broadcasts.set(id, broadcast);
    return broadcast;
  }
}

export const storage = new MemStorage();
