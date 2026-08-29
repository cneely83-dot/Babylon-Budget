export type PayFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly'
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

export interface BudgetProfile {
  categories: string[]
  bills: Bill[]
  incomeSources: IncomeSource[]
}

const storageKey = 'babylon-budget.profile'

export function loadBudgetProfile(): BudgetProfile | null {
  const savedProfile = localStorage.getItem(storageKey)
  if (!savedProfile) return null

  try {
    return JSON.parse(savedProfile) as BudgetProfile
  } catch {
    localStorage.removeItem(storageKey)
    return null
  }
}

export function saveBudgetProfile(profile: BudgetProfile) {
  localStorage.setItem(storageKey, JSON.stringify(profile))
}
