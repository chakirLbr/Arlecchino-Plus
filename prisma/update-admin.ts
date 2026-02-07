import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local first, then fall back to .env
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables');
    console.log('');
    console.log('Usage:');
    console.log('  ADMIN_EMAIL="your@email.com" ADMIN_PASSWORD="yourpassword" npx tsx prisma/update-admin.ts');
    console.log('');
    console.log('Or add them to your .env.local file and run:');
    console.log('  npx tsx prisma/update-admin.ts');
    process.exit(1);
  }

  console.log('🔐 Updating admin credentials...');

  // Hash the password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  // Update or create admin user
  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
    },
    create: {
      email: adminEmail,
      passwordHash,
      firstName: 'Admin',
      lastName: 'Arlecchino',
      role: 'OWNER',
      isActive: true,
    },
  });

  console.log('');
  console.log('✅ Admin credentials updated successfully!');
  console.log(`   Email: ${adminEmail}`);
  console.log(`   ID: ${admin.id}`);
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Update failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
