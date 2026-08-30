import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('⚠️  DATABASE_URL is not defined in .env. Server running in database-pending mode.');
}

// SQL executor using Neon serverless driver over HTTP (fast, connection-poolless)
export const sql = connectionString ? neon(connectionString) : null;

export async function initDb() {
  if (!sql) {
    console.log('ℹ️  Skipping Neon table initialization because DATABASE_URL is not set.');
    return;
  }

  try {
    // 1. Users
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Budget Profiles
    await sql`
      CREATE TABLE IF NOT EXISTS budget_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        categories JSONB NOT NULL DEFAULT '["Housing", "Food & dining", "Transportation", "Savings & Investments", "Utilities"]'::jsonb,
        transactions JSONB NOT NULL DEFAULT '[]'::jsonb,
        bill_payments JSONB NOT NULL DEFAULT '{}'::jsonb,
        bill_payment_history JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Ensure columns exist if table was previously created
    await sql`
      ALTER TABLE budget_profiles ADD COLUMN IF NOT EXISTS transactions JSONB NOT NULL DEFAULT '[]'::jsonb;
    `;
    await sql`
      ALTER TABLE budget_profiles ADD COLUMN IF NOT EXISTS bill_payments JSONB NOT NULL DEFAULT '{}'::jsonb;
    `;
    await sql`
      ALTER TABLE budget_profiles ADD COLUMN IF NOT EXISTS bill_payment_history JSONB NOT NULL DEFAULT '[]'::jsonb;
    `;

    // 3. Income Sources
    await sql`
      CREATE TABLE IF NOT EXISTS income_sources (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        label VARCHAR(255) NOT NULL,
        estimated_take_home NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
        frequency VARCHAR(50) NOT NULL DEFAULT 'biweekly',
        last_pay_date DATE NOT NULL,
        income_type VARCHAR(50) NOT NULL DEFAULT 'salary',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 4. Bills
    await sql`
      CREATE TABLE IF NOT EXISTS bills (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        anticipated_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
        due_day INT NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
        payment_method VARCHAR(50) NOT NULL DEFAULT 'manual',
        payment_url TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('✅ Neon PostgreSQL tables verified/initialized successfully.');
  } catch (err) {
    console.error('❌ Error initializing Neon database tables:', err);
  }
}
