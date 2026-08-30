export type PayFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly'
export type ExpenseFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly'
export type PaymentMethod = 'autopay' | 'manual'
export type IncomeType = 'hourly' | 'salary'

export interface IncomeSource {
  id: string
  label: string
  estimatedTakeHome: number
  frequency: PayFrequency
  lastPayDate: string
  incomeType: IncomeType
}

export interface Bill {
  id: string
  name: string
  anticipatedAmount: number
  dueDay: number
  paymentMethod: PaymentMethod
  paymentUrl: string
}

export interface ExpenseCategory {
  id: string
  name: string
  budgetedAmount: number
  frequency: ExpenseFrequency
}

export interface BillPaymentRecord {
  billId: string
  actualAmount?: number | string | null
  confirmationCode: string
  paid: boolean
  paidAt?: string
}

export interface BillPaymentHistoryEntry {
  id: string
  billId: string
  billName: string
  amount: number
  paidAt: string
  confirmationCode?: string
}

export interface ExpenseTransaction {
  id: string
  date: string
  description: string
  categoryId: string
  amount: number
}

export interface BudgetProfile {
  categories: ExpenseCategory[]
  bills: Bill[]
  incomeSources: IncomeSource[]
  billPayments?: Record<string, BillPaymentRecord> // billId -> record
  billPaymentHistory?: BillPaymentHistoryEntry[]
  transactions?: ExpenseTransaction[]
}

export const starterCategories: ExpenseCategory[] = [
  { id: 'cat-1', name: 'Groceries', budgetedAmount: 600, frequency: 'monthly' },
  { id: 'cat-2', name: 'Fuel & Transportation', budgetedAmount: 200, frequency: 'monthly' },
  { id: 'cat-3', name: 'Eating Out & Coffee', budgetedAmount: 250, frequency: 'monthly' },
  { id: 'cat-4', name: 'Clothing & Shopping', budgetedAmount: 100, frequency: 'monthly' },
  { id: 'cat-5', name: 'Housing & Utilities', budgetedAmount: 150, frequency: 'monthly' },
]

export function normalizeCategories(rawCategories: unknown): ExpenseCategory[] {
  if (!Array.isArray(rawCategories)) return starterCategories
  return rawCategories.map((item, idx) => {
    if (typeof item === 'string') {
      return {
        id: `cat-legacy-${idx}-${Date.now()}`,
        name: item,
        budgetedAmount: 0,
        frequency: 'monthly',
      }
    }
    if (typeof item === 'object' && item !== null && 'name' in item) {
      const obj = item as Record<string, unknown>
      return {
        id: (obj.id as string) || `cat-${idx}-${Date.now()}`,
        name: (obj.name as string) || 'Untitled Category',
        budgetedAmount: Number(obj.budgetedAmount) || 0,
        frequency: (obj.frequency as ExpenseFrequency) || 'monthly',
      }
    }
    return {
      id: `cat-${idx}-${Date.now()}`,
      name: String(item),
      budgetedAmount: 0,
      frequency: 'monthly',
    }
  })
}

export interface UserAccount {
  id: string
  name: string
  email: string
  password?: string
  token?: string
  createdAt: string
  profile?: BudgetProfile
}

const PROFILE_STORAGE_KEY = 'babylon-budget.profile'
const USERS_STORAGE_KEY = 'babylon-budget.users'
const CURRENT_USER_KEY = 'babylon-budget.current-user'
const API_BASE_URL = 'http://localhost:4000/api'

export function getUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UserAccount[]) : []
  } catch {
    return []
  }
}

function saveUsers(users: UserAccount[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export function getCurrentUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    return raw ? (JSON.parse(raw) as UserAccount) : null
  } catch {
    return null
  }
}

export function setCurrentUser(user: UserAccount | null) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

// ---------------- Hybrid (Neon API + LocalStorage Fallback) ----------------

export async function signupUserAsync(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: UserAccount }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    if (response.ok) {
      const data = await response.json()
      const user: UserAccount = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        token: data.token,
        createdAt: new Date().toISOString(),
      }
      setCurrentUser(user)
      return { success: true, user }
    } else {
      const err = await response.json().catch(() => ({}))
      if (response.status === 409 || response.status === 400) {
        return { success: false, error: err.error || 'Signup failed' }
      }
    }
  } catch {
    console.warn('Neon backend unreachable, using local storage fallback.')
  }

  // Fallback to local storage if server is down
  return signupUserLocal(name, email, password)
}

export async function loginUserAsync(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: UserAccount }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const data = await response.json()
      const user: UserAccount = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        token: data.token,
        createdAt: new Date().toISOString(),
      }
      setCurrentUser(user)
      return { success: true, user }
    } else {
      const err = await response.json().catch(() => ({}))
      if (response.status === 401 || response.status === 400) {
        return { success: false, error: err.error || 'Login failed' }
      }
    }
  } catch {
    console.warn('Neon backend unreachable, using local storage fallback.')
  }

  // Fallback to local storage
  return loginUserLocal(email, password)
}

function signupUserLocal(
  name: string,
  email: string,
  password: string
): { success: boolean; error?: string; user?: UserAccount } {
  const users = getUsers()
  const normalizedEmail = email.trim().toLowerCase()

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'An account with this email already exists. Please log in.' }
  }

  const newUser: UserAccount = {
    id: crypto.randomUUID(),
    name: name.trim() || 'Babylonian',
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)
  setCurrentUser(newUser)

  return { success: true, user: newUser }
}

function loginUserLocal(
  email: string,
  password: string
): { success: boolean; error?: string; user?: UserAccount } {
  const users = getUsers()
  const normalizedEmail = email.trim().toLowerCase()
  const found = users.find((u) => u.email.toLowerCase() === normalizedEmail)

  if (!found) {
    return { success: false, error: 'No account found with this email. Please sign up.' }
  }

  if (found.password !== password) {
    return { success: false, error: 'Incorrect password. Please try again.' }
  }

  setCurrentUser(found)
  return { success: true, user: found }
}

export function logoutUser() {
  setCurrentUser(null)
}

export async function loadBudgetProfileAsync(user?: UserAccount | null): Promise<BudgetProfile | null> {
  if (user?.token) {
    try {
      const res = await fetch(`${API_BASE_URL}/budget`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      if (res.ok) {
        const data = await res.json()
        if (data.profile) {
          const normalizedProfile: BudgetProfile = {
            ...data.profile,
            categories: normalizeCategories(data.profile.categories),
          }
          saveBudgetProfileLocal(normalizedProfile, user.id)
          return normalizedProfile
        }
      }
    } catch {
      console.warn('Failed to load from Neon API, falling back to local copy.')
    }
  }

  return loadBudgetProfile(user?.id)
}

export async function saveBudgetProfileAsync(profile: BudgetProfile, user?: UserAccount | null): Promise<void> {
  // Always save locally immediately
  saveBudgetProfileLocal(profile, user?.id)

  if (user?.token) {
    try {
      await fetch(`${API_BASE_URL}/budget`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(profile),
      })
    } catch (err) {
      console.warn('Could not sync to Neon backend immediately (offline mode active):', err)
    }
  }
}

export function loadBudgetProfile(userId?: string): BudgetProfile | null {
  if (userId) {
    const users = getUsers()
    const user = users.find((u) => u.id === userId)
    if (user?.profile) {
      return {
        ...user.profile,
        categories: normalizeCategories(user.profile.categories),
      }
    }
  }

  const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY)
  if (!savedProfile) return null

  try {
    const parsed = JSON.parse(savedProfile) as BudgetProfile
    return {
      ...parsed,
      categories: normalizeCategories(parsed.categories),
    }
  } catch {
    localStorage.removeItem(PROFILE_STORAGE_KEY)
    return null
  }
}

function saveBudgetProfileLocal(profile: BudgetProfile, userId?: string) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))

  if (userId) {
    const users = getUsers()
    const index = users.findIndex((u) => u.id === userId)
    if (index !== -1) {
      users[index].profile = profile
      saveUsers(users)
      const currentUser = getCurrentUser()
      if (currentUser && currentUser.id === userId) {
        currentUser.profile = profile
        setCurrentUser(currentUser)
      }
    }
  }
}

export function computeNextPayDate(lastPayDateStr: string, frequency: PayFrequency, refDate = new Date()): Date {
  if (!lastPayDateStr) {
    const next = new Date(refDate)
    next.setDate(next.getDate() + 14)
    return next
  }

  const current = new Date(`${lastPayDateStr}T00:00:00`)
  const today = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate())

  if (isNaN(current.getTime())) {
    const next = new Date(today)
    next.setDate(next.getDate() + 14)
    return next
  }

  // If last pay date is in the future, return it
  if (current > today) {
    return current
  }

  // Advance pay date according to frequency until it is strictly after today
  const nextPay = new Date(current)
  while (nextPay <= today) {
    switch (frequency) {
      case 'weekly':
        nextPay.setDate(nextPay.getDate() + 7)
        break
      case 'biweekly':
        nextPay.setDate(nextPay.getDate() + 14)
        break
      case 'semimonthly':
        // Twice a month: advance roughly 15 days or switch between 1st/15th/end of month
        if (nextPay.getDate() <= 15) {
          nextPay.setDate(15)
          if (nextPay <= current) {
            // move to end of month
            nextPay.setMonth(nextPay.getMonth() + 1, 0)
          }
        } else {
          nextPay.setMonth(nextPay.getMonth() + 1, 1)
        }
        break
      case 'monthly':
        nextPay.setMonth(nextPay.getMonth() + 1)
        break
      default:
        nextPay.setDate(nextPay.getDate() + 14)
        break
    }
  }

  return nextPay
}

export function computeBillNextDueDate(dueDay: number, refDate = new Date()): Date {
  const year = refDate.getFullYear()
  const month = refDate.getMonth()
  const todayDate = refDate.getDate()

  // Clamp dueDay to max days in current month
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate()
  const validDueDay = Math.min(Math.max(1, dueDay), daysInCurrentMonth)

  if (validDueDay >= todayDate) {
    return new Date(year, month, validDueDay)
  } else {
    // Falls in next month
    const nextMonth = month + 1
    const daysInNextMonth = new Date(year, nextMonth + 1, 0).getDate()
    const validNextDueDay = Math.min(Math.max(1, dueDay), daysInNextMonth)
    return new Date(year, nextMonth, validNextDueDay)
  }
}

export function splitBillsByNextPaycheck(
  bills: Bill[],
  incomeSources: IncomeSource[],
  refDate = new Date()
): {
  nextPayDate: Date
  incomeSource: IncomeSource | null
  billsBeforeNextPay: (Bill & { nextDueDate: Date })[]
  billsAfterNextPay: (Bill & { nextDueDate: Date })[]
} {
  const primaryIncome = incomeSources.length > 0 ? incomeSources[0] : null
  const nextPayDate = primaryIncome
    ? computeNextPayDate(primaryIncome.lastPayDate, primaryIncome.frequency, refDate)
    : new Date(refDate.getTime() + 14 * 24 * 60 * 60 * 1000)

  const billsWithDates = bills.map((b) => ({
    ...b,
    nextDueDate: computeBillNextDueDate(b.dueDay, refDate),
  }))

  const billsBeforeNextPay: (Bill & { nextDueDate: Date })[] = []
  const billsAfterNextPay: (Bill & { nextDueDate: Date })[] = []

  // Compare bill's next due date with nextPayDate
  for (const b of billsWithDates) {
    // Normalizing to midnight timestamps
    const billTime = new Date(b.nextDueDate.getFullYear(), b.nextDueDate.getMonth(), b.nextDueDate.getDate()).getTime()
    const payTime = new Date(nextPayDate.getFullYear(), nextPayDate.getMonth(), nextPayDate.getDate()).getTime()

    if (billTime <= payTime) {
      billsBeforeNextPay.push(b)
    } else {
      billsAfterNextPay.push(b)
    }
  }

  // Sort each by due date
  billsBeforeNextPay.sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime())
  billsAfterNextPay.sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime())

  return {
    nextPayDate,
    incomeSource: primaryIncome,
    billsBeforeNextPay,
    billsAfterNextPay,
  }
}
