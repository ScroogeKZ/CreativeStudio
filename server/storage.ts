// Reference: javascript_database integration blueprint
import {
  services,
  cases,
  posts,
  testimonials,
  contacts,
  type Service,
  type InsertService,
  type Case,
  type InsertCase,
  type Post,
  type InsertPost,
  type Testimonial,
  type InsertTestimonial,
  type Contact,
  type InsertContact,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Services
  getAllServices(): Promise<Service[]>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  
  // Cases
  getAllCases(): Promise<Case[]>;
  getCaseBySlug(slug: string): Promise<Case | undefined>;
  createCase(caseData: InsertCase): Promise<Case>;
  getPaginatedCases(page: number, limit: number): Promise<{ data: Case[], total: number, page: number, totalPages: number }>;
  
  // Posts
  getAllPosts(): Promise<Post[]>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  getRecentPosts(limit: number): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  getPaginatedPosts(page: number, limit: number): Promise<{ data: Post[], total: number, page: number, totalPages: number }>;
  
  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>;
  getPublishedTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Contacts
  getAllContacts(): Promise<Contact[]>;
  getContactById(id: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContactStatus(id: string, status: string): Promise<Contact | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Services
  async getAllServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(services.order);
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.slug, slug));
    return service || undefined;
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(insertService as any).returning();
    return service;
  }

  // Cases
  async getAllCases(): Promise<Case[]> {
    return await db.select().from(cases).where(eq(cases.published, true)).orderBy(desc(cases.order));
  }

  async getPaginatedCases(page: number = 1, limit: number = 10): Promise<{ data: Case[], total: number, page: number, totalPages: number }> {
    const offset = (page - 1) * limit;
    
    const [casesData, countResult] = await Promise.all([
      db.select().from(cases).where(eq(cases.published, true)).orderBy(desc(cases.order)).limit(limit).offset(offset),
      db.select({ count: cases.id }).from(cases).where(eq(cases.published, true))
    ]);

    const total = countResult.length;
    const totalPages = Math.ceil(total / limit);

    return {
      data: casesData,
      total,
      page,
      totalPages
    };
  }

  async getCaseBySlug(slug: string): Promise<Case | undefined> {
    const [caseItem] = await db.select().from(cases).where(eq(cases.slug, slug));
    return caseItem || undefined;
  }

  async createCase(insertCase: InsertCase): Promise<Case> {
    const [caseItem] = await db.insert(cases).values(insertCase as any).returning();
    return caseItem;
  }

  // Posts
  async getAllPosts(): Promise<Post[]> {
    return await db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.createdAt));
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
    return post || undefined;
  }

  async getRecentPosts(limit: number): Promise<Post[]> {
    return await db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.createdAt)).limit(limit);
  }

  async getPaginatedPosts(page: number = 1, limit: number = 10): Promise<{ data: Post[], total: number, page: number, totalPages: number }> {
    const offset = (page - 1) * limit;
    
    const [postsData, countResult] = await Promise.all([
      db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.createdAt)).limit(limit).offset(offset),
      db.select({ count: posts.id }).from(posts).where(eq(posts.published, true))
    ]);

    const total = countResult.length;
    const totalPages = Math.ceil(total / limit);

    return {
      data: postsData,
      total,
      page,
      totalPages
    };
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await db.insert(posts).values(insertPost as any).returning();
    return post;
  }

  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(testimonials.order);
  }

  async getPublishedTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.published, true)).orderBy(testimonials.order);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values(insertTestimonial as any).returning();
    return testimonial;
  }

  // Contacts
  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getContactById(id: string): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact || undefined;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact as any).returning();
    return contact;
  }

  async updateContactStatus(id: string, status: string): Promise<Contact | undefined> {
    const [contact] = await db.update(contacts).set({ status }).where(eq(contacts.id, id)).returning();
    return contact || undefined;
  }
}

export const storage = new DatabaseStorage();
