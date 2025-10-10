import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { z } from "zod";
import { authMiddleware, loginAdmin, type AuthRequest } from "./auth";
import { contentCache, CACHE_KEYS, clearCacheKey } from "./cache";

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

  const httpServer = createServer(app);

  return httpServer;
}
