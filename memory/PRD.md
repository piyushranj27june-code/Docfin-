# DocFin — Product Requirements Document

## Vision
A mobile app that helps young Indian doctors take control of their personal & hospital finances using AI-powered insights, expense tracking, tax & loan planning, and productivity analytics.

## Target User
Young Indian doctors (25–35) running independent practices or managing/owning small clinics & hospitals.

## Core Modules (v1)

### 1. AI Expense Categorization
- Users add expense (description + amount)
- Claude Sonnet 4.5 auto-categorizes into 14 finance-relevant categories (Medical Equipment, CME, Loan EMI, etc.)
- Monthly + all-time summary with category-wise progress bars

### 2. Loan & Investment Planning
- **Loan EMI calculator** — principal, rate, tenure → EMI, total interest, total payable
- **SIP calculator** — monthly contribution, years, return → future value, gain
- Investment tracking (SIP, PPF, NPS, MF, FD, Stocks)

### 3. Tax Planning (India FY 2025-26)
- Old vs New regime comparison
- Inputs: gross income, 80C, 80D, home loan 24(b), NPS 80CCD(1B)
- 87A rebate handling (new regime: up to ₹12L taxable)
- Recommendation + savings amount

### 4. Hospital Revenue & Leakage
- Monthly revenue tracking across OPD, IPD, Pharmacy, Lab + costs
- Auto-computed net cashflow
- **Leakage detection**: month-over-month alerts for revenue drops >15%, cost spikes >20%, negative cashflow

### 5. Productivity Tracking
- Daily log: patients, hours, revenue, procedures
- Auto-computed patients/hour and revenue/patient
- 30-day aggregate stats

### 6. AI Finance Coach (Hospital Improvement)
- Chat with Claude Sonnet 4.5
- Context-aware: pulls user's revenue, expenses, productivity into prompt
- Suggests revenue growth, leakage reduction, tax optimization, productivity improvements
- Curated quick prompts on first open

## Auth
JWT-based email/password with bcrypt. New users get demo data seeded automatically on registration.

## Tech
- **Backend:** FastAPI, MongoDB (Motor), emergentintegrations (Claude Sonnet 4.5)
- **Frontend:** Expo React Native, expo-router, StyleSheet, @expo/vector-icons (Feather)
- **Design:** Organic & Earthy palette — deep forest green (#1A4331) brand, terracotta accent (#CC5A3A)
- **Currency:** INR (₹), formatted in lakhs/crores

## Navigation
Bottom tabs:
1. Home (Dashboard)
2. Expenses
3. Planning (Loan / SIP / Tax)
4. Hospital (Revenue & Leakage / Productivity)
5. AI Coach

## Out of Scope (v1)
- Push notifications
- Bank/UPI account linking
- Multi-user hospital teams
- Document/receipt OCR
- Web/desktop optimization
