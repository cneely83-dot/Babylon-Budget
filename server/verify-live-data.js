import { sql } from './db.js';

console.log('----------------------------------------------------');
console.log('Live Records in Neon PostgreSQL:');
console.log('----------------------------------------------------');

const users = await sql`SELECT id, name, email, created_at FROM users`;
console.log(`👤 Users (${users.length}):`);
users.forEach(u => console.log(`   - ${u.name} (${u.email}) [ID: ${u.id}]`));

const profiles = await sql`SELECT user_id, categories FROM budget_profiles`;
console.log(`\n📂 Budget Profiles (${profiles.length}):`);
profiles.forEach(p => console.log(`   - Categories: ${JSON.stringify(p.categories)}`));

const incomes = await sql`SELECT user_id, label, estimated_take_home, frequency, last_pay_date FROM income_sources`;
console.log(`\n💰 Income Sources (${incomes.length}):`);
incomes.forEach(i => console.log(`   - ${i.label}: $${i.estimated_take_home} (${i.frequency})`));

const bills = await sql`SELECT user_id, name, anticipated_amount, due_day, payment_url FROM bills`;
console.log(`\n💳 Bills (${bills.length}):`);
bills.forEach(b => console.log(`   - ${b.name}: $${b.anticipated_amount} (Due day: ${b.due_day})`));

console.log('----------------------------------------------------');
