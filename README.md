# Babylon Budget

A personal budgeting app beginning with a setup flow for expense categories and payroll frequency.

## Run locally

```powershell
npm install
npm run dev
```

## Subscription-ready direction

The current UI stores an anonymous local draft through `src/budgetProfile.ts`. It is deliberately isolated from the form so a future backend can replace it with an authenticated profile API without rewriting the interface.

Suggested next layers:

- Authentication and account/profile API
- Persistent budget, transaction, and category data store
- Payment provider integration with subscription status enforced server-side
- Protected dashboard and billing management area
