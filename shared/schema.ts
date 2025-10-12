import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Multilingual text type
const multilingualTextSchema = z.object({
  ru: z.string(),
  kz: z.string(),
  en: z.string(),
});

// Service Directions
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug").notNull().unique(),
  name: jsonb("name").$type<{ ru: string; kz: string; en: string }>().notNull(),
  subtitle: jsonb("subtitle").$type<{ ru: string; kz: string; en: string }>().notNull(),
  description: jsonb("description").$type<{ ru: string; kz: string; en: string }>().notNull(),
  color: varchar("color").notNull(), // digital, communication, research, tech
  features: jsonb("features").$type<string[]>().notNull().default([]),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Case Studies
export const cases = pgTable("cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug").notNull().unique(),
  title: jsonb("title").$type<{ ru: string; kz: string; en: string }>().notNull(),
  client: varchar("client").notNull(),
  category: varchar("category").notNull(),
  image: text("image").notNull(),
  thumbnail: text("thumbnail").notNull(),
  shortResult: jsonb("short_result").$type<{ ru: string; kz: string; en: string }>().notNull(),
  challenge: jsonb("challenge").$type<{ ru: string; kz: string; en: string }>().notNull(),
  solution: jsonb("solution").$type<{ ru: string; kz: string; en: string }>().notNull(),
  results: jsonb("results").$type<{ ru: string; kz: string; en: string }>().notNull(),
  kpi: jsonb("kpi").$type<Array<{ label: { ru: string; kz: string; en: string }; value: string }>>().notNull(),
  screenshots: jsonb("screenshots").$type<string[]>().notNull().default([]),
  published: boolean("published").notNull().default(true),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blog Posts
export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug").notNull().unique(),
  title: jsonb("title").$type<{ ru: string; kz: string; en: string }>().notNull(),
  excerpt: jsonb("excerpt").$type<{ ru: string; kz: string; en: string }>().notNull(),
  content: jsonb("content").$type<{ ru: string; kz: string; en: string }>().notNull(),
  coverImage: text("cover_image").notNull(),
  category: varchar("category").notNull(),
  author: varchar("author").notNull().default("CreativeStudio"),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientName: varchar("client_name").notNull(),
  clientPosition: jsonb("client_position").$type<{ ru: string; kz: string; en: string }>().notNull(),
  companyName: varchar("company_name").notNull(),
  avatar: text("avatar"),
  quote: jsonb("quote").$type<{ ru: string; kz: string; en: string }>().notNull(),
  rating: integer("rating").notNull().default(5),
  published: boolean("published").notNull().default(true),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Contact Form Submissions
export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  company: varchar("company"),
  message: text("message").notNull(),
  status: varchar("status").notNull().default("new"), // new, contacted, closed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Admin Users
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
});

// Client Users
export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name").notNull(),
  company: varchar("company"),
  phone: varchar("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
});

// Client Orders
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id, { onDelete: 'cascade' }),
  title: jsonb("title").$type<{ ru: string; kz: string; en: string }>().notNull(),
  description: jsonb("description").$type<{ ru: string; kz: string; en: string }>().notNull(),
  status: varchar("status").notNull().default("pending"), // pending, in_progress, review, completed, cancelled
  progress: integer("progress").notNull().default(0), // 0-100
  serviceType: varchar("service_type").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  caseId: varchar("case_id").references(() => cases.id), // Optional: link to case study when completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const clientsRelations = relations(clients, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  client: one(clients, {
    fields: [orders.clientId],
    references: [clients.id],
  }),
  case: one(cases, {
    fields: [orders.caseId],
    references: [cases.id],
  }),
}));

// Insert Schemas
export const insertServiceSchema = createInsertSchema(services).omit({ id: true, createdAt: true });
export const insertCaseSchema = createInsertSchema(cases).omit({ id: true, createdAt: true });
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true, createdAt: true });
export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true, status: true }).extend({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  phone: z.string().max(20, "Phone too long").optional(),
  company: z.string().max(100, "Company name too long").optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message too long"),
});
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({ id: true, createdAt: true, lastLoginAt: true });
export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true, lastLoginAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type Case = typeof cases.$inferSelect;
export type InsertCase = z.infer<typeof insertCaseSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
