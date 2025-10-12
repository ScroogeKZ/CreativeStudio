import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertServiceSchema, insertCaseSchema, insertPostSchema, insertTestimonialSchema } from "@shared/schema";
import { z } from "zod";
import { authMiddleware, loginAdmin, type AuthRequest } from "./auth";
import { clientAuthMiddleware, registerClient, loginClient, type ClientAuthRequest } from "./clientAuth";
import { contentCache, CACHE_KEYS, clearCacheKey } from "./cache";
import { insertClientSchema, insertOrderSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Services endpoints
  app.get("/api/services", async (req, res) => {
    try {
      // Check cache first
      const cached = contentCache.get(CACHE_KEYS.ALL_SERVICES);
      if (cached) {
        return res.json(cached);
      }

      const services = await storage.getAllServices();
      
      // Cache the result
      contentCache.set(CACHE_KEYS.ALL_SERVICES, services);
      
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:slug", async (req, res) => {
    try {
      const cacheKey = CACHE_KEYS.SERVICE_BY_SLUG(req.params.slug);
      const cached = contentCache.get(cacheKey);
      if (cached) {
        return res.json(cached);
      }

      const service = await storage.getServiceBySlug(req.params.slug);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      contentCache.set(cacheKey, service);
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  // Cases endpoints
  app.get("/api/cases", async (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      // If pagination params provided, use paginated endpoint
      if (page && limit) {
        const cacheKey = `cases_page_${page}_limit_${limit}`;
        const cached = contentCache.get(cacheKey);
        if (cached) {
          return res.json(cached);
        }

        const result = await storage.getPaginatedCases(page, limit);
        contentCache.set(cacheKey, result);
        return res.json(result);
      }

      // Otherwise, return all cases
      const cached = contentCache.get(CACHE_KEYS.ALL_CASES);
      if (cached) {
        return res.json(cached);
      }

      const cases = await storage.getAllCases();
      contentCache.set(CACHE_KEYS.ALL_CASES, cases);
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cases" });
    }
  });

  app.get("/api/cases/:slug", async (req, res) => {
    try {
      const cacheKey = CACHE_KEYS.CASE_BY_SLUG(req.params.slug);
      const cached = contentCache.get(cacheKey);
      if (cached) {
        return res.json(cached);
      }

      const caseItem = await storage.getCaseBySlug(req.params.slug);
      if (!caseItem) {
        return res.status(404).json({ error: "Case not found" });
      }

      contentCache.set(cacheKey, caseItem);
      res.json(caseItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch case" });
    }
  });

  // Posts/Blog endpoints
  app.get("/api/posts", async (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      // If pagination params provided, use paginated endpoint
      if (page && limit) {
        const cacheKey = `posts_page_${page}_limit_${limit}`;
        const cached = contentCache.get(cacheKey);
        if (cached) {
          return res.json(cached);
        }

        const result = await storage.getPaginatedPosts(page, limit);
        contentCache.set(cacheKey, result);
        return res.json(result);
      }

      // If only limit provided (for recent posts)
      if (limit && !page) {
        const cacheKey = CACHE_KEYS.RECENT_POSTS(limit);
        const cached = contentCache.get(cacheKey);
        if (cached) {
          return res.json(cached);
        }

        const posts = await storage.getRecentPosts(limit);
        contentCache.set(cacheKey, posts);
        return res.json(posts);
      }

      // Otherwise, return all posts
      const cached = contentCache.get(CACHE_KEYS.ALL_POSTS);
      if (cached) {
        return res.json(cached);
      }

      const posts = await storage.getAllPosts();
      contentCache.set(CACHE_KEYS.ALL_POSTS, posts);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:slug", async (req, res) => {
    try {
      const cacheKey = CACHE_KEYS.POST_BY_SLUG(req.params.slug);
      const cached = contentCache.get(cacheKey);
      if (cached) {
        return res.json(cached);
      }

      const post = await storage.getPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      contentCache.set(cacheKey, post);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  // Testimonials endpoints
  app.get("/api/testimonials", async (req, res) => {
    try {
      const cached = contentCache.get(CACHE_KEYS.ALL_TESTIMONIALS);
      if (cached) {
        return res.json(cached);
      }

      const testimonials = await storage.getPublishedTestimonials();
      contentCache.set(CACHE_KEYS.ALL_TESTIMONIALS, testimonials);
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  // Contacts endpoints
  app.post("/api/contacts", async (req, res) => {
    try {
      // Import sanitize utility
      const { sanitizeContactData } = await import("./utils/sanitize");
      
      // Sanitize input data
      const sanitizedData = sanitizeContactData(req.body);
      
      // Validate sanitized data
      const validatedData = insertContactSchema.parse(sanitizedData);
      
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid contact data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create contact" });
    }
  });

  // Authentication endpoints
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const result = await loginAdmin(email, password);
      
      if (!result) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Protected admin endpoints
  app.get("/api/admin/contacts", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.patch("/api/admin/contacts/:id/status", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { status } = req.body;
      if (!status || !["new", "contacted", "closed"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const contact = await storage.updateContactStatus(req.params.id, status);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: "Failed to update contact status" });
    }
  });

  // Admin CRUD endpoints for Services
  app.post("/api/admin/services", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      clearCacheKey(CACHE_KEYS.ALL_SERVICES);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid service data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  app.patch("/api/admin/services/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(req.params.id, validatedData);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      clearCacheKey(CACHE_KEYS.ALL_SERVICES);
      clearCacheKey(CACHE_KEYS.SERVICE_BY_SLUG(service.slug));
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid service data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  app.delete("/api/admin/services/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.deleteService(req.params.id);
      clearCacheKey(CACHE_KEYS.ALL_SERVICES);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // Admin CRUD endpoints for Cases
  app.post("/api/admin/cases", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertCaseSchema.parse(req.body);
      const caseItem = await storage.createCase(validatedData);
      clearCacheKey(CACHE_KEYS.ALL_CASES);
      res.status(201).json(caseItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid case data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create case" });
    }
  });

  app.patch("/api/admin/cases/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertCaseSchema.partial().parse(req.body);
      const caseItem = await storage.updateCase(req.params.id, validatedData);
      if (!caseItem) {
        return res.status(404).json({ error: "Case not found" });
      }
      clearCacheKey(CACHE_KEYS.ALL_CASES);
      clearCacheKey(CACHE_KEYS.CASE_BY_SLUG(caseItem.slug));
      res.json(caseItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid case data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update case" });
    }
  });

  app.delete("/api/admin/cases/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.deleteCase(req.params.id);
      clearCacheKey(CACHE_KEYS.ALL_CASES);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete case" });
    }
  });

  // Admin CRUD endpoints for Posts
  app.post("/api/admin/posts", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(validatedData);
      clearCacheKey(CACHE_KEYS.ALL_POSTS);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid post data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  app.patch("/api/admin/posts/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertPostSchema.partial().parse(req.body);
      const post = await storage.updatePost(req.params.id, validatedData);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      clearCacheKey(CACHE_KEYS.ALL_POSTS);
      clearCacheKey(CACHE_KEYS.POST_BY_SLUG(post.slug));
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid post data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update post" });
    }
  });

  app.delete("/api/admin/posts/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.deletePost(req.params.id);
      clearCacheKey(CACHE_KEYS.ALL_POSTS);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete post" });
    }
  });

  // Admin CRUD endpoints for Testimonials
  app.post("/api/admin/testimonials", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      clearCacheKey(CACHE_KEYS.ALL_TESTIMONIALS);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid testimonial data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create testimonial" });
    }
  });

  app.patch("/api/admin/testimonials/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertTestimonialSchema.partial().parse(req.body);
      const testimonial = await storage.updateTestimonial(req.params.id, validatedData);
      if (!testimonial) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      clearCacheKey(CACHE_KEYS.ALL_TESTIMONIALS);
      res.json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid testimonial data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update testimonial" });
    }
  });

  app.delete("/api/admin/testimonials/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.deleteTestimonial(req.params.id);
      clearCacheKey(CACHE_KEYS.ALL_TESTIMONIALS);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete testimonial" });
    }
  });

  // Get all items for admin (including unpublished)
  app.get("/api/admin/services", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/admin/cases", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const cases = await storage.getAllCases();
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cases" });
    }
  });

  app.get("/api/admin/posts", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const posts = await storage.getAllPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.get("/api/admin/testimonials", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  // Client Authentication endpoints
  app.post("/api/client/register", async (req, res) => {
    try {
      const { email, password, name, company, phone } = req.body;
      
      if (!email || !password || !name) {
        return res.status(400).json({ error: "Email, password, and name are required" });
      }

      const result = await registerClient(email, password, name, company, phone);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        return res.status(409).json({ error: "Client with this email already exists" });
      }
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/client/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const result = await loginClient(email, password);
      
      if (!result) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Protected Client endpoints
  app.get("/api/client/me", clientAuthMiddleware, async (req: ClientAuthRequest, res) => {
    try {
      if (!req.client) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      res.json({
        id: req.client.id,
        email: req.client.email,
        name: req.client.name,
        company: req.client.company,
        phone: req.client.phone,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client info" });
    }
  });

  app.get("/api/client/orders", clientAuthMiddleware, async (req: ClientAuthRequest, res) => {
    try {
      if (!req.client) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const orders = await storage.getOrdersByClientId(req.client.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/client/orders/:id", clientAuthMiddleware, async (req: ClientAuthRequest, res) => {
    try {
      if (!req.client) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const order = await storage.getOrderById(req.params.id);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      // Verify order belongs to client
      if (order.clientId !== req.client.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.get("/api/client/portfolio", clientAuthMiddleware, async (req: ClientAuthRequest, res) => {
    try {
      // Get published cases as portfolio examples
      const cases = await storage.getAllCases();
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch portfolio" });
    }
  });

  // Admin endpoints for managing clients and orders
  app.get("/api/admin/clients", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.post("/api/admin/clients", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid client data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  app.patch("/api/admin/clients/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(req.params.id, validatedData);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid client data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  app.delete("/api/admin/clients/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.deleteClient(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete client" });
    }
  });

  app.get("/api/admin/orders", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.post("/api/admin/orders", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid order data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.patch("/api/admin/orders/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertOrderSchema.partial().parse(req.body);
      const order = await storage.updateOrder(req.params.id, validatedData);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid order data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  app.patch("/api/admin/orders/:id/progress", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { progress } = req.body;
      if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({ error: "Progress must be a number between 0 and 100" });
      }
      const order = await storage.updateOrderProgress(req.params.id, progress);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order progress" });
    }
  });

  app.patch("/api/admin/orders/:id/status", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ["pending", "in_progress", "review", "completed", "cancelled"];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status. Must be one of: " + validStatuses.join(", ") });
      }
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  app.delete("/api/admin/orders/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.deleteOrder(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete order" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
