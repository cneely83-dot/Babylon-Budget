import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sql, initDb } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'babylon-budget-secret-key-change-in-production';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Auth Middleware
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ---------------- Health & Status ----------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    databaseConnected: Boolean(sql),
    timestamp: new Date().toISOString(),
  });
});

// ---------------- Auth Routes ----------------
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!sql) {
      return res.status(503).json({ error: 'Database connection not configured (missing DATABASE_URL)' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists
    const existing = await sql`SELECT id FROM users WHERE LOWER(email) = ${normalizedEmail} LIMIT 1`;
    if (existing && existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userName = (name || '').trim() || 'Babylonian';

    const insertedUser = await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${userName}, ${normalizedEmail}, ${passwordHash})
      RETURNING id, name, email, created_at
    `;

    const user = insertedUser[0];

    // Seed empty default profile
    await sql`
      INSERT INTO budget_profiles (user_id, categories)
      VALUES (${user.id}, '["Housing", "Food & dining", "Transportation", "Savings & Investments", "Utilities"]'::jsonb)
      ON CONFLICT (user_id) DO NOTHING
    `;

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error during signup' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!sql) {
      return res.status(503).json({ error: 'Database connection not configured (missing DATABASE_URL)' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const rows = await sql`
      SELECT id, name, email, password_hash
      FROM users
      WHERE LOWER(email) = ${normalizedEmail}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: 'No account found with this email' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    if (!sql) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const rows = await sql`SELECT id, name, email, created_at FROM users WHERE id = ${req.user.id} LIMIT 1`;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: rows[0] });
  } catch (err) {
    console.error('Auth check error:', err);
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
});

// ---------------- Budget & Financials Routes ----------------

// Get full budget profile (categories, incomeSources, bills)
app.get('/api/budget', requireAuth, async (req, res) => {
  try {
    if (!sql) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const userId = req.user.id;

    // 1. Categories & metadata
    const profileRows = await sql`SELECT categories, transactions, bill_payments as "billPayments", bill_payment_history as "billPaymentHistory" FROM budget_profiles WHERE user_id = ${userId} LIMIT 1`;
    const profileRow = profileRows && profileRows[0];
    const categories = profileRow?.categories
      ? (typeof profileRow.categories === 'string' ? JSON.parse(profileRow.categories) : profileRow.categories)
      : ['Housing', 'Food & dining', 'Transportation', 'Savings & Investments', 'Utilities'];

    const transactions = profileRow?.transactions
      ? (typeof profileRow.transactions === 'string' ? JSON.parse(profileRow.transactions) : profileRow.transactions)
      : [];

    const billPayments = profileRow?.billPayments
      ? (typeof profileRow.billPayments === 'string' ? JSON.parse(profileRow.billPayments) : profileRow.billPayments)
      : {};

    const billPaymentHistory = profileRow?.billPaymentHistory
      ? (typeof profileRow.billPaymentHistory === 'string' ? JSON.parse(profileRow.billPaymentHistory) : profileRow.billPaymentHistory)
      : [];

    // 2. Incomes
    const incomeRows = await sql`
      SELECT id, label, estimated_take_home as "estimatedTakeHome", frequency, to_char(last_pay_date, 'YYYY-MM-DD') as "lastPayDate", income_type as "incomeType"
      FROM income_sources
      WHERE user_id = ${userId}
      ORDER BY created_at ASC
    `;

    // 3. Bills
    const billRows = await sql`
      SELECT id, name, anticipated_amount as "anticipatedAmount", due_day as "dueDay", payment_method as "paymentMethod", payment_url as "paymentUrl"
      FROM bills
      WHERE user_id = ${userId}
      ORDER BY due_day ASC
    `;

    res.json({
      profile: {
        categories,
        transactions,
        billPayments,
        billPaymentHistory,
        incomeSources: incomeRows.map((r) => ({
          ...r,
          estimatedTakeHome: Number(r.estimatedTakeHome),
        })),
        bills: billRows.map((r) => ({
          ...r,
          anticipatedAmount: Number(r.anticipatedAmount),
        })),
      },
    });
  } catch (err) {
    console.error('Fetch budget error:', err);
    res.status(500).json({ error: 'Failed to fetch budget profile' });
  }
});

// Save entire budget profile
app.put('/api/budget', requireAuth, async (req, res) => {
  try {
    if (!sql) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const userId = req.user.id;
    const { categories, incomeSources, bills, transactions, billPayments, billPaymentHistory } = req.body;

    // 1. Upsert categories & transactions & bill payments
    const safeCategories = Array.isArray(categories) ? JSON.stringify(categories) : '[]';
    const safeTransactions = Array.isArray(transactions) ? JSON.stringify(transactions) : '[]';
    const safeBillPayments = billPayments && typeof billPayments === 'object' ? JSON.stringify(billPayments) : '{}';
    const safeBillPaymentHistory = Array.isArray(billPaymentHistory) ? JSON.stringify(billPaymentHistory) : '[]';

    await sql`
      INSERT INTO budget_profiles (user_id, categories, transactions, bill_payments, bill_payment_history, updated_at)
      VALUES (${userId}, ${safeCategories}::jsonb, ${safeTransactions}::jsonb, ${safeBillPayments}::jsonb, ${safeBillPaymentHistory}::jsonb, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) DO UPDATE
      SET categories = EXCLUDED.categories,
          transactions = EXCLUDED.transactions,
          bill_payments = EXCLUDED.bill_payments,
          bill_payment_history = EXCLUDED.bill_payment_history,
          updated_at = CURRENT_TIMESTAMP
    `;

    // 2. Sync Income Sources
    if (Array.isArray(incomeSources)) {
      await sql`DELETE FROM income_sources WHERE user_id = ${userId}`;
      for (const inc of incomeSources) {
        await sql`
          INSERT INTO income_sources (id, user_id, label, estimated_take_home, frequency, last_pay_date, income_type)
          VALUES (
            ${inc.id || crypto.randomUUID()},
            ${userId},
            ${inc.label},
            ${Number(inc.estimatedTakeHome) || 0},
            ${inc.frequency || 'biweekly'},
            ${inc.lastPayDate || new Date().toISOString().split('T')[0]},
            ${inc.incomeType || 'salary'}
          )
        `;
      }
    }

    // 3. Sync Bills
    if (Array.isArray(bills)) {
      await sql`DELETE FROM bills WHERE user_id = ${userId}`;
      for (const bill of bills) {
        await sql`
          INSERT INTO bills (id, user_id, name, anticipated_amount, due_day, payment_method, payment_url)
          VALUES (
            ${bill.id || crypto.randomUUID()},
            ${userId},
            ${bill.name},
            ${Number(bill.anticipatedAmount) || 0},
            ${Number(bill.dueDay) || 1},
            ${bill.paymentMethod || 'manual'},
            ${bill.paymentUrl || ''}
          )
        `;
      }
    }

    res.json({ success: true, message: 'Budget profile saved to Neon Postgres' });
  } catch (err) {
    console.error('Save budget error:', err);
    res.status(500).json({ error: 'Failed to save budget profile to database' });
  }
});

// Start Server and Initialize Tables
app.listen(PORT, async () => {
  console.log(`🚀 Babylon Budget API server running on http://localhost:${PORT}`);
  await initDb();
});
