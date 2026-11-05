import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../src/config/database.js';
import { User } from '../src/modules/auth/user.model.js';

export const DEMO_PASSWORD = process.env.DEMO_ACCOUNTS_PASSWORD || 'DemoPass123!';

export const DEMO_USERS = [
  {
    name: 'Demo Admin',
    email: 'admin@freshfruit.demo',
    role: 'admin',
    phone: '+91 98000 00001',
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Demo Seller',
    email: 'seller@freshfruit.demo',
    role: 'seller',
    phone: '+91 98000 00002',
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Demo Customer',
    email: 'customer@freshfruit.demo',
    role: 'customer',
    phone: '+91 98000 00003',
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Demo Delivery Partner',
    email: 'delivery@freshfruit.demo',
    role: 'delivery_partner',
    phone: '+91 98000 00004',
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Demo Support Agent',
    email: 'support@freshfruit.demo',
    role: 'support_agent',
    phone: '+91 98000 00005',
    isVerified: true,
    isActive: true,
  },
];

export const seedDemoAccounts = async () => {
  console.log('='.repeat(60));
  console.log('Seeding FreshFruit Market Development Demo Accounts');
  console.log('='.repeat(60));

  await connectDB();

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, saltRounds);

  const results = [];

  for (const account of DEMO_USERS) {
    const existing = await User.findOne({ email: account.email });
    if (existing) {
      existing.name = account.name;
      existing.role = account.role;
      existing.passwordHash = passwordHash;
      existing.phone = account.phone;
      existing.isVerified = true;
      existing.isActive = true;
      await existing.save();
      console.log(`[UPDATED]  ${account.role.padEnd(16)} -> ${account.email}`);
      results.push({ action: 'updated', email: account.email, role: account.role });
    } else {
      const created = await User.create({
        ...account,
        passwordHash,
      });
      console.log(`[CREATED]  ${account.role.padEnd(16)} -> ${account.email}`);
      results.push({ action: 'created', email: account.email, role: account.role });
    }
  }

  console.log('-'.repeat(60));
  console.log(`Successfully configured ${results.length} demo accounts.`);
  console.log(`Development Password: ${DEMO_PASSWORD}`);
  console.log('='.repeat(60));

  return results;
};

// Execute if run directly from CLI
if (process.argv[1]?.endsWith('seed-demo-accounts.js')) {
  seedDemoAccounts()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('[SEED ERROR]', err);
      await disconnectDB();
      process.exit(1);
    });
}

