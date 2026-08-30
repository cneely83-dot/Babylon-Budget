import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetPath = path.join(__dirname, 'src', 'App.tsx');

const code = `import { FormEvent, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Coins,
  CreditCard,
  ExternalLink,
  Flame,
  Globe,
  Landmark,
  Lock,
  Mail,
  Pencil,
  PieChart,
  Plus,
  Receipt,
  Scale,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  TrendingUp,
  User,
  Wallet,
  X,
  Save,
  Check,
  Clock,
  DollarSign,
} from 'lucide-react'
import {
  type Bill,
  type BillPaymentRecord,
  type BudgetProfile,
  type CodedExpenseRow,
  type ExpenseCategory,
  type ExpenseFrequency,
  type IncomeSource,
  type IncomeType,
  type PayFrequency,
  type PaymentMethod,
  type UserAccount,
  computeNextPayDate,
  getCurrentUser,
  loadBudgetProfile,
  loadBudgetProfileAsync,
  loginUserAsync,
  logoutUser,
  saveBudgetProfileAsync,
  signupUserAsync,
  splitBillsByNextPaycheck,
  starterCategories,
} from './budgetProfile'

const frequencies: { value: PayFrequency; label: string; detail: string }[] = [
  { value: 'weekly', label: 'Weekly', detail: '52 paychecks' },
  { value: 'biweekly', label: 'Every 2 weeks', detail: '26 paychecks' },
  { value: 'semimonthly', label: 'Twice a month', detail: '24 paychecks' },
  { value: 'monthly', label: 'Monthly', detail: '12 paychecks' },
]

const expenseFrequencies: { value: ExpenseFrequency; label: string; detail: string }[] = [
  { value: 'weekly', label: 'Weekly', detail: '52 times / year' },
  { value: 'biweekly', label: 'Every 2 weeks', detail: '26 times / year' },
  { value: 'semimonthly', label: 'Twice a month', detail: '24 times / year' },
  { value: 'monthly', label: 'Monthly', detail: '12 times / year' },
]

const dueDays = Array.from({ length: 31 }, (_, index) => index + 1)
const setupSteps = ['Income', 'Bills', 'Expenses']

const defaultStarterExpenses: CodedExpenseRow[] = [
  {
    id: 'exp-1',
    date: '2026-08-22',
    description: 'Weekly Supermarket Grocery Trip',
    categoryAmounts: { 'cat-1': 135.50 },
  },
  {
    id: 'exp-2',
    date: '2026-08-24',
    description: 'Gas Station Fuel Fill-up',
    categoryAmounts: { 'cat-2': 45.00 },
  },
  {
    id: 'exp-3',
    date: '2026-08-26',
    description: 'Morning Coffee & Work Lunch',
    categoryAmounts: { 'cat-3': 22.75 },
  },
]

const babylonCures = [
  {
    cure: 'Cure I',
    title: 'Start Thy Purse to Fattening',
    ancient: 'For every ten coins thou puttest in, take out but nine.',
    modern: 'Pay yourself first. Keep a minimum of 10% of every paycheck before any bills or living costs are touched.',
    icon: Coins,
  },
  {
    cure: 'Cure II',
    title: 'Control Thy Expenditures',
    ancient: 'Confuse not necessary expenses with thy desires.',
    modern: 'Clearly distinguish non-negotiable living needs from lifestyle wants. Live below your means with intention.',
    icon: Scale,
  },
  {
    cure: 'Cure III',
    title: 'Make Thy Gold Multiply',
    ancient: 'The gold we retain from our earnings is but the start. The earnings it will make shall build our fortunes.',
    modern: 'Put your saved capital to work through compounding investments, creating passive streams of continuous income.',
    icon: TrendingUp,
  },
  {
    cure: 'Cure IV',
    title: 'Guard Thy Treasures from Loss',
    ancient: 'Guard thy treasure from loss by investing only where thy principal is safe.',
    modern: 'Build an emergency buffer and protect capital from speculative risks and hidden subscription leaks.',
    icon: ShieldCheck,
  },
  {
    cure: 'Cure V',
    title: 'Make of Thy Dwelling a Profitable Investment',
    ancient: 'Own thy home so that thy heart may be filled with pride and confidence.',
    modern: 'Treat housing and fixed recurring overhead as calculated investments rather than unexamined drains.',
    icon: Landmark,
  },
  {
    cure: 'Cure VI',
    title: 'Insure a Future Income',
    ancient: 'Provide in advance for the days of thy growing age and the protection of thy family.',
    modern: 'Forecast future cash flows and retirement readiness with structured pay-period budget schedules.',
    icon: PieChart,
  },
  {
    cure: 'Cure VII',
    title: 'Increase Thy Ability to Earn',
    ancient: 'Cultivate thy powers, study to become wiser, acquire skill, and act with self-respect.',
    modern: 'Track your financial discipline continuously, building the habits and clarity that multiply your earning power.',
    icon: Flame,
  },
]

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentUser())
  const [view, setView] = useState<'landing' | 'setup' | 'home'>('landing')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)

  // Interactive Babylon Allocator on Landing Page
  const [sampleMonthlyIncome, setSampleMonthlyIncome] = useState(5000)

  // Financials Setup State
  const initialProfile = loadBudgetProfile(currentUser?.id)
  const [categories, setCategories] = useState<ExpenseCategory[]>(initialProfile?.categories ?? starterCategories)
  const [bills, setBills] = useState<Bill[]>(initialProfile?.bills ?? [])
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>(initialProfile?.incomeSources ?? [])
  const [billPayments, setBillPayments] = useState<Record<string, BillPaymentRecord>>(initialProfile?.billPayments ?? {})
  const [codedExpenses, setCodedExpenses] = useState<CodedExpenseRow[]>(
    initialProfile?.codedExpenses && initialProfile.codedExpenses.length > 0
      ? initialProfile.codedExpenses
      : defaultStarterExpenses
  )
  const [activeStep, setActiveStep] = useState(0)

  // Income Form State
  const [incomeLabel, setIncomeLabel] = useState('')
  const [incomeFrequency, setIncomeFrequency] = useState<PayFrequency>('biweekly')
  const [lastPayDate, setLastPayDate] = useState('')
  const [incomeType, setIncomeType] = useState<IncomeType>('salary')
  const [estimatedTakeHome, setEstimatedTakeHome] = useState('')
  const [editingIncomeId, setEditingIncomeId] = useState<string | null>(null)

  // Bill Form State
  const [billName, setBillName] = useState('')
  const [anticipatedBillAmount, setAnticipatedBillAmount] = useState('')
  const [billDueDay, setBillDueDay] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('manual')
  const [paymentUrl, setPaymentUrl] = useState('')
  const [editingBillId, setEditingBillId] = useState<string | null>(null)

  // Expense Category Form State
  const [categoryName, setCategoryName] = useState('')
  const [categoryBudgetedAmount, setCategoryBudgetedAmount] = useState('')
  const [categoryFrequency, setCategoryFrequency] = useState<ExpenseFrequency>('monthly')
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)

  const [isSaved, setIsSaved] = useState(false)

  // Home view state
  const [activeTab, setActiveTab] = useState<'bills' | 'expenses' | 'income'>('bills')
  const [activeFeatureModal, setActiveFeatureModal] = useState<'pay-bills' | 'code-expenses' | 'view-budgets' | null>(null)
  
  // Inline editing in Home master table
  const [inlineEditingBillId, setInlineEditingBillId] = useState<string | null>(null)
  const [editBillForm, setEditBillForm] = useState<Bill | null>(null)
  const [inlineEditingCategoryId, setInlineEditingCategoryId] = useState<string | null>(null)
  const [editCategoryForm, setEditCategoryForm] = useState<ExpenseCategory | null>(null)

  // Coded Expenses Quick Form State
  const [newExpDate, setNewExpDate] = useState(new Date().toISOString().split('T')[0])
  const [newExpDesc, setNewExpDesc] = useState('')
  const [newExpAmounts, setNewExpAmounts] = useState<Record<string, string>>({})

  async function applyUserProfile(user: UserAccount | null) {
    const profile = await loadBudgetProfileAsync(user)
    setCategories(profile?.categories ?? starterCategories)
    setBills(profile?.bills ?? [])
    setIncomeSources(profile?.incomeSources ?? [])
    setBillPayments(profile?.billPayments ?? {})
    setCodedExpenses(
      profile?.codedExpenses && profile.codedExpenses.length > 0
        ? profile.codedExpenses
        : defaultStarterExpenses
    )
    setIsSaved(false)
  }

  async function handleAuthSubmit(e: FormEvent) {
    e.preventDefault()
    setAuthError(null)

    if (authMode === 'signup') {
      const res = await signupUserAsync(authName, authEmail, authPassword)
      if (!res.success) {
        setAuthError(res.error ?? 'Failed to sign up')
        return
      }
      setCurrentUser(res.user ?? null)
      await applyUserProfile(res.user ?? null)
      setAuthModalOpen(false)
      setView('setup')
    } else {
      const res = await loginUserAsync(authEmail, authPassword)
      if (!res.success) {
        setAuthError(res.error ?? 'Failed to log in')
        return
      }
      setCurrentUser(res.user ?? null)
      await applyUserProfile(res.user ?? null)
      setAuthModalOpen(false)
      const profile = loadBudgetProfile(res.user?.id)
      if (profile && (profile.bills.length > 0 || profile.incomeSources.length > 0)) {
        setView('home')
      } else {
        setView('setup')
      }
    }
  }

  function handleLogout() {
    logoutUser()
    setCurrentUser(null)
    applyUserProfile(null)
    setView('landing')
  }

  // Expense Category Handlers
  function addCategory(event: FormEvent) {
    event.preventDefault()
    const name = categoryName.trim()
    const amount = Number(categoryBudgetedAmount)
    if (!name || !Number.isFinite(amount) || amount < 0) return

    const category: ExpenseCategory = {
      id: editingCategoryId ?? crypto.randomUUID(),
      name,
      budgetedAmount: amount,
      frequency: categoryFrequency,
    }

    const updated = editingCategoryId
      ? categories.map((c) => (c.id === editingCategoryId ? category : c))
      : [...categories, category]

    setCategories(updated)
    resetCategoryForm()
    if (view === 'home') {
      saveBudgetProfileAsync({ categories: updated, bills, incomeSources, billPayments, codedExpenses }, currentUser)
    }
  }

  function editCategory(category: ExpenseCategory) {
    setEditingCategoryId(category.id)
    setCategoryName(category.name)
    setCategoryBudgetedAmount(String(category.budgetedAmount ?? ''))
    setCategoryFrequency(category.frequency)
  }

  function resetCategoryForm() {
    setCategoryName('')
    setCategoryBudgetedAmount('')
    setCategoryFrequency('monthly')
    setEditingCategoryId(null)
  }

  function removeCategory(categoryId: string) {
    const updated = categories.filter((item) => item.id !== categoryId)
    setCategories(updated)
    if (editingCategoryId === categoryId) resetCategoryForm()
    if (view === 'home') {
      saveBudgetProfileAsync({ categories: updated, bills, incomeSources, billPayments, codedExpenses }, currentUser)
    }
  }

  // Income Handlers
  function addIncome(event: FormEvent) {
    event.preventDefault()
    const label = incomeLabel.trim()
    const takeHome = Number(estimatedTakeHome)
    if (!label || !lastPayDate || !Number.isFinite(takeHome) || takeHome < 0) return

    const incomeSource: IncomeSource = {
      id: editingIncomeId ?? crypto.randomUUID(),
      label,
      estimatedTakeHome: takeHome,
      frequency: incomeFrequency,
      lastPayDate,
      incomeType,
    }
    const updated = editingIncomeId
      ? incomeSources.map((source) => (source.id === editingIncomeId ? incomeSource : source))
      : [...incomeSources, incomeSource]
    setIncomeSources(updated)
    resetIncomeForm()
    if (view === 'home') {
      saveBudgetProfileAsync({ categories, bills, incomeSources: updated, billPayments, codedExpenses }, currentUser)
    }
  }

  function removeIncome(incomeId: string) {
    const updated = incomeSources.filter((source) => source.id !== incomeId)
    setIncomeSources(updated)
    if (editingIncomeId === incomeId) resetIncomeForm()
    if (view === 'home') {
      saveBudgetProfileAsync({ categories, bills, incomeSources: updated, billPayments, codedExpenses }, currentUser)
    }
  }

  function editIncome(source: IncomeSource) {
    setEditingIncomeId(source.id)
    setIncomeLabel(source.label)
    setEstimatedTakeHome(String(source.estimatedTakeHome ?? ''))
    setIncomeFrequency(source.frequency)
    setLastPayDate(source.lastPayDate)
    setIncomeType(source.incomeType)
  }

  function resetIncomeForm() {
    setIncomeLabel('')
    setEstimatedTakeHome('')
    setIncomeFrequency('biweekly')
    setLastPayDate('')
    setIncomeType('salary')
    setEditingIncomeId(null)
  }

  // Bill Handlers
  function addBill(event: FormEvent) {
    event.preventDefault()
    const name = billName.trim()
    const rawUrl = paymentUrl.trim()
    const url = rawUrl && !/^https?:\\/\\//i.test(rawUrl) ? 'https://' + rawUrl : rawUrl
    const anticipatedAmount = Number(anticipatedBillAmount)
    if (!name || !Number.isFinite(anticipatedAmount) || anticipatedAmount < 0) return

    const bill: Bill = {
      id: editingBillId ?? crypto.randomUUID(),
      name,
      anticipatedAmount,
      dueDay: billDueDay,
      paymentMethod,
      paymentUrl: url,
    }
    const updated = editingBillId
      ? bills.map((currentBill) => (currentBill.id === editingBillId ? bill : currentBill))
      : [...bills, bill]
    setBills(updated)
    resetBillForm()
    if (view === 'home') {
      saveBudgetProfileAsync({ categories, bills: updated, incomeSources, billPayments, codedExpenses }, currentUser)
    }
  }

  function editBill(bill: Bill) {
    setEditingBillId(bill.id)
    setBillName(bill.name)
    setAnticipatedBillAmount(String(bill.anticipatedAmount ?? ''))
    setBillDueDay(bill.dueDay)
    setPaymentMethod(bill.paymentMethod)
    setPaymentUrl(bill.paymentUrl)
  }

  function resetBillForm() {
    setBillName('')
    setAnticipatedBillAmount('')
    setBillDueDay(1)
    setPaymentMethod('manual')
    setPaymentUrl('')
    setEditingBillId(null)
  }

  function removeBill(billId: string) {
    const updated = bills.filter((bill) => bill.id !== billId)
    setBills(updated)
    if (editingBillId === billId) resetBillForm()
    if (view === 'home') {
      saveBudgetProfileAsync({ categories, bills: updated, incomeSources, billPayments, codedExpenses }, currentUser)
    }
  }

  async function continueToBudget() {
    const profile: BudgetProfile = { categories, bills, incomeSources, billPayments, codedExpenses }
    await saveBudgetProfileAsync(profile, currentUser)
    setIsSaved(true)
    setView('home')
  }

  function nextStep() {
    if (activeStep === setupSteps.length - 1) {
      continueToBudget()
      return
    }
    setActiveStep((step) => step + 1)
  }

  // Bill Payment Management (Actual Amount, Confirmation Code, Paid Status)
  function updateBillPayment(billId: string, updates: Partial<BillPaymentRecord>, defaultAnticipated = 0) {
    const existing: BillPaymentRecord = billPayments[billId] ?? {
      billId,
      actualAmount: defaultAnticipated,
      confirmationCode: '',
      paid: false,
    }
    const updatedRecord: BillPaymentRecord = {
      ...existing,
      ...updates,
    }
    const updatedPayments = {
      ...billPayments,
      [billId]: updatedRecord,
    }
    setBillPayments(updatedPayments)
    saveBudgetProfileAsync(
      { categories, bills, incomeSources, billPayments: updatedPayments, codedExpenses },
      currentUser
    )
  }

  // Coded Expenses Handlers
  function addCodedExpense(e: FormEvent) {
    e.preventDefault()
    const desc = newExpDesc.trim()
    if (!desc) return

    const categoryAmounts: Record<string, number> = {}
    let hasAtLeastOneAmount = false

    for (const [catId, valStr] of Object.entries(newExpAmounts)) {
      const num = Number(valStr)
      if (Number.isFinite(num) && num > 0) {
        categoryAmounts[catId] = num
        hasAtLeastOneAmount = true
      }
    }

    const newRow: CodedExpenseRow = {
      id: crypto.randomUUID(),
      date: newExpDate || new Date().toISOString().split('T')[0],
      description: desc,
      categoryAmounts,
    }

    const updated = [...codedExpenses, newRow]
    setCodedExpenses(updated)
    setNewExpDesc('')
    setNewExpAmounts({})
    saveBudgetProfileAsync(
      { categories, bills, incomeSources, billPayments, codedExpenses: updated },
      currentUser
    )
  }

  function updateCodedExpenseCell(rowId: string, categoryId: string, amount: number) {
    const updated = codedExpenses.map((row) => {
      if (row.id !== rowId) return row
      const newAmounts = { ...row.categoryAmounts }
      if (amount <= 0) {
        delete newAmounts[categoryId]
      } else {
        newAmounts[categoryId] = amount
      }
      return {
        ...row,
        categoryAmounts: newAmounts,
      }
    })
    setCodedExpenses(updated)
    saveBudgetProfileAsync(
      { categories, bills, incomeSources, billPayments, codedExpenses: updated },
      currentUser
    )
  }

  function updateCodedExpenseField(rowId: string, field: 'date' | 'description', value: string) {
    const updated = codedExpenses.map((row) => {
      if (row.id !== rowId) return row
      return {
        ...row,
        [field]: value,
      }
    })
    setCodedExpenses(updated)
    saveBudgetProfileAsync(
      { categories, bills, incomeSources, billPayments, codedExpenses: updated },
      currentUser
    )
  }

  function deleteCodedExpense(rowId: string) {
    const updated = codedExpenses.filter((r) => r.id !== rowId)
    setCodedExpenses(updated)
    saveBudgetProfileAsync(
      { categories, bills, incomeSources, billPayments, codedExpenses: updated },
      currentUser
    )
  }

  // Inline table edit for bills in master table
  function startInlineEditBill(bill: Bill) {
    setInlineEditingBillId(bill.id)
    setEditBillForm({ ...bill })
  }

  function saveInlineEditBill() {
    if (!editBillForm) return
    const rawUrl = (editBillForm.paymentUrl || '').trim()
    const url = rawUrl && !/^https?:\\/\\//i.test(rawUrl) ? 'https://' + rawUrl : rawUrl
    const updatedBill: Bill = {
      ...editBillForm,
      name: editBillForm.name.trim() || 'Untitled Bill',
      anticipatedAmount: Number(editBillForm.anticipatedAmount) || 0,
      dueDay: Number(editBillForm.dueDay) || 1,
      paymentUrl: url,
    }
    const updated = bills.map((b) => (b.id === updatedBill.id ? updatedBill : b))
    setBills(updated)
    setInlineEditingBillId(null)
    setEditBillForm(null)
    saveBudgetProfileAsync({ categories, bills: updated, incomeSources, billPayments, codedExpenses }, currentUser)
  }

  function cancelInlineEditBill() {
    setInlineEditingBillId(null)
    setEditBillForm(null)
  }

  // Inline table edit for categories in master table
  function startInlineEditCategory(category: ExpenseCategory) {
    setInlineEditingCategoryId(category.id)
    setEditCategoryForm({ ...category })
  }

  function saveInlineEditCategory() {
    if (!editCategoryForm) return
    const updatedCategory: ExpenseCategory = {
      ...editCategoryForm,
      name: editCategoryForm.name.trim() || 'Untitled Category',
      budgetedAmount: Number(editCategoryForm.budgetedAmount) || 0,
      frequency: editCategoryForm.frequency || 'monthly',
    }
    const updated = categories.map((c) => (c.id === updatedCategory.id ? updatedCategory : c))
    setCategories(updated)
    setInlineEditingCategoryId(null)
    setEditCategoryForm(null)
    saveBudgetProfileAsync({ categories: updated, bills, incomeSources, billPayments, codedExpenses }, currentUser)
  }

  function cancelInlineEditCategory() {
    setInlineEditingCategoryId(null)
    setEditCategoryForm(null)
  }

  // Monthly calculation helpers
  function computeMonthlyAmount(amount: number, frequency: PayFrequency | ExpenseFrequency): number {
    switch (frequency) {
      case 'weekly':
        return (amount * 52) / 12
      case 'biweekly':
        return (amount * 26) / 12
      case 'semimonthly':
        return amount * 2
      case 'monthly':
        return amount
      default:
        return amount
    }
  }

  const totalMonthlyBills = bills.reduce((sum, b) => sum + (Number(b.anticipatedAmount) || 0), 0)
  const totalMonthlyIncomeEst = incomeSources.reduce(
    (sum, inc) => sum + computeMonthlyAmount(Number(inc.estimatedTakeHome) || 0, inc.frequency),
    0
  )
  const totalMonthlyExpensesEst = categories.reduce(
    (sum, c) => sum + computeMonthlyAmount(Number(c.budgetedAmount) || 0, c.frequency),
    0
  )
  const goldVaultTarget = totalMonthlyIncomeEst * 0.1
  const freeCashFlow = Math.max(
    0,
    totalMonthlyIncomeEst - totalMonthlyBills - totalMonthlyExpensesEst - goldVaultTarget
  )

  const goldKeep = sampleMonthlyIncome * 0.1
  const debtsFuture = sampleMonthlyIncome * 0.2
  const livingExp = sampleMonthlyIncome * 0.7

  // Split bills before vs after next paycheck
  const { nextPayDate, incomeSource: primaryIncome, billsBeforeNextPay, billsAfterNextPay } = splitBillsByNextPaycheck(
    bills,
    incomeSources
  )

  return (
    <div className="app-shell">
      <header className="topbar" aria-label="Main navigation">
        <button
          type="button"
          className="brand brand-btn"
          onClick={() => setView('landing')}
          aria-label="Babylon Budget home"
        >
          <span className="brand-mark">
            <CircleDollarSign size={22} strokeWidth={2.3} />
          </span>
          <span>
            Babylon <strong>Budget</strong>
          </span>
        </button>

        {view === 'landing' ? (
          <nav className="nav-links">
            <a href="#philosophy" className="nav-link">Philosophy</a>
            <a href="#cures" className="nav-link">The 7 Cures</a>
            <a href="#features" className="nav-link">Features</a>
            <div className="nav-actions">
              {currentUser ? (
                <>
                  <div className="user-badge" title={'Signed in as ' + currentUser.email}>
                    <User size={15} />
                    <span>{currentUser.name}</span>
                  </div>
                  <button type="button" className="btn-gold" onClick={() => setView('home')}>Go to Home</button>
                  <button type="button" className="btn-ghost" onClick={handleLogout}>Log Out</button>
                </>
              ) : (
                <>
                  <button type="button" className="btn-ghost" onClick={() => { setAuthError(null); setAuthMode('login'); setAuthModalOpen(true); }}>Log In</button>
                  <button type="button" className="btn-gold" onClick={() => { setAuthError(null); setAuthMode('signup'); setAuthModalOpen(true); }}>Sign Up Free</button>
                </>
              )}
            </div>
          </nav>
        ) : view === 'setup' ? (
          <div className="setup-nav-status">
            <button type="button" className="back-to-home-link" onClick={() => setView('landing')}><ArrowLeft size={16} /> Landing</button>
            {bills.length > 0 && <button type="button" className="back-to-home-link" onClick={() => setView('home')}>Go to Home</button>}
            {currentUser && (
              <div className="user-badge" title={'Signed in as ' + currentUser.email}>
                <User size={14} />
                <span>{currentUser.name}</span>
              </div>
            )}
            <span className="step-label">Financials Setup <span>{activeStep + 1} of 3</span></span>
          </div>
        ) : (
          <div className="home-topbar-nav">
            <div className="home-nav-links">
              <button type="button" className="btn-ghost-sm" onClick={() => { setActiveStep(0); setView('setup'); }}>Edit Financials Setup</button>
              <button type="button" className="btn-ghost-sm" onClick={() => setView('landing')}>Landing Page</button>
            </div>
            <div className="nav-actions">
              {currentUser && (
                <div className="user-badge" title={'Signed in as ' + currentUser.email}>
                  <User size={14} />
                  <span>{currentUser.name}</span>
                </div>
              )}
              <button type="button" className="btn-ghost" onClick={handleLogout}>Log Out</button>
            </div>
          </div>
        )}
      </header>

      {/* ======================= LANDING PAGE VIEW ======================= */}
      {view === 'landing' && (
        <main className="landing-container">
          <section className="hero-section">
            <div className="hero-content">
              <div className="hero-badge">
                <Sparkles size={14} />
                <span>Inspired by George S. Clason's Classic</span>
              </div>
              <h1 className="hero-title">
                Build Enduring Wealth.<br />
                <span className="hero-gold-text">Master Your Gold</span> Paycheck by Paycheck.
              </h1>
              <p className="hero-subtitle">
                Designed to help you track your spending, budget with confidence, and build a prosperous future. Rooted in the timeless wisdom of <em>The Richest Man in Babylon</em>: &ldquo;A part of all you earn is yours to keep.&rdquo;
              </p>
              <div className="hero-cta-group">
                <button type="button" className="btn-gold-large" onClick={() => { if (bills.length > 0 || incomeSources.length > 0) { setView('home') } else { setView('setup') } }}>
                  {bills.length > 0 ? 'Open Your Babylon Home' : 'Start Financials Setup'} <ChevronRight size={18} />
                </button>
                <button type="button" className="btn-secondary-large" onClick={() => { document.getElementById('cures')?.scrollIntoView({ behavior: 'smooth' }) }}>Explore the 7 Cures</button>
              </div>
              <div className="hero-trust-bar">
                <div className="trust-item"><CheckCircle2 size={16} /> 100% Private &amp; Offline-Ready</div>
                <div className="trust-item"><CheckCircle2 size={16} /> Paycheck-Aligned Rhythm</div>
                <div className="trust-item"><CheckCircle2 size={16} /> No Hidden Fees</div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="babylon-card">
                <div className="babylon-card-header">
                  <div><span className="card-eyebrow">THE BABYLONIAN WEALTH LAW</span><h3>The 10 / 20 / 70 Principle</h3></div>
                  <span className="gold-seal">7 Cures</span>
                </div>
                <p className="allocator-prompt">See how your monthly income is partitioned under Babylon law:</p>
                <div className="income-slider-group">
                  <div className="slider-label"><span>Monthly Earnings</span><strong>{formatCurrency(sampleMonthlyIncome)}</strong></div>
                  <input type="range" min="1500" max="20000" step="250" value={sampleMonthlyIncome} onChange={(e) => setSampleMonthlyIncome(Number(e.target.value))} aria-label="Monthly income slider" />
                </div>
                <div className="allocation-bars">
                  <div className="alloc-item alloc-gold">
                    <div className="alloc-head"><div className="alloc-meta"><span className="alloc-badge">10%</span><strong>Thy Gold Vault (Yours to Keep)</strong></div><span className="alloc-val">{formatCurrency(goldKeep)}</span></div>
                    <div className="alloc-progress-track"><div className="alloc-bar alloc-bar-gold" style={{ width: '10%' }} /></div>
                    <small>Untouchable foundation wealth. Paid first before any creditor.</small>
                  </div>
                  <div className="alloc-item alloc-sage">
                    <div className="alloc-head"><div className="alloc-meta"><span className="alloc-badge">20%</span><strong>Debts &amp; Future Multipliers</strong></div><span className="alloc-val">{formatCurrency(debtsFuture)}</span></div>
                    <div className="alloc-progress-track"><div className="alloc-bar alloc-bar-sage" style={{ width: '20%' }} /></div>
                    <small>Systematic debt retirement and compounding growth investments.</small>
                  </div>
                  <div className="alloc-item alloc-emerald">
                    <div className="alloc-head"><div className="alloc-meta"><span className="alloc-badge">70%</span><strong>Living Expenses &amp; Bills</strong></div><span className="alloc-val">{formatCurrency(livingExp)}</span></div>
                    <div className="alloc-progress-track"><div className="alloc-bar alloc-bar-emerald" style={{ width: '70%' }} /></div>
                    <small>Shelter, nourishment, and obligations managed with disciplined ease.</small>
                  </div>
                </div>
                <button type="button" className="card-action-btn" onClick={() => setView('setup')}>Configure Your Real Paychecks Now &rarr;</button>
              </div>
            </div>
          </section>
          <section id="philosophy" className="quote-banner">
            <div className="quote-inner">
              <span className="quote-mark">&ldquo;</span>
              <blockquote>A part of all you earn is yours to keep. It should be not less than a tenth no matter how little you earn. It can be as much more as you can afford. Pay yourself first.</blockquote>
              <cite>&mdash; George S. Clason, <em>The Richest Man in Babylon</em></cite>
            </div>
          </section>
          <section id="cures" className="cures-section">
            <div className="section-head text-center">
              <p className="eyebrow">ANCIENT WISDOM &bull; MODERN DISCIPLINE</p>
              <h2>The Seven Cures for a Lean Purse</h2>
              <p className="section-desc">Thousands of years ago in ancient Babylon, the richest city of antiquity, Arkad taught seven master laws for wealth. Babylon Budget translates each law into intuitive software tools.</p>
            </div>
            <div className="cures-grid">
              {babylonCures.map((item, idx) => {
                const Icon = item.icon
                return (
                  <div className="cure-card" key={item.cure}>
                    <div className="cure-header"><span className="cure-number">0{idx + 1}</span><div className="cure-icon-box"><Icon size={20} /></div></div>
                    <h3>{item.title}</h3>
                    <p className="cure-ancient">&ldquo;{item.ancient}&rdquo;</p>
                    <div className="cure-divider" />
                    <p className="cure-modern">{item.modern}</p>
                  </div>
                )
              })}
            </div>
          </section>
          <section id="features" className="features-section">
            <div className="section-head text-center">
              <p className="eyebrow">DESIGNED FOR CLARITY</p>
              <h2>Everything You Need to Command Your Cash Flow</h2>
              <p className="section-desc">Stop guessing your balance across arbitrary calendar months. Babylon Budget anchors every dollar directly to your real pay schedule.</p>
            </div>
            <div className="features-grid">
              <div className="feature-box"><div className="feature-icon"><CalendarDays size={24} /></div><h3>Paycheck-Matched Cycles</h3><p>Whether you are paid weekly, every two weeks, twice a month, or monthly, your budget resets and allocates in rhythm with actual money in hand.</p></div>
              <div className="feature-box"><div className="feature-icon"><CreditCard size={24} /></div><h3>Monthly Bills &amp; Payment Links</h3><p>Store anticipated bill amounts, due dates, autopay flags, and direct links to payment portals so no due date ever catches you unawares.</p></div>
              <div className="feature-box"><div className="feature-icon"><Scale size={24} /></div><h3>Budgeted Expense Envelopes</h3><p>Allocate expected targets for groceries, fuel, dining, clothing, and coffee with customizable frequencies and live totals.</p></div>
              <div className="feature-box"><div className="feature-icon"><Lock size={24} /></div><h3>Private by Architecture</h3><p>Your financial records belong to you. Work offline with local storage drafts or sync securely to your cloud database.</p></div>
              <div className="feature-box"><div className="feature-icon"><TrendingUp size={24} /></div><h3>Future Income Forecasting</h3><p>Anticipate surplus cash flow weeks in advance and direct extra capital toward debt payoff or compounding wealth reserves.</p></div>
              <div className="feature-box"><div className="feature-icon"><Globe size={24} /></div><h3>Zero Hassle Web Access</h3><p>Open directly as a self-contained web page on any desktop, tablet, or phone without app store barricades.</p></div>
            </div>
          </section>
          <section className="cta-banner">
            <div className="cta-banner-card">
              <span className="eyebrow eyebrow-gold">YOUR JOURNEY BEGINS TODAY</span>
              <h2>Ready to make your purse fatten with gold?</h2>
              <p>Take the first step toward lasting financial peace of mind. Complete your Financials Setup in less than 3 minutes.</p>
              <div className="cta-btn-row">
                <button type="button" className="btn-gold-large" onClick={() => setView('setup')}>Start Financials Setup Now <ArrowRight size={18} /></button>
                <button type="button" className="btn-ghost-light" onClick={() => { setAuthMode('signup'); setAuthModalOpen(true) }}>Create Free Account</button>
              </div>
            </div>
          </section>
          <footer className="landing-footer">
            <div className="footer-content">
              <div className="footer-brand"><div className="brand"><span className="brand-mark"><CircleDollarSign size={20} /></span><span>Babylon <strong>Budget</strong></span></div><p>Ancient financial discipline crafted for modern lives. Inspired by George S. Clason's timeless principles.</p></div>
              <div className="footer-links"><strong>Navigation</strong><button type="button" onClick={() => setView('setup')}>Financials Setup</button><a href="#philosophy">The Babylon Law</a><a href="#cures">The 7 Cures</a><a href="#features">Features</a></div>
              <div className="footer-links"><strong>Account</strong><button type="button" onClick={() => { setAuthMode('login'); setAuthModalOpen(true) }}>Log In</button><button type="button" onClick={() => { setAuthMode('signup'); setAuthModalOpen(true) }}>Sign Up</button><button type="button" onClick={() => setView('setup')}>Guest Setup</button></div>
            </div>
            <div className="footer-bottom"><p>&copy; {new Date().getFullYear()} Babylon Budget. Built with timeless principles for a secure financial future.</p></div>
          </footer>
        </main>
      )}

      {/* ==================== FINANCIALS SETUP VIEW ==================== */}
      {view === 'setup' && (
        <main className="setup-wrapper">
          <section className="setup-layout" aria-label="Financials Setup">
            <div className="form-panel">
              <div className="setup-progress" aria-label="Setup progress">
                {setupSteps.map((step, index) => (
                  <button className={index === activeStep ? 'active' : index < activeStep ? 'complete' : ''} type="button" onClick={() => setActiveStep(index)} aria-current={index === activeStep ? 'step' : undefined} key={step}>
                    {index + 1}<small>{step}</small>
                  </button>
                ))}
              </div>

              {/* STEP 1: INCOME */}
              {activeStep === 0 && (
                <>
                  <div className="form-heading"><p className="eyebrow">STEP 1 OF 3 &bull; FINANCIALS SETUP</p><h2>Add your income sources</h2><p>&ldquo;Start thy purse to fattening.&rdquo; Record each salary or hourly source so your cash flow matches real paydays.</p></div>
                  <div className="field-group income-section">
                    <div className="field-header"><label>Income sources</label><span>{incomeSources.length} added</span></div>
                    {incomeSources.length > 0 && (
                      <div className="income-list" aria-label="Your income sources">
                        {incomeSources.map((source) => (
                          <div className="income-row" key={source.id}>
                            <span className="income-icon"><BriefcaseBusiness size={16} /></span>
                            <span className="income-details"><strong>{source.label}<em>{formatCurrency(source.estimatedTakeHome)}</em></strong><small>{frequencyLabel(source.frequency)} &bull; Last paid {formatDate(source.lastPayDate)} &bull; {source.incomeType === 'hourly' ? 'Hourly' : 'Salary'}</small></span>
                            <button className="icon-button" type="button" onClick={() => editIncome(source)} aria-label={'Edit ' + source.label} title={'Edit ' + source.label}><Pencil size={16} /></button>
                            <button className="icon-button" type="button" onClick={() => removeIncome(source.id)} aria-label={'Remove ' + source.label} title={'Remove ' + source.label}><Trash2 size={17} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                    <form className="income-form" onSubmit={addIncome}>
                      <input value={incomeLabel} onChange={(event) => setIncomeLabel(event.target.value)} placeholder="Income label, e.g. Main job" aria-label="Income label" required />
                      <label className="take-home-field"><span>Estimated take-home</span><input value={estimatedTakeHome} onChange={(event) => setEstimatedTakeHome(event.target.value)} placeholder="0.00" aria-label="Estimated take-home amount" type="number" min="0" step="0.01" inputMode="decimal" required /></label>
                      <label className="select-field"><span>Pay frequency</span><select value={incomeFrequency} onChange={(event) => setIncomeFrequency(event.target.value as PayFrequency)} aria-label="Income pay frequency">{frequencies.map((frequency) => (<option key={frequency.value} value={frequency.value}>{frequency.label}</option>))}</select></label>
                      <label className="date-field"><CalendarDays size={15} /><span>Last pay date</span><input type="date" value={lastPayDate} onChange={(event) => setLastPayDate(event.target.value)} aria-label="Last pay date" required /></label>
                      <fieldset className="income-type"><legend>Income type</legend><label><input type="radio" name="income-type" checked={incomeType === 'hourly'} onChange={() => setIncomeType('hourly')} /> Hourly</label><label><input type="radio" name="income-type" checked={incomeType === 'salary'} onChange={() => setIncomeType('salary')} /> Salary</label></fieldset>
                      <button className="add-income-button" type="submit">{editingIncomeId ? <Pencil size={17} /> : <Plus size={18} />}{editingIncomeId ? 'Save changes' : 'Add income'}</button>
                      {editingIncomeId && (<button className="cancel-edit-button" type="button" onClick={resetIncomeForm}>Cancel edit</button>)}
                    </form>
                  </div>
                </>
              )}

              {/* STEP 2: BILLS */}
              {activeStep === 1 && (
                <>
                  <div className="form-heading"><p className="eyebrow">STEP 2 OF 3 &bull; FINANCIALS SETUP</p><h2>Add your recurring monthly bills</h2><p>&ldquo;Control thy expenditures.&rdquo; Map due dates and quick payment links so you never pay late fees.</p></div>
                  <div className="field-group bills-section">
                    <div className="field-header"><label>Your monthly bills</label><span>{bills.length} added</span></div>
                    {bills.length > 0 && (
                      <div className="bill-list" aria-label="Your monthly bills">
                        {bills.map((bill) => (
                          <div className="bill-row" key={bill.id}>
                            <span className="bill-icon" aria-hidden="true"><CreditCard size={16} /></span>
                            <span className="bill-details"><strong>{bill.name}<em>{formatCurrency(bill.anticipatedAmount)}</em></strong><small>Due the {bill.dueDay}{ordinalSuffix(bill.dueDay)} &bull; {bill.paymentMethod === 'autopay' ? 'Autopay' : 'Manual pay'}</small></span>
                            {bill.paymentUrl && (<a className="payment-link" href={bill.paymentUrl} target="_blank" rel="noreferrer" aria-label={'Open ' + bill.name + ' payment website'} title={'Open ' + bill.name + ' payment website'}><ExternalLink size={16} /></a>)}
                            <button className="icon-button" type="button" onClick={() => editBill(bill)} aria-label={'Edit ' + bill.name} title={'Edit ' + bill.name}><Pencil size={16} /></button>
                            <button className="icon-button" type="button" onClick={() => removeBill(bill.id)} aria-label={'Remove ' + bill.name} title={'Remove ' + bill.name}><Trash2 size={17} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                    <form className="bill-form" onSubmit={addBill}>
                      <input value={billName} onChange={(event) => setBillName(event.target.value)} placeholder="Bill name, e.g. Rent / Mortgage" aria-label="Bill name" required />
                      <label className="bill-amount-field"><span>Anticipated amount</span><input value={anticipatedBillAmount} onChange={(event) => setAnticipatedBillAmount(event.target.value)} placeholder="0.00" aria-label="Anticipated bill amount" type="number" min="0" step="0.01" inputMode="decimal" required /></label>
                      <input value={paymentUrl} onChange={(event) => setPaymentUrl(event.target.value)} placeholder="Payment website URL (optional)" aria-label="Payment website URL (optional)" />
                      <label className="compact-field"><CalendarDays size={15} /><span>Due day</span><select value={billDueDay} onChange={(event) => setBillDueDay(Number(event.target.value))} aria-label="Monthly due day">{dueDays.map((day) => (<option key={day} value={day}>{day}{ordinalSuffix(day)}</option>))}</select></label>
                      <fieldset className="payment-method"><legend>Payment method</legend><label><input type="radio" name="payment-method" checked={paymentMethod === 'autopay'} onChange={() => setPaymentMethod('autopay')} /> Autopay</label><label><input type="radio" name="payment-method" checked={paymentMethod === 'manual'} onChange={() => setPaymentMethod('manual')} /> Manual</label></fieldset>
                      <button className="add-bill-button" type="submit">{editingBillId ? <Pencil size={17} /> : <Plus size={18} />}{editingBillId ? 'Save changes' : 'Add bill'}</button>
                      {editingBillId && (<button className="cancel-edit-button" type="button" onClick={resetBillForm}>Cancel edit</button>)}
                    </form>
                  </div>
                </>
              )}

              {/* STEP 3: EXPENSE CATEGORIES */}
              {activeStep === 2 && (
                <>
                  <div className="form-heading">
                    <p className="eyebrow">STEP 3 OF 3 &bull; FINANCIALS SETUP</p>
                    <h2>Set up your expense categories</h2>
                    <p>&ldquo;Guard thy treasures from loss.&rdquo; Assign budgeted amounts and expected frequencies for your lifestyle costs like groceries, fuel, clothing, coffee, and dining out.</p>
                  </div>
                  <div className="field-group bills-section">
                    <div className="field-header">
                      <label>Your budgeted expense categories</label>
                      <span>{categories.length} added</span>
                    </div>
                    {categories.length > 0 && (
                      <div className="bill-list" aria-label="Your budgeted expense categories">
                        {categories.map((cat) => (
                          <div className="bill-row" key={cat.id}>
                            <span className="bill-icon" aria-hidden="true"><Tag size={16} /></span>
                            <span className="bill-details">
                              <strong>
                                {cat.name}
                                <em>{formatCurrency(cat.budgetedAmount)}</em>
                              </strong>
                              <small>
                                {frequencyLabel(cat.frequency)} &bull; {cat.frequency === 'monthly' ? 'Monthly envelope' : 'Est. ~' + formatCurrency(computeMonthlyAmount(cat.budgetedAmount, cat.frequency)) + '/mo'}
                              </small>
                            </span>
                            <button className="icon-button" type="button" onClick={() => editCategory(cat)} aria-label={'Edit ' + cat.name} title={'Edit ' + cat.name}><Pencil size={16} /></button>
                            <button className="icon-button" type="button" onClick={() => removeCategory(cat.id)} aria-label={'Remove ' + cat.name} title={'Remove ' + cat.name}><Trash2 size={17} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                    <form className="bill-form" onSubmit={addCategory}>
                      <input
                        value={categoryName}
                        onChange={(event) => setCategoryName(event.target.value)}
                        placeholder="Expense category (e.g. Groceries, Fuel, Coffee, Dining Out...)"
                        aria-label="Expense category name"
                        required
                      />
                      <label className="bill-amount-field">
                        <span>Budgeted amount</span>
                        <input
                          value={categoryBudgetedAmount}
                          onChange={(event) => setCategoryBudgetedAmount(event.target.value)}
                          placeholder="0.00"
                          aria-label="Budgeted amount"
                          type="number"
                          min="0"
                          step="0.01"
                          inputMode="decimal"
                          required
                        />
                      </label>
                      <label className="compact-field" style={{ gridColumn: '1 / -1' }}>
                        <span>Expected frequency</span>
                        <select
                          value={categoryFrequency}
                          onChange={(event) => setCategoryFrequency(event.target.value as ExpenseFrequency)}
                          aria-label="Expense frequency"
                        >
                          {expenseFrequencies.map((f) => (
                            <option key={f.value} value={f.value}>
                              {f.label} ({f.detail})
                            </option>
                          ))}
                        </select>
                      </label>
                      <button className="add-bill-button" type="submit">
                        {editingCategoryId ? <Pencil size={17} /> : <Plus size={18} />}
                        {editingCategoryId ? 'Save changes' : 'Add expense category'}
                      </button>
                      {editingCategoryId && (
                        <button className="cancel-edit-button" type="button" onClick={resetCategoryForm}>
                          Cancel edit
                        </button>
                      )}
                    </form>
                  </div>
                </>
              )}

              <div className="form-footer">
                <button className="back-button" type="button" onClick={() => setActiveStep((step) => step - 1)} disabled={activeStep === 0}><ArrowLeft size={18} /> Back</button>
                <p>{isSaved ? 'Your Financials Setup is saved!' : 'You can refine your plan at any time.'}</p>
                <button className="continue-button" type="button" onClick={nextStep} disabled={activeStep === 0 && incomeSources.length === 0}>
                  {activeStep === 2 ? 'Finish setup & Go to Home' : 'Continue'} <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ======================= HOME / DASHBOARD VIEW ======================= */}
      {view === 'home' && (
        <main className="home-dashboard">
          <div className="home-container">
            <div className="home-welcome-header">
              <div className="welcome-meta">
                <span className="home-eyebrow">COMMAND CENTER</span>
                <h1>Welcome, {currentUser?.name || 'Friend of Babylon'}.</h1>
                <p className="welcome-subtext">Your financials are configured. Review your high-priority actions or inspect and adjust your master schedule below.</p>
              </div>
              <div className="quick-stats-strip">
                <div className="stat-card">
                  <span className="stat-label">Est. Monthly Income</span>
                  <strong className="stat-val">{formatCurrency(totalMonthlyIncomeEst)}</strong>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Monthly Bills</span>
                  <strong className="stat-val text-bills">{formatCurrency(totalMonthlyBills)}</strong>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Budgeted Expenses</span>
                  <strong className="stat-val" style={{ color: '#4b6b28' }}>{formatCurrency(totalMonthlyExpensesEst)}</strong>
                </div>
                <div className="stat-card stat-gold">
                  <span className="stat-label">Gold Vault (10%)</span>
                  <strong className="stat-val text-gold">{formatCurrency(goldVaultTarget)}</strong>
                </div>
                <div className="stat-card stat-cushion">
                  <span className="stat-label">Free Cash Flow</span>
                  <strong className="stat-val text-cushion">{formatCurrency(freeCashFlow)}</strong>
                </div>
              </div>
            </div>

            {/* WHAT DO YOU WANT TO DO NOW? */}
            <section className="action-hub-section" aria-labelledby="action-hub-title">
              <div className="action-hub-header">
                <h2 id="action-hub-title">What do you want to do now?</h2>
                <p>Choose an action to manage today's money flow:</p>
              </div>
              <div className="action-cards-grid">
                <div className="action-card action-card-bills" onClick={() => setActiveFeatureModal('pay-bills')} role="button" tabIndex={0}>
                  <div className="action-card-top"><div className="action-icon-box icon-bills"><CreditCard size={24} /></div><span className="action-step-badge">Option 1</span></div>
                  <h3>1. Pay Bills</h3>
                  <p>View bills partitioned before vs after your next paycheck. Log actual amounts paid and optional confirmation codes.</p>
                  <div className="action-card-footer"><span>Open Pay Bills Workspace ({bills.length} bills) &rarr;</span></div>
                </div>
                <div className="action-card action-card-expenses" onClick={() => setActiveFeatureModal('code-expenses')} role="button" tabIndex={0}>
                  <div className="action-card-top"><div className="action-icon-box icon-expenses"><Receipt size={24} /></div><span className="action-step-badge">Option 2</span></div>
                  <h3>2. Code Previous Pay Period Expenses</h3>
                  <p>Populate and log transactions across your customized category columns ({categories.map(c => c.name).join(', ')}).</p>
                  <div className="action-card-footer"><span>Open Expense Coding Sheet &rarr;</span></div>
                </div>
                <div className="action-card action-card-budgets" onClick={() => setActiveFeatureModal('view-budgets')} role="button" tabIndex={0}>
                  <div className="action-card-top"><div className="action-icon-box icon-budgets"><PieChart size={24} /></div><span className="action-step-badge">Option 3</span></div>
                  <h3>3. View Budgets</h3>
                  <p>Inspect your Babylonian 10/20/70 distribution, monitor pay-period envelopes, and forecast long-term wealth compounding.</p>
                  <div className="action-card-footer"><span>Open Budget Overview &rarr;</span></div>
                </div>
              </div>
            </section>

            {/* MASTER DIRECTORY */}
            <section className="master-records-section">
              <div className="master-table-header">
                <div>
                  <span className="table-eyebrow">FINANCIAL SCHEDULE MANAGEMENT</span>
                  <h2>Master Bills &amp; Expenses Directory</h2>
                  <p>Review and edit future due dates, dollar amounts, payment links, and expense category budgets whenever necessary. Changes are saved automatically.</p>
                </div>
                <div className="table-tab-switches">
                  <button type="button" className={'tab-btn ' + (activeTab === 'bills' ? 'active' : '')} onClick={() => setActiveTab('bills')}>
                    <CreditCard size={15} /> Bills ({bills.length})
                  </button>
                  <button type="button" className={'tab-btn ' + (activeTab === 'expenses' ? 'active' : '')} onClick={() => setActiveTab('expenses')}>
                    <Tag size={15} /> Expenses &amp; Categories ({categories.length})
                  </button>
                  <button type="button" className={'tab-btn ' + (activeTab === 'income' ? 'active' : '')} onClick={() => setActiveTab('income')}>
                    <Wallet size={15} /> Incomes ({incomeSources.length})
                  </button>
                </div>
              </div>

              {/* BILLS TAB */}
              {activeTab === 'bills' && (
                <div className="table-wrapper">
                  <table className="master-data-table">
                    <thead><tr><th>Bill Name</th><th>Anticipated Amount</th><th>Due Day</th><th>Payment Method</th><th>Payment Link</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                    <tbody>
                      {bills.length === 0 ? (
                        <tr><td colSpan={6} className="empty-table-cell">No bills added yet. Use the quick form below or Edit Financials Setup to add your recurring bills.</td></tr>
                      ) : (
                        bills.map((bill) => {
                          const isEditing = inlineEditingBillId === bill.id
                          return (
                            <tr key={bill.id} className={isEditing ? 'editing-row' : ''}>
                              {isEditing && editBillForm ? (
                                <>
                                  <td><input className="table-input" value={editBillForm.name} onChange={(e) => setEditBillForm({ ...editBillForm, name: e.target.value })} placeholder="Bill name" required /></td>
                                  <td><div className="table-amount-wrap"><span>$</span><input className="table-input" type="number" step="0.01" min="0" value={editBillForm.anticipatedAmount} onChange={(e) => setEditBillForm({ ...editBillForm, anticipatedAmount: Number(e.target.value) })} required /></div></td>
                                  <td><select className="table-select" value={editBillForm.dueDay} onChange={(e) => setEditBillForm({ ...editBillForm, dueDay: Number(e.target.value) })}>{dueDays.map((d) => (<option key={d} value={d}>{d}{ordinalSuffix(d)} of month</option>))}</select></td>
                                  <td><select className="table-select" value={editBillForm.paymentMethod} onChange={(e) => setEditBillForm({ ...editBillForm, paymentMethod: e.target.value as PaymentMethod })}><option value="autopay">Autopay</option><option value="manual">Manual Pay</option></select></td>
                                  <td><input className="table-input" value={editBillForm.paymentUrl || ''} onChange={(e) => setEditBillForm({ ...editBillForm, paymentUrl: e.target.value })} placeholder="https://..." /></td>
                                  <td style={{ textAlign: 'right' }}><div className="table-row-actions"><button type="button" className="btn-save-row" onClick={saveInlineEditBill} title="Save Changes"><Save size={15} /> Save</button><button type="button" className="btn-cancel-row" onClick={cancelInlineEditBill} title="Cancel"><X size={15} /></button></div></td>
                                </>
                              ) : (
                                <>
                                  <td><div className="bill-title-cell"><span className="table-bill-icon"><CreditCard size={15} /></span><strong>{bill.name}</strong></div></td>
                                  <td><span className="table-amount-badge">{formatCurrency(bill.anticipatedAmount)}</span></td>
                                  <td><span className="table-due-badge">Due {bill.dueDay}{ordinalSuffix(bill.dueDay)}</span></td>
                                  <td><span className={'status-pill ' + (bill.paymentMethod === 'autopay' ? 'pill-autopay' : 'pill-manual')}>{bill.paymentMethod === 'autopay' ? 'Autopay' : 'Manual'}</span></td>
                                  <td>{bill.paymentUrl ? (<a href={bill.paymentUrl} target="_blank" rel="noreferrer" className="table-link" title={bill.paymentUrl}><span>Open Portal</span><ExternalLink size={13} /></a>) : (<span className="text-muted-dash">&mdash;</span>)}</td>
                                  <td style={{ textAlign: 'right' }}><div className="table-row-actions"><button type="button" className="btn-edit-row" onClick={() => startInlineEditBill(bill)} aria-label={'Edit ' + bill.name} title="Edit bill details"><Pencil size={15} /> Edit</button><button type="button" className="btn-delete-row" onClick={() => removeBill(bill.id)} aria-label={'Delete ' + bill.name} title="Delete bill"><Trash2 size={15} /></button></div></td>
                                </>
                              )}
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                  <div className="quick-add-footer">
                    <h4>Add another bill directly:</h4>
                    <form className="quick-bill-form" onSubmit={addBill}>
                      <input value={billName} onChange={(e) => setBillName(e.target.value)} placeholder="Bill name" required />
                      <input type="number" step="0.01" min="0" value={anticipatedBillAmount} onChange={(e) => setAnticipatedBillAmount(e.target.value)} placeholder="$ Amount" required />
                      <select value={billDueDay} onChange={(e) => setBillDueDay(Number(e.target.value))}>{dueDays.map((d) => (<option key={d} value={d}>Due {d}{ordinalSuffix(d)}</option>))}</select>
                      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}><option value="autopay">Autopay</option><option value="manual">Manual</option></select>
                      <input value={paymentUrl} onChange={(e) => setPaymentUrl(e.target.value)} placeholder="Payment URL (optional)" />
                      <button type="submit" className="btn-add-quick"><Plus size={16} /> Add Bill</button>
                    </form>
                  </div>
                </div>
              )}

              {/* EXPENSES / CATEGORIES TAB */}
              {activeTab === 'expenses' && (
                <div className="table-wrapper">
                  <table className="master-data-table">
                    <thead>
                      <tr>
                        <th>Expense Category</th>
                        <th>Budgeted Amount</th>
                        <th>Expected Frequency</th>
                        <th>Est. Monthly Equivalent</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="empty-table-cell">
                            No expense categories added yet. Add a category like Groceries, Fuel, or Dining below.
                          </td>
                        </tr>
                      ) : (
                        categories.map((cat) => {
                          const isEditing = inlineEditingCategoryId === cat.id
                          return (
                            <tr key={cat.id} className={isEditing ? 'editing-row' : ''}>
                              {isEditing && editCategoryForm ? (
                                <>
                                  <td>
                                    <input
                                      className="table-input"
                                      value={editCategoryForm.name}
                                      onChange={(e) =>
                                        setEditCategoryForm({ ...editCategoryForm, name: e.target.value })
                                      }
                                      placeholder="Category name"
                                      required
                                    />
                                  </td>
                                  <td>
                                    <div className="table-amount-wrap">
                                      <span>$</span>
                                      <input
                                        className="table-input"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editCategoryForm.budgetedAmount}
                                        onChange={(e) =>
                                          setEditCategoryForm({
                                            ...editCategoryForm,
                                            budgetedAmount: Number(e.target.value),
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <select
                                      className="table-select"
                                      value={editCategoryForm.frequency}
                                      onChange={(e) =>
                                        setEditCategoryForm({
                                          ...editCategoryForm,
                                          frequency: e.target.value as ExpenseFrequency,
                                        })
                                      }
                                    >
                                      {expenseFrequencies.map((f) => (
                                        <option key={f.value} value={f.value}>
                                          {f.label}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td>
                                    <span className="table-due-badge">
                                      {formatCurrency(computeMonthlyAmount(editCategoryForm.budgetedAmount, editCategoryForm.frequency))}/mo
                                    </span>
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    <div className="table-row-actions">
                                      <button
                                        type="button"
                                        className="btn-save-row"
                                        onClick={saveInlineEditCategory}
                                        title="Save Changes"
                                      >
                                        <Save size={15} /> Save
                                      </button>
                                      <button
                                        type="button"
                                        className="btn-cancel-row"
                                        onClick={cancelInlineEditCategory}
                                        title="Cancel"
                                      >
                                        <X size={15} />
                                      </button>
                                    </div>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td>
                                    <div className="bill-title-cell">
                                      <span className="table-bill-icon" style={{ background: '#eaf4e2', color: '#386925' }}>
                                        <Tag size={15} />
                                      </span>
                                      <strong>{cat.name}</strong>
                                    </div>
                                  </td>
                                  <td>
                                    <span className="table-amount-badge" style={{ color: '#2d5b1d' }}>
                                      {formatCurrency(cat.budgetedAmount)}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="table-due-badge">
                                      {frequencyLabel(cat.frequency)}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="table-amount-badge">
                                      {formatCurrency(computeMonthlyAmount(cat.budgetedAmount, cat.frequency))} / mo
                                    </span>
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    <div className="table-row-actions">
                                      <button
                                        type="button"
                                        className="btn-edit-row"
                                        onClick={() => startInlineEditCategory(cat)}
                                        aria-label={'Edit ' + cat.name}
                                        title="Edit category details"
                                      >
                                        <Pencil size={15} /> Edit
                                      </button>
                                      <button
                                        type="button"
                                        className="btn-delete-row"
                                        onClick={() => removeCategory(cat.id)}
                                        aria-label={'Delete ' + cat.name}
                                        title="Delete category"
                                      >
                                        <Trash2 size={15} />
                                      </button>
                                    </div>
                                  </td>
                                </>
                              )}
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>

                  <div className="quick-add-footer">
                    <h4>Add another expense category:</h4>
                    <form className="quick-bill-form" style={{ gridTemplateColumns: '2fr 1fr 1.5fr auto' }} onSubmit={addCategory}>
                      <input
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Category name (e.g. Groceries, Fuel, Clothing, Coffee Shop...)"
                        required
                      />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={categoryBudgetedAmount}
                        onChange={(e) => setCategoryBudgetedAmount(e.target.value)}
                        placeholder="$ Budgeted Amount"
                        required
                      />
                      <select
                        value={categoryFrequency}
                        onChange={(e) => setCategoryFrequency(e.target.value as ExpenseFrequency)}
                      >
                        {expenseFrequencies.map((f) => (
                          <option key={f.value} value={f.value}>
                            {f.label} ({f.detail})
                          </option>
                        ))}
                      </select>
                      <button type="submit" className="btn-add-quick">
                        <Plus size={16} /> Add Category
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* INCOMES TAB */}
              {activeTab === 'income' && (
                <div className="table-wrapper">
                  <table className="master-data-table">
                    <thead><tr><th>Source Label</th><th>Est. Take-Home Amount</th><th>Pay Frequency</th><th>Last Paid Date</th><th>Type</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                    <tbody>
                      {incomeSources.map((inc) => (
                        <tr key={inc.id}>
                          <td><div className="bill-title-cell"><span className="table-bill-icon icon-income-bg"><BriefcaseBusiness size={15} /></span><strong>{inc.label}</strong></div></td>
                          <td><span className="table-amount-badge text-gold">{formatCurrency(inc.estimatedTakeHome)}</span></td>
                          <td><span className="table-due-badge">{frequencyLabel(inc.frequency)}</span></td>
                          <td>{formatDate(inc.lastPayDate)}</td>
                          <td><span className="status-pill pill-manual">{inc.incomeType === 'hourly' ? 'Hourly' : 'Salary'}</span></td>
                          <td style={{ textAlign: 'right' }}><button type="button" className="btn-delete-row" onClick={() => removeIncome(inc.id)} aria-label={'Delete ' + inc.label} title="Delete source"><Trash2 size={15} /> Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="quick-add-footer">
                    <button type="button" className="btn-edit-financials-link" onClick={() => { setActiveStep(0); setView('setup'); }}><Pencil size={15} /> Edit Incomes in Financials Setup &rarr;</button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      )}

      {/* ======================= ACTION FEATURE MODALS ======================= */}
      {activeFeatureModal && (
        <div className="modal-backdrop" onClick={() => setActiveFeatureModal(null)}>
          <div
            className="feature-action-modal modal-large"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button className="modal-close-btn" type="button" onClick={() => setActiveFeatureModal(null)} aria-label="Close"><X size={20} /></button>
            
            {/* OPTION 1: PAY BILLS SPLIT BY PAYCHECK WITH ACTUAL AMOUNT & CONFIRMATION CODE */}
            {activeFeatureModal === 'pay-bills' && (
              <div className="feature-modal-content">
                <div className="feature-modal-header">
                  <div className="action-icon-box icon-bills"><CreditCard size={26} /></div>
                  <div>
                    <h2>Pay Bills Workspace</h2>
                    <p>
                      Organized by your pay rhythm. Review bills due before vs after your upcoming paycheck on{' '}
                      <strong>{formatDate(nextPayDate.toISOString().split('T')[0])}</strong>
                      {primaryIncome ? ' (' + primaryIncome.label + ')' : ''}.
                    </p>
                  </div>
                </div>

                <div className="pay-bills-split-view">
                  {/* TABLE 1: DUE BEFORE NEXT PAYCHECK */}
                  <div className="pay-bills-section-card urgent-card">
                    <div className="split-section-head">
                      <div className="split-title-wrap">
                        <span className="split-pill pill-urgent">Immediate Cycle</span>
                        <h3>1. Bills Due BEFORE Next Paycheck ({formatDate(nextPayDate.toISOString().split('T')[0])})</h3>
                      </div>
                      <span className="split-subtotal">
                        Anticipated:{' '}
                        <strong>
                          {formatCurrency(billsBeforeNextPay.reduce((s, b) => s + Number(b.anticipatedAmount), 0))}
                        </strong>
                      </span>
                    </div>

                    {billsBeforeNextPay.length === 0 ? (
                      <div className="empty-split-state">
                        <Check size={18} /> No bills due before your next paycheck date ({formatDate(nextPayDate.toISOString().split('T')[0])}).
                      </div>
                    ) : (
                      <div className="table-responsive-wrapper">
                        <table className="split-pay-table">
                          <thead>
                            <tr>
                              <th style={{ width: '40px' }}>Paid</th>
                              <th>Bill Name</th>
                              <th>Due Date</th>
                              <th>Anticipated</th>
                              <th>Actual Paid Amount ($)</th>
                              <th>Confirmation Code (Optional)</th>
                              <th>Payment Portal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {billsBeforeNextPay.map((b) => {
                              const payRecord = billPayments[b.id] ?? {
                                billId: b.id,
                                actualAmount: b.anticipatedAmount,
                                confirmationCode: '',
                                paid: false,
                              }
                              return (
                                <tr key={b.id} className={payRecord.paid ? 'paid-row' : ''}>
                                  <td style={{ textAlign: 'center' }}>
                                    <input
                                      type="checkbox"
                                      className="pay-checkbox"
                                      checked={payRecord.paid}
                                      onChange={(e) =>
                                        updateBillPayment(b.id, { paid: e.target.checked }, b.anticipatedAmount)
                                      }
                                      aria-label={'Mark ' + b.name + ' as paid'}
                                    />
                                  </td>
                                  <td>
                                    <strong>{b.name}</strong>
                                    <small className="table-method-tag">
                                      {b.paymentMethod === 'autopay' ? 'Autopay' : 'Manual Pay'}
                                    </small>
                                  </td>
                                  <td>
                                    <span className="table-due-badge">
                                      {formatDate(b.nextDueDate.toISOString().split('T')[0])}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="text-muted-amount">
                                      {formatCurrency(b.anticipatedAmount)}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="actual-amt-input-wrap">
                                      <span>$</span>
                                      <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={payRecord.actualAmount}
                                        onChange={(e) =>
                                          updateBillPayment(
                                            b.id,
                                            { actualAmount: Number(e.target.value) },
                                            b.anticipatedAmount
                                          )
                                        }
                                        placeholder={String(b.anticipatedAmount)}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="conf-code-input"
                                      value={payRecord.confirmationCode}
                                      onChange={(e) =>
                                        updateBillPayment(
                                          b.id,
                                          { confirmationCode: e.target.value },
                                          b.anticipatedAmount
                                        )
                                      }
                                      placeholder="Confirmation #"
                                    />
                                  </td>
                                  <td>
                                    {b.paymentUrl ? (
                                      <a
                                        href={b.paymentUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn-pay-link"
                                      >
                                        Open Portal <ExternalLink size={13} />
                                      </a>
                                    ) : (
                                      <span className="no-link-badge">No link set</span>
                                    )}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* TABLE 2: DUE AFTER NEXT PAYCHECK */}
                  <div className="pay-bills-section-card upcoming-card">
                    <div className="split-section-head">
                      <div className="split-title-wrap">
                        <span className="split-pill pill-upcoming">Subsequent Cycle</span>
                        <h3>2. Bills Due AFTER Next Paycheck ({formatDate(nextPayDate.toISOString().split('T')[0])})</h3>
                      </div>
                      <span className="split-subtotal">
                        Anticipated:{' '}
                        <strong>
                          {formatCurrency(billsAfterNextPay.reduce((s, b) => s + Number(b.anticipatedAmount), 0))}
                        </strong>
                      </span>
                    </div>

                    {billsAfterNextPay.length === 0 ? (
                      <div className="empty-split-state">
                        No upcoming bills scheduled after next paycheck.
                      </div>
                    ) : (
                      <div className="table-responsive-wrapper">
                        <table className="split-pay-table">
                          <thead>
                            <tr>
                              <th style={{ width: '40px' }}>Paid</th>
                              <th>Bill Name</th>
                              <th>Due Date</th>
                              <th>Anticipated</th>
                              <th>Actual Paid Amount ($)</th>
                              <th>Confirmation Code (Optional)</th>
                              <th>Payment Portal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {billsAfterNextPay.map((b) => {
                              const payRecord = billPayments[b.id] ?? {
                                billId: b.id,
                                actualAmount: b.anticipatedAmount,
                                confirmationCode: '',
                                paid: false,
                              }
                              return (
                                <tr key={b.id} className={payRecord.paid ? 'paid-row' : ''}>
                                  <td style={{ textAlign: 'center' }}>
                                    <input
                                      type="checkbox"
                                      className="pay-checkbox"
                                      checked={payRecord.paid}
                                      onChange={(e) =>
                                        updateBillPayment(b.id, { paid: e.target.checked }, b.anticipatedAmount)
                                      }
                                      aria-label={'Mark ' + b.name + ' as paid'}
                                    />
                                  </td>
                                  <td>
                                    <strong>{b.name}</strong>
                                    <small className="table-method-tag">
                                      {b.paymentMethod === 'autopay' ? 'Autopay' : 'Manual Pay'}
                                    </small>
                                  </td>
                                  <td>
                                    <span className="table-due-badge">
                                      {formatDate(b.nextDueDate.toISOString().split('T')[0])}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="text-muted-amount">
                                      {formatCurrency(b.anticipatedAmount)}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="actual-amt-input-wrap">
                                      <span>$</span>
                                      <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={payRecord.actualAmount}
                                        onChange={(e) =>
                                          updateBillPayment(
                                            b.id,
                                            { actualAmount: Number(e.target.value) },
                                            b.anticipatedAmount
                                          )
                                        }
                                        placeholder={String(b.anticipatedAmount)}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="conf-code-input"
                                      value={payRecord.confirmationCode}
                                      onChange={(e) =>
                                        updateBillPayment(
                                          b.id,
                                          { confirmationCode: e.target.value },
                                          b.anticipatedAmount
                                        )
                                      }
                                      placeholder="Confirmation #"
                                    />
                                  </td>
                                  <td>
                                    {b.paymentUrl ? (
                                      <a
                                        href={b.paymentUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn-pay-link"
                                      >
                                        Open Portal <ExternalLink size={13} />
                                      </a>
                                    ) : (
                                      <span className="no-link-badge">No link set</span>
                                    )}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer-actions">
                  <button type="button" className="btn-gold" onClick={() => setActiveFeatureModal(null)}>
                    Save Payments &amp; Return to Dashboard
                  </button>
                </div>
              </div>
            )}

            {/* OPTION 2: CODE PREVIOUS PAY PERIOD EXPENSES (TABLE WITH EXPENSE CATEGORY COLUMNS) */}
            {activeFeatureModal === 'code-expenses' && (
              <div className="feature-modal-content">
                <div className="feature-modal-header">
                  <div className="action-icon-box icon-expenses"><Receipt size={26} /></div>
                  <div>
                    <h2>Code Previous Pay Period Expenses</h2>
                    <p>
                      Log receipts and transactions across your active category columns. Check actual totals against your planned envelope targets.
                    </p>
                  </div>
                </div>

                <div className="expense-coding-matrix-container">
                  <div className="table-responsive-wrapper">
                    <table className="expense-matrix-table">
                      <thead>
                        <tr>
                          <th style={{ minWidth: '110px' }}>Date</th>
                          <th style={{ minWidth: '200px' }}>Merchant / Description</th>
                          {categories.map((cat) => (
                            <th key={cat.id} style={{ minWidth: '130px', textAlign: 'right' }}>
                              <div className="cat-th-head">
                                <span>{cat.name}</span>
                                <small>({formatCurrency(cat.budgetedAmount)})</small>
                              </div>
                            </th>
                          ))}
                          <th style={{ minWidth: '100px', textAlign: 'right' }}>Row Total</th>
                          <th style={{ width: '40px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {codedExpenses.length === 0 ? (
                          <tr>
                            <td colSpan={categories.length + 4} className="empty-table-cell">
                              No expense transactions coded yet for this period. Use the row below to log receipts.
                            </td>
                          </tr>
                        ) : (
                          codedExpenses.map((row) => {
                            const rowTotal = Object.values(row.categoryAmounts).reduce((s, a) => s + (Number(a) || 0), 0)
                            return (
                              <tr key={row.id}>
                                <td>
                                  <input
                                    type="date"
                                    className="matrix-date-input"
                                    value={row.date}
                                    onChange={(e) => updateCodedExpenseField(row.id, 'date', e.target.value)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="matrix-desc-input"
                                    value={row.description}
                                    onChange={(e) =>
                                      updateCodedExpenseField(row.id, 'description', e.target.value)
                                    }
                                    placeholder="e.g. Costco, Chevron, Target..."
                                  />
                                </td>
                                {categories.map((cat) => (
                                  <td key={cat.id} style={{ textAlign: 'right' }}>
                                    <div className="matrix-amt-wrap">
                                      <span>$</span>
                                      <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={row.categoryAmounts[cat.id] || ''}
                                        onChange={(e) =>
                                          updateCodedExpenseCell(
                                            row.id,
                                            cat.id,
                                            Number(e.target.value)
                                          )
                                        }
                                        placeholder="0.00"
                                      />
                                    </div>
                                  </td>
                                ))}
                                <td style={{ textAlign: 'right' }}>
                                  <strong className="matrix-row-total">
                                    {formatCurrency(rowTotal)}
                                  </strong>
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="btn-delete-row"
                                    onClick={() => deleteCodedExpense(row.id)}
                                    title="Delete line item"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                      <tfoot>
                        <tr className="matrix-summary-row">
                          <td colSpan={2}>
                            <strong>Category Totals Spent:</strong>
                          </td>
                          {categories.map((cat) => {
                            const spent = codedExpenses.reduce(
                              (sum, r) => sum + (Number(r.categoryAmounts[cat.id]) || 0),
                              0
                            )
                            const isOver = cat.budgetedAmount > 0 && spent > cat.budgetedAmount
                            return (
                              <td key={cat.id} style={{ textAlign: 'right' }}>
                                <div className="matrix-foot-total">
                                  <strong className={isOver ? 'text-over-budget' : 'text-good-budget'}>
                                    {formatCurrency(spent)}
                                  </strong>
                                  <small className="budget-target-hint">
                                    Budget: {formatCurrency(cat.budgetedAmount)}
                                  </small>
                                </div>
                              </td>
                            )
                          })}
                          <td style={{ textAlign: 'right' }}>
                            <strong className="matrix-grand-total">
                              {formatCurrency(
                                codedExpenses.reduce(
                                  (sum, r) =>
                                    sum +
                                    Object.values(r.categoryAmounts).reduce((rs, a) => rs + (Number(a) || 0), 0),
                                  0
                                )
                              )}
                            </strong>
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Add New Line Item Row */}
                  <div className="add-matrix-item-bar">
                    <h4>Add a new expense transaction:</h4>
                    <form className="add-expense-line-form" onSubmit={addCodedExpense}>
                      <input
                        type="date"
                        value={newExpDate}
                        onChange={(e) => setNewExpDate(e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        value={newExpDesc}
                        onChange={(e) => setNewExpDesc(e.target.value)}
                        placeholder="Description (e.g. Trader Joe's, Shell Gas, Starbucks...)"
                        required
                      />
                      <div className="multi-cat-input-row">
                        {categories.map((cat) => (
                          <div className="mini-cat-field" key={cat.id}>
                            <label>{cat.name}</label>
                            <div className="mini-input-wrap">
                              <span>$</span>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={newExpAmounts[cat.id] || ''}
                                onChange={(e) =>
                                  setNewExpAmounts({ ...newExpAmounts, [cat.id]: e.target.value })
                                }
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <button type="submit" className="btn-add-quick">
                        <Plus size={16} /> Add Expense Line
                      </button>
                    </form>
                  </div>
                </div>

                <div className="modal-footer-actions">
                  <button type="button" className="btn-gold" onClick={() => setActiveFeatureModal(null)}>
                    Save Coding &amp; Return to Dashboard
                  </button>
                </div>
              </div>
            )}

            {/* OPTION 3: VIEW BUDGETS */}
            {activeFeatureModal === 'view-budgets' && (
              <div className="feature-modal-content">
                <div className="feature-modal-header">
                  <div className="action-icon-box icon-budgets"><PieChart size={26} /></div>
                  <div>
                    <h2>Babylonian Budget Distribution</h2>
                    <p>Live snapshot based on your income, committed bills, and budgeted expenses.</p>
                  </div>
                </div>

                <div className="budget-breakdown-cards">
                  <div className="breakdown-card card-gold">
                    <div className="breakdown-head"><span>10% Gold Vault</span><strong>{formatCurrency(goldVaultTarget)}</strong></div>
                    <p>Your foundation savings. Paid first to yourself before anything else.</p>
                  </div>
                  <div className="breakdown-card card-bills">
                    <div className="breakdown-head"><span>Committed Monthly Bills</span><strong>{formatCurrency(totalMonthlyBills)}</strong></div>
                    <p>Total fixed overhead across your {bills.length} monthly recurring bills.</p>
                  </div>
                  <div className="breakdown-card" style={{ background: '#f1f7eb', borderColor: '#d3e4c4' }}>
                    <div className="breakdown-head"><span style={{ color: '#335b1f' }}>Budgeted Living Expenses</span><strong style={{ color: '#274b17' }}>{formatCurrency(totalMonthlyExpensesEst)}</strong></div>
                    <p>Total budgeted allocations across your {categories.length} variable spending categories.</p>
                  </div>
                  <div className="breakdown-card card-living">
                    <div className="breakdown-head"><span>Remaining Cash Cushion / Debt Payoff</span><strong>{formatCurrency(freeCashFlow)}</strong></div>
                    <p>Free surplus available for debt reduction, investments, or unexpected buffers.</p>
                  </div>
                </div>
                <div className="modal-footer-actions"><button type="button" className="btn-gold" onClick={() => setActiveFeatureModal(null)}>Close Budget View</button></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================= AUTH MODAL ======================= */}
      {authModalOpen && (
        <div className="modal-backdrop" onClick={() => setAuthModalOpen(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
            <button className="modal-close-btn" type="button" onClick={() => setAuthModalOpen(false)} aria-label="Close modal"><X size={20} /></button>
            <div className="auth-header">
              <span className="auth-seal"><CircleDollarSign size={24} /></span>
              <h2 id="auth-modal-title">{authMode === 'signup' ? 'Begin Your Babylon Journey' : 'Welcome Back'}</h2>
              <p>{authMode === 'signup' ? 'Create an account to save your budget and sync across your devices.' : 'Log in to manage your budget and inspect your cash flow.'}</p>
            </div>
            <div className="auth-tabs">
              <button type="button" className={'auth-tab ' + (authMode === 'signup' ? 'active' : '')} onClick={() => { setAuthMode('signup'); setAuthError(null); }}>Sign Up</button>
              <button type="button" className={'auth-tab ' + (authMode === 'login' ? 'active' : '')} onClick={() => { setAuthMode('login'); setAuthError(null); }}>Log In</button>
            </div>
            {authError && <div className="auth-error-banner" role="alert">{authError}</div>}
            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {authMode === 'signup' && (
                <label className="auth-field">
                  <span>Your Name</span>
                  <div className="input-wrap"><User size={16} /><input type="text" placeholder="e.g. Arkad" value={authName} onChange={(e) => setAuthName(e.target.value)} required /></div>
                </label>
              )}
              <label className="auth-field">
                <span>Email Address</span>
                <div className="input-wrap"><Mail size={16} /><input type="email" placeholder="name@example.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required /></div>
              </label>
              <label className="auth-field">
                <span>Password</span>
                <div className="input-wrap"><Lock size={16} /><input type="password" placeholder="••••••••" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required /></div>
              </label>
              <button type="submit" className="btn-gold-block">{authMode === 'signup' ? 'Create Account & Start Setup' : 'Log In & View Budget'}</button>
            </form>
            <div className="auth-divider"><span>OR</span></div>
            <button type="button" className="btn-guest" onClick={() => { setAuthModalOpen(false); setView('setup'); }}>Continue as Guest (No Sign In Required)</button>
          </div>
        </div>
      )}
    </div>
  )
}

function ordinalSuffix(day: number) {
  if (day > 3 && day < 21) return 'th'
  switch (day % 10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

function frequencyLabel(frequency: PayFrequency | ExpenseFrequency) {
  return frequencies.find((option) => option.value === frequency)?.label ?? frequency
}

function formatDate(date: string) {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date + 'T00:00:00'))
}

function formatCurrency(amount: number | undefined) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount ?? 0)
}
`;

fs.writeFileSync(targetPath, code, 'utf-8');
console.log('src/App.tsx updated successfully with dual-table Pay Bills and Category Matrix Expense Coding!');
