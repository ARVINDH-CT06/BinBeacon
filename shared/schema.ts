import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'resident', 'collector', 'authority'
  createdAt: timestamp("created_at").defaultNow(),
});

export const residents = pgTable("residents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  doorNumber: text("door_number").notNull().unique(),
  address: text("address").notNull(),
  beaconScore: integer("beacon_score").default(80),
  isAvailable: boolean("is_available").default(true),
});

export const collectors = pgTable("collectors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  employeeId: text("employee_id").notNull().unique(),
  areaAssigned: text("area_assigned").notNull(),
  collectionProgress: integer("collection_progress").default(0),
});

export const authorities = pgTable("authorities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  authorityName: text("authority_name").notNull(),
  employeeId: text("employee_id").notNull().unique(),
  email: text("email").notNull(),
});

export const collectionHistory = pgTable("collection_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  residentId: varchar("resident_id").references(() => residents.id).notNull(),
  collectorId: varchar("collector_id").references(() => collectors.id),
  wasteType: text("waste_type").notNull(),
  status: text("status").notNull(), // 'collected', 'pending', 'reported'
  collectionDate: timestamp("collection_date").defaultNow(),
});

export const overflowReports = pgTable("overflow_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  residentId: varchar("resident_id").references(() => residents.id).notNull(),
  overflowType: text("overflow_type").notNull(),
  location: jsonb("location").notNull(), // {lat, lng, address}
  status: text("status").default("pending"), // 'pending', 'assigned', 'resolved'
  assignedCollectorId: varchar("assigned_collector_id").references(() => collectors.id),
  reportedAt: timestamp("reported_at").defaultNow(),
});

export const tips = pgTable("tips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromResidentId: varchar("from_resident_id").references(() => residents.id).notNull(),
  toCollectorId: varchar("to_collector_id").references(() => collectors.id).notNull(),
  amount: integer("amount").notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
});

export const chats = pgTable("chats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  receiverId: varchar("receiver_id").references(() => users.id),
  message: text("message").notNull(),
  chatType: text("chat_type").notNull(), // 'private', 'group'
  sentAt: timestamp("sent_at").defaultNow(),
});

export const feedback = pgTable("feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  residentId: varchar("resident_id").references(() => residents.id).notNull(),
  collectorId: varchar("collector_id").references(() => collectors.id).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const distributeRequests = pgTable("distribute_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  residentId: varchar("resident_id").references(() => residents.id).notNull(),
  itemType: text("item_type").notNull(),
  status: text("status").default("pending"), // 'pending', 'accepted', 'ignored'
  requestedAt: timestamp("requested_at").defaultNow(),
});

export const broadcasts = pgTable("broadcasts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorityId: varchar("authority_id").references(() => authorities.id).notNull(),
  message: text("message").notNull(),
  targetAudience: text("target_audience").notNull(), // 'all', 'residents', 'collectors'
  sentAt: timestamp("sent_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertResidentSchema = createInsertSchema(residents).omit({
  id: true,
});

export const insertCollectorSchema = createInsertSchema(collectors).omit({
  id: true,
});

export const insertAuthoritySchema = createInsertSchema(authorities).omit({
  id: true,
});

export const insertCollectionHistorySchema = createInsertSchema(collectionHistory).omit({
  id: true,
  collectionDate: true,
});

export const insertOverflowReportSchema = createInsertSchema(overflowReports).omit({
  id: true,
  reportedAt: true,
});

export const insertTipSchema = createInsertSchema(tips).omit({
  id: true,
  sentAt: true,
});

export const insertChatSchema = createInsertSchema(chats).omit({
  id: true,
  sentAt: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  submittedAt: true,
});

export const insertDistributeRequestSchema = createInsertSchema(distributeRequests).omit({
  id: true,
  requestedAt: true,
});

export const insertBroadcastSchema = createInsertSchema(broadcasts).omit({
  id: true,
  sentAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Resident = typeof residents.$inferSelect;
export type InsertResident = z.infer<typeof insertResidentSchema>;
export type Collector = typeof collectors.$inferSelect;
export type InsertCollector = z.infer<typeof insertCollectorSchema>;
export type Authority = typeof authorities.$inferSelect;
export type InsertAuthority = z.infer<typeof insertAuthoritySchema>;
export type CollectionHistory = typeof collectionHistory.$inferSelect;
export type InsertCollectionHistory = z.infer<typeof insertCollectionHistorySchema>;
export type OverflowReport = typeof overflowReports.$inferSelect;
export type InsertOverflowReport = z.infer<typeof insertOverflowReportSchema>;
export type Tip = typeof tips.$inferSelect;
export type InsertTip = z.infer<typeof insertTipSchema>;
export type Chat = typeof chats.$inferSelect;
export type InsertChat = z.infer<typeof insertChatSchema>;
export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type DistributeRequest = typeof distributeRequests.$inferSelect;
export type InsertDistributeRequest = z.infer<typeof insertDistributeRequestSchema>;
export type Broadcast = typeof broadcasts.$inferSelect;
export type InsertBroadcast = z.infer<typeof insertBroadcastSchema>;
