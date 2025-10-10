import { createAdminUser } from "./auth";

async function createFirstAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || "admin@creativestudio.kz";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const name = process.env.ADMIN_NAME || "Admin";

    console.log("Creating admin user...");
    const admin = await createAdminUser(email, password, name);
    
    console.log("✅ Admin user created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("⚠️ IMPORTANT: Change the password after first login!");
    
    process.exit(0);
  } catch (error: any) {
    if (error.code === '23505') { // Unique constraint violation
      console.log("⚠️ Admin user already exists");
      process.exit(0);
    }
    console.error("❌ Failed to create admin:", error);
    process.exit(1);
  }
}

createFirstAdmin();
