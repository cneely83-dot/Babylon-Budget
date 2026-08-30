import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

console.log('----------------------------------------------------');
console.log('Babylon Budget - Neon PostgreSQL Connection Test');
console.log('----------------------------------------------------');

if (!connectionString || connectionString.trim() === '') {
  console.error('❌ Error: DATABASE_URL is empty in your .env file.');
  console.log('\nTo fix:');
  console.log('1. Open your .env file in VS Code');
  console.log('2. Set DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"');
  console.log('3. Run this task again to verify.');
  process.exit(1);
}

try {
  const sql = neon(connectionString);
  console.log('⏳ Connecting to Neon PostgreSQL...');
  
  const result = await sql`SELECT NOW() as current_time, current_database() as db_name, version() as version`;
  
  console.log('✅ Connection successful!');
  console.log(`Connected Database: ${result[0].db_name}`);
  console.log(`Server Time:        ${result[0].current_time}`);
  console.log('----------------------------------------------------');
} catch (err) {
  console.error('❌ Database connection failed:');
  console.error(err.message || err);
  console.log('\nPlease check that your connection string in .env includes ?sslmode=require and your credentials are correct.');
  process.exit(1);
}
