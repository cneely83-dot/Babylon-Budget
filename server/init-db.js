import { initDb, sql } from './db.js';

console.log('⏳ Initializing Neon PostgreSQL database schema...');
await initDb();

const tables = await sql`
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  ORDER BY table_name;
`;

console.log('📋 Existing tables in Neon PostgreSQL:');
tables.forEach(t => console.log(`   - ${t.table_name}`));
console.log('✅ Schema initialization complete!');
process.exit(0);
