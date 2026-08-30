# Babylon Budget

A personal budgeting app beginning with a setup flow for expense categories and payroll frequency.

## Open directly as a web page

You can open **[Babylon Budget.html](Babylon%20Budget.html)** directly in any web browser (Chrome, Edge, Firefox, Safari) without running a local server or Node.js.

- Double-click `Babylon Budget.html` (or `Open Babylon Budget.bat`).

## Build standalone web page

To re-bundle after making changes:

```powershell
npm run build
```

This compiles TypeScript, bundles the assets, and outputs the updated `Babylon Budget.html`.

## Run locally (development server)

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
