import { FormEvent, useState } from 'react'
import { ArrowLeft, ArrowRight, BriefcaseBusiness, CalendarDays, CircleDollarSign, CreditCard, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react'
import { type Bill, type BudgetProfile, type IncomeSource, type IncomeType, type PayFrequency, type PaymentMethod, loadBudgetProfile, saveBudgetProfile } from './budgetProfile'

const frequencies: { value: PayFrequency; label: string; detail: string }[] = [
  { value: 'weekly', label: 'Weekly', detail: '52 paychecks' },
  { value: 'biweekly', label: 'Every 2 weeks', detail: '26 paychecks' },
  { value: 'semimonthly', label: 'Twice a month', detail: '24 paychecks' },
  { value: 'monthly', label: 'Monthly', detail: '12 paychecks' },
]

const starterCategories = ['Housing', 'Food & dining', 'Transportation']
const dueDays = Array.from({ length: 31 }, (_, index) => index + 1)
const steps = ['Income', 'Bills', 'Expenses']

export default function App() {
  const savedProfile = loadBudgetProfile()
  const [categories, setCategories] = useState(savedProfile?.categories ?? starterCategories)
  const [bills, setBills] = useState<Bill[]>(savedProfile?.bills ?? [])
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>(savedProfile?.incomeSources ?? [])
  const [activeStep, setActiveStep] = useState(0)
  const [newCategory, setNewCategory] = useState('')
  const [incomeLabel, setIncomeLabel] = useState('')
  const [incomeFrequency, setIncomeFrequency] = useState<PayFrequency>('biweekly')
  const [lastPayDate, setLastPayDate] = useState('')
  const [incomeType, setIncomeType] = useState<IncomeType>('salary')
  const [estimatedTakeHome, setEstimatedTakeHome] = useState('')
  const [editingIncomeId, setEditingIncomeId] = useState<string | null>(null)
  const [billName, setBillName] = useState('')
  const [anticipatedBillAmount, setAnticipatedBillAmount] = useState('')
  const [billDueDay, setBillDueDay] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('manual')
  const [paymentUrl, setPaymentUrl] = useState('')
  const [editingBillId, setEditingBillId] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  function addCategory(event: FormEvent) {
    event.preventDefault()
    const category = newCategory.trim()
    if (!category || categories.some((item) => item.toLowerCase() === category.toLowerCase())) return

    setCategories((currentCategories) => [...currentCategories, category])
    setNewCategory('')
  }

  function removeCategory(category: string) {
    setCategories((currentCategories) => currentCategories.filter((item) => item !== category))
  }

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
    setIncomeSources((currentSources) => editingIncomeId
      ? currentSources.map((source) => source.id === editingIncomeId ? incomeSource : source)
      : [...currentSources, incomeSource])
    resetIncomeForm()
  }

  function removeIncome(incomeId: string) {
    setIncomeSources((currentSources) => currentSources.filter((source) => source.id !== incomeId))
    if (editingIncomeId === incomeId) resetIncomeForm()
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

  function addBill(event: FormEvent) {
    event.preventDefault()
    const name = billName.trim()
    const url = paymentUrl.trim()
    const anticipatedAmount = Number(anticipatedBillAmount)
    if (!name || !url || !Number.isFinite(anticipatedAmount) || anticipatedAmount < 0) return

    const bill: Bill = {
      id: editingBillId ?? crypto.randomUUID(),
      name,
      anticipatedAmount,
      dueDay: billDueDay,
      paymentMethod,
      paymentUrl: url,
    }
    setBills((currentBills) => editingBillId
      ? currentBills.map((currentBill) => currentBill.id === editingBillId ? bill : currentBill)
      : [...currentBills, bill])
    resetBillForm()
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
    setBills((currentBills) => currentBills.filter((bill) => bill.id !== billId))
    if (editingBillId === billId) resetBillForm()
  }

  function continueToBudget() {
    const profile: BudgetProfile = { categories, bills, incomeSources }
    saveBudgetProfile(profile)
    setIsSaved(true)
  }

  function nextStep() {
    if (activeStep === steps.length - 1) {
      continueToBudget()
      return
    }
    setActiveStep((step) => step + 1)
  }

  return (
    <main className="app-shell">
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="/" aria-label="Babylon Budget home">
          <span className="brand-mark"><CircleDollarSign size={22} strokeWidth={2.3} /></span>
          <span>Babylon <strong>Budget</strong></span>
        </a>
        <span className="step-label">Your budget setup <span>{activeStep + 1} of 3</span></span>
      </nav>

      <section className="setup-layout" aria-labelledby="setup-title">
        <div className="intro-panel">
          <p className="eyebrow">BUILD YOUR FOUNDATION</p>
          <h1 id="setup-title">A budget built around your actual life.</h1>
          <p className="intro-copy">Set up your income, spending areas, and monthly bills one clear step at a time. We will shape every plan around your actual rhythm.</p>
          <div className="rhythm-card">
            <span className="rhythm-number">01</span>
            <div><strong>Start with your income</strong><p>Each source can follow its own payday and pay type.</p></div>
          </div>
          <div className="accent-lines" aria-hidden="true"><span /><span /><span /></div>
        </div>

        <div className="form-panel">
          <div className="setup-progress" aria-label="Setup progress">{steps.map((step, index) => <button className={index === activeStep ? 'active' : index < activeStep ? 'complete' : ''} type="button" onClick={() => setActiveStep(index)} aria-current={index === activeStep ? 'step' : undefined} key={step}>{index + 1}<small>{step}</small></button>)}</div>

          {activeStep === 0 && <>
          <div className="form-heading"><p className="eyebrow">STEP 1 OF 3</p><h2>Add your income</h2><p>Track each income source separately so every paycheck lands on the right day.</p></div>
          <div className="field-group income-section">
            <div className="field-header"><label>Income sources</label><span>{incomeSources.length} added</span></div>
            {incomeSources.length > 0 && <div className="income-list" aria-label="Your income sources">{incomeSources.map((source) => <div className="income-row" key={source.id}><span className="income-icon"><BriefcaseBusiness size={16} /></span><span className="income-details"><strong>{source.label}<em>{formatCurrency(source.estimatedTakeHome)}</em></strong><small>{frequencyLabel(source.frequency)} · Last paid {formatDate(source.lastPayDate)} · {source.incomeType === 'hourly' ? 'Hourly' : 'Salary'}</small></span><button className="icon-button" type="button" onClick={() => editIncome(source)} aria-label={`Edit ${source.label}`} title={`Edit ${source.label}`}><Pencil size={16} /></button><button className="icon-button" type="button" onClick={() => removeIncome(source.id)} aria-label={`Remove ${source.label}`} title={`Remove ${source.label}`}><Trash2 size={17} /></button></div>)}</div>}
            <form className="income-form" onSubmit={addIncome}>
              <input value={incomeLabel} onChange={(event) => setIncomeLabel(event.target.value)} placeholder="Income label, e.g. Main job" aria-label="Income label" required />
              <label className="take-home-field"><span>Estimated take-home</span><input value={estimatedTakeHome} onChange={(event) => setEstimatedTakeHome(event.target.value)} placeholder="0.00" aria-label="Estimated take-home amount" type="number" min="0" step="0.01" inputMode="decimal" required /></label>
              <label className="select-field"><span>Pay frequency</span><select value={incomeFrequency} onChange={(event) => setIncomeFrequency(event.target.value as PayFrequency)} aria-label="Income pay frequency">{frequencies.map((frequency) => <option key={frequency.value} value={frequency.value}>{frequency.label}</option>)}</select></label>
              <label className="date-field"><CalendarDays size={15} /><span>Last pay date</span><input type="date" value={lastPayDate} onChange={(event) => setLastPayDate(event.target.value)} aria-label="Last pay date" required /></label>
              <fieldset className="income-type"><legend>Income type</legend><label><input type="radio" name="income-type" checked={incomeType === 'hourly'} onChange={() => setIncomeType('hourly')} /> Hourly</label><label><input type="radio" name="income-type" checked={incomeType === 'salary'} onChange={() => setIncomeType('salary')} /> Salary</label></fieldset>
              <button className="add-income-button" type="submit">{editingIncomeId ? <Pencil size={17} /> : <Plus size={18} />}{editingIncomeId ? 'Save changes' : 'Add income'}</button>
              {editingIncomeId && <button className="cancel-edit-button" type="button" onClick={resetIncomeForm}>Cancel edit</button>}
            </form>
          </div></>}

          {activeStep === 1 && <><div className="form-heading"><p className="eyebrow">STEP 2 OF 3</p><h2>Add your monthly bills</h2><p>Keep your payment dates and bill websites within reach.</p></div><div className="field-group bills-section">
            <div className="field-header"><label>Your monthly bills</label><span>{bills.length} added</span></div>
            {bills.length > 0 && <div className="bill-list" aria-label="Your monthly bills">
              {bills.map((bill) => <div className="bill-row" key={bill.id}>
                <span className="bill-icon" aria-hidden="true"><CreditCard size={16} /></span>
                <span className="bill-details"><strong>{bill.name}<em>{formatCurrency(bill.anticipatedAmount)}</em></strong><small>Due the {bill.dueDay}{ordinalSuffix(bill.dueDay)} · {bill.paymentMethod === 'autopay' ? 'Autopay' : 'Manual pay'}</small></span>
                <a className="payment-link" href={bill.paymentUrl} target="_blank" rel="noreferrer" aria-label={`Open ${bill.name} payment website`} title={`Open ${bill.name} payment website`}><ExternalLink size={16} /></a>
                <button className="icon-button" type="button" onClick={() => editBill(bill)} aria-label={`Edit ${bill.name}`} title={`Edit ${bill.name}`}><Pencil size={16} /></button>
                <button className="icon-button" type="button" onClick={() => removeBill(bill.id)} aria-label={`Remove ${bill.name}`} title={`Remove ${bill.name}`}><Trash2 size={17} /></button>
              </div>)}
            </div>}
            <form className="bill-form" onSubmit={addBill}>
              <input value={billName} onChange={(event) => setBillName(event.target.value)} placeholder="Bill name" aria-label="Bill name" required />
              <label className="bill-amount-field"><span>Anticipated amount</span><input value={anticipatedBillAmount} onChange={(event) => setAnticipatedBillAmount(event.target.value)} placeholder="0.00" aria-label="Anticipated bill amount" type="number" min="0" step="0.01" inputMode="decimal" required /></label>
              <input value={paymentUrl} onChange={(event) => setPaymentUrl(event.target.value)} placeholder="Payment website URL" aria-label="Payment website URL" type="url" required />
              <label className="compact-field"><CalendarDays size={15} /><span>Due day</span><select value={billDueDay} onChange={(event) => setBillDueDay(Number(event.target.value))} aria-label="Monthly due day">{dueDays.map((day) => <option key={day} value={day}>{day}{ordinalSuffix(day)}</option>)}</select></label>
              <fieldset className="payment-method"><legend>Payment method</legend><label><input type="radio" name="payment-method" checked={paymentMethod === 'autopay'} onChange={() => setPaymentMethod('autopay')} /> Autopay</label><label><input type="radio" name="payment-method" checked={paymentMethod === 'manual'} onChange={() => setPaymentMethod('manual')} /> Manual</label></fieldset>
              <button className="add-bill-button" type="submit">{editingBillId ? <Pencil size={17} /> : <Plus size={18} />}{editingBillId ? 'Save changes' : 'Add bill'}</button>
              {editingBillId && <button className="cancel-edit-button" type="button" onClick={resetBillForm}>Cancel edit</button>}
            </form>
          </div></>}

          {activeStep === 2 && <>
          <div className="form-heading"><p className="eyebrow">STEP 3 OF 3</p><h2>Choose your expenses</h2><p>Use categories to see exactly where your money is going.</p></div>
          <div className="field-group">
            <div className="field-header"><label>Expense categories</label><span>{categories.length} selected</span></div>
            <div className="category-list" aria-label="Selected expense categories">
              {categories.map((category) => <div className="category-row" key={category}><span className="category-dot" aria-hidden="true" /><span>{category}</span><button className="icon-button" type="button" onClick={() => removeCategory(category)} aria-label={`Remove ${category}`} title={`Remove ${category}`}><Trash2 size={17} /></button></div>)}
            </div>
            <form className="add-category" onSubmit={addCategory}><input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="Add a category" aria-label="New expense category" /><button type="submit" aria-label="Add category" title="Add category"><Plus size={19} /></button></form>
          </div>
          </>}

          <div className="form-footer"><button className="back-button" type="button" onClick={() => setActiveStep((step) => step - 1)} disabled={activeStep === 0}><ArrowLeft size={18} />Back</button><p>{isSaved ? 'Your budget setup is saved.' : 'You can refine this any time.'}</p><button className="continue-button" type="button" onClick={nextStep} disabled={activeStep === 0 && incomeSources.length === 0}>{activeStep === 2 ? (isSaved ? 'Saved' : 'Finish setup') : 'Continue'}<ArrowRight size={18} /></button></div>
        </div>
      </section>
    </main>
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

function frequencyLabel(frequency: PayFrequency) {
  return frequencies.find((option) => option.value === frequency)?.label ?? frequency
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${date}T00:00:00`))
}

function formatCurrency(amount: number | undefined) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount ?? 0)
}
