import { db } from '../server/db';
import { adminUsers } from '../shared/schema';
import { hashPassword } from '../server/auth';

async function createAdmin() {
  const email = 'admin@creativestudio.com';
  const password = 'admin123';
  const name = 'Admin';

  try {
    // Check if admin already exists
    const existing = await db.select().from(adminUsers).where((adminUsers) => adminUsers.email === email);
    
    if (existing.length > 0) {
      console.log('❌ Admin user already exists');
      process.exit(1);
    }

    // Create admin
    const passwordHash = await hashPassword(password);
    const [admin] = await db
      .insert(adminUsers)
      .values({
        email,
        passwordHash,
        name,
      } as any)
      .returning();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('');
    console.log('⚠️  Please change the password after first login!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
