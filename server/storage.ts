// Reference: javascript_database integration blueprint
import {
  services,
  cases,
  posts,
  testimonials,
  contacts,
  adminUsers,
  clients,
  orders,
  orderTasks,
  orderUpdates,
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
  type AdminUser,
  type InsertAdminUser,
  type Client,
  type InsertClient,
  type Order,
  type InsertOrder,
  type OrderTask,
  type InsertOrderTask,
  type OrderUpdate,
  type InsertOrderUpdate,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Services
  getAllServices(): Promise<Service[]>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  getServiceById(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<void>;
  
  // Cases
  getAllCases(): Promise<Case[]>;
  getAllCasesForAdmin(): Promise<Case[]>;
  getCaseBySlug(slug: string): Promise<Case | undefined>;
  getCaseById(id: string): Promise<Case | undefined>;
  createCase(caseData: InsertCase): Promise<Case>;
  updateCase(id: string, caseData: Partial<InsertCase>): Promise<Case | undefined>;
  deleteCase(id: string): Promise<void>;
  getPaginatedCases(page: number, limit: number): Promise<{ data: Case[], total: number, page: number, totalPages: number }>;
  
  // Posts
  getAllPosts(): Promise<Post[]>;
  getAllPostsForAdmin(): Promise<Post[]>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  getPostById(id: string): Promise<Post | undefined>;
  getRecentPosts(limit: number): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: string): Promise<void>;
  getPaginatedPosts(page: number, limit: number): Promise<{ data: Post[], total: number, page: number, totalPages: number }>;
  
  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>;
  getPublishedTestimonials(): Promise<Testimonial[]>;
  getTestimonialById(id: string): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<void>;
  
  // Contacts
  getAllContacts(): Promise<Contact[]>;
  getContactById(id: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContactStatus(id: string, status: string): Promise<Contact | undefined>;
  
  // Admin Users
  getAdminByEmail(email: string): Promise<AdminUser | undefined>;
  createAdmin(admin: InsertAdminUser): Promise<AdminUser>;
  updateAdminLastLogin(id: string): Promise<void>;
  
  // Clients
  getAllClients(): Promise<Client[]>;
  getClientById(id: string): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string): Promise<void>;
  
  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | undefined>;
  getOrdersByClientId(clientId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined>;
  deleteOrder(id: string): Promise<void>;
  updateOrderProgress(id: string, progress: number): Promise<Order | undefined>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Order Tasks
  getTasksByOrderId(orderId: string): Promise<OrderTask[]>;
  getTaskById(id: string): Promise<OrderTask | undefined>;
  createTask(task: InsertOrderTask): Promise<OrderTask>;
  updateTask(id: string, task: Partial<InsertOrderTask>): Promise<OrderTask | undefined>;
  deleteTask(id: string): Promise<void>;
  completeTask(id: string): Promise<OrderTask | undefined>;

  // Order Updates
  getUpdatesByOrderId(orderId: string): Promise<OrderUpdate[]>;
  getUpdateById(id: string): Promise<OrderUpdate | undefined>;
  createUpdate(update: InsertOrderUpdate): Promise<OrderUpdate>;
  deleteUpdate(id: string): Promise<void>;
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

  async getServiceById(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(insertService as any).returning();
    return service;
  }

  async updateService(id: string, updateData: Partial<InsertService>): Promise<Service | undefined> {
    const [service] = await db.update(services).set(updateData as any).where(eq(services.id, id)).returning();
    return service || undefined;
  }

  async deleteService(id: string): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // Cases
  async getAllCases(): Promise<Case[]> {
    return await db.select().from(cases).where(eq(cases.published, true)).orderBy(desc(cases.order));
  }

  async getAllCasesForAdmin(): Promise<Case[]> {
    return await db.select().from(cases).orderBy(desc(cases.order));
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

  async getCaseById(id: string): Promise<Case | undefined> {
    const [caseItem] = await db.select().from(cases).where(eq(cases.id, id));
    return caseItem || undefined;
  }

  async createCase(insertCase: InsertCase): Promise<Case> {
    const [caseItem] = await db.insert(cases).values(insertCase as any).returning();
    return caseItem;
  }

  async updateCase(id: string, updateData: Partial<InsertCase>): Promise<Case | undefined> {
    const [caseItem] = await db.update(cases).set(updateData as any).where(eq(cases.id, id)).returning();
    return caseItem || undefined;
  }

  async deleteCase(id: string): Promise<void> {
    await db.delete(cases).where(eq(cases.id, id));
  }

  // Posts
  async getAllPosts(): Promise<Post[]> {
    return await db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.createdAt));
  }

  async getAllPostsForAdmin(): Promise<Post[]> {
    return await db.select().from(posts).orderBy(desc(posts.createdAt));
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

  async getPostById(id: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post || undefined;
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await db.insert(posts).values(insertPost as any).returning();
    return post;
  }

  async updatePost(id: string, updateData: Partial<InsertPost>): Promise<Post | undefined> {
    const [post] = await db.update(posts).set({ ...updateData, updatedAt: new Date() } as any).where(eq(posts.id, id)).returning();
    return post || undefined;
  }

  async deletePost(id: string): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(testimonials.order);
  }

  async getPublishedTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.published, true)).orderBy(testimonials.order);
  }

  async getTestimonialById(id: string): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial || undefined;
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values(insertTestimonial as any).returning();
    return testimonial;
  }

  async updateTestimonial(id: string, updateData: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const [testimonial] = await db.update(testimonials).set(updateData as any).where(eq(testimonials.id, id)).returning();
    return testimonial || undefined;
  }

  async deleteTestimonial(id: string): Promise<void> {
    await db.delete(testimonials).where(eq(testimonials.id, id));
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

  // Admin Users
  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return admin || undefined;
  }

  async createAdmin(insertAdmin: InsertAdminUser): Promise<AdminUser> {
    const [admin] = await db.insert(adminUsers).values(insertAdmin as any).returning();
    return admin;
  }

  async updateAdminLastLogin(id: string): Promise<void> {
    await db.update(adminUsers).set({ lastLoginAt: new Date() }).where(eq(adminUsers.id, id));
  }

  // Clients
  async getAllClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async getClientById(id: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.email, email));
    return client || undefined;
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await db.insert(clients).values(insertClient as any).returning();
    return client;
  }

  async updateClient(id: string, updateData: Partial<InsertClient>): Promise<Client | undefined> {
    const [client] = await db.update(clients).set(updateData as any).where(eq(clients.id, id)).returning();
    return client || undefined;
  }

  async deleteClient(id: string): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  // Orders
  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrdersByClientId(clientId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.clientId, clientId)).orderBy(desc(orders.createdAt));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder as any).returning();
    return order;
  }

  async updateOrder(id: string, updateData: Partial<InsertOrder>): Promise<Order | undefined> {
    const [order] = await db.update(orders).set({ ...updateData, updatedAt: new Date() } as any).where(eq(orders.id, id)).returning();
    return order || undefined;
  }

  async deleteOrder(id: string): Promise<void> {
    await db.delete(orders).where(eq(orders.id, id));
  }

  async updateOrderProgress(id: string, progress: number): Promise<Order | undefined> {
    const [order] = await db.update(orders).set({ progress, updatedAt: new Date() }).where(eq(orders.id, id)).returning();
    return order || undefined;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [order] = await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id)).returning();
    return order || undefined;
  }

  // Order Tasks
  async getTasksByOrderId(orderId: string): Promise<OrderTask[]> {
    return await db.select().from(orderTasks).where(eq(orderTasks.orderId, orderId)).orderBy(orderTasks.order);
  }

  async getTaskById(id: string): Promise<OrderTask | undefined> {
    const [task] = await db.select().from(orderTasks).where(eq(orderTasks.id, id));
    return task || undefined;
  }

  async createTask(insertTask: InsertOrderTask): Promise<OrderTask> {
    const [task] = await db.insert(orderTasks).values(insertTask as any).returning();
    return task;
  }

  async updateTask(id: string, updateData: Partial<InsertOrderTask>): Promise<OrderTask | undefined> {
    const [task] = await db.update(orderTasks).set({ ...updateData, updatedAt: new Date() } as any).where(eq(orderTasks.id, id)).returning();
    return task || undefined;
  }

  async deleteTask(id: string): Promise<void> {
    await db.delete(orderTasks).where(eq(orderTasks.id, id));
  }

  async completeTask(id: string): Promise<OrderTask | undefined> {
    const [task] = await db.update(orderTasks)
      .set({ status: 'completed', completedAt: new Date(), updatedAt: new Date() })
      .where(eq(orderTasks.id, id))
      .returning();
    return task || undefined;
  }

  // Order Updates
  async getUpdatesByOrderId(orderId: string): Promise<OrderUpdate[]> {
    return await db.select().from(orderUpdates).where(eq(orderUpdates.orderId, orderId)).orderBy(desc(orderUpdates.createdAt));
  }

  async getUpdateById(id: string): Promise<OrderUpdate | undefined> {
    const [update] = await db.select().from(orderUpdates).where(eq(orderUpdates.id, id));
    return update || undefined;
  }

  async createUpdate(insertUpdate: InsertOrderUpdate): Promise<OrderUpdate> {
    const [update] = await db.insert(orderUpdates).values(insertUpdate as any).returning();
    return update;
  }

  async deleteUpdate(id: string): Promise<void> {
    await db.delete(orderUpdates).where(eq(orderUpdates.id, id));
  }
}

export const storage = new DatabaseStorage();
