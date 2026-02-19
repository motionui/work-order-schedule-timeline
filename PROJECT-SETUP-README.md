# Project Setup Approach

For this project, I'm choosing Angular 21 as the baseline framework version.

While Angular 17 marked a major modernization milestone (Signals, built-in control flow), Angular 21 represents a more mature and refined evolution of that direction. My decision is primarily driven by two factors:

1. Long-term architectural alignment
2. Personal growth and continuous learning

```bash
nvm use 24.12.0
ng new work-order-schedule-timeline --standalone --style=scss --strict --routing=false
cd work-order-schedule-timeline
ng add @ng-bootstrap/ng-bootstrap
npm install @ng-select/ng-select
npm install --save-dev prettier
npm install --save-dev eslint-config-prettier
npm install --save-dev husky lint-staged
```

---

# Libraries Used

- **ng-select**  
  Required by technical specifications to provide enhanced dropdown functionality and flexibility.

- **ng-bootstrap (ngb)**  
  Used for dropdowns, tooltips, datepickers, and off-canvas drawer components as required.

- **Prettier**  
  Ensures consistent code formatting across contributors, improving readability and simplifying code reviews.

- **Husky**  
  Enforces project standards via Git hooks, automatically running formatting and unit tests before commits to maintain code quality and consistency.

---

# Assumptions & Implementation Notes

While reviewing the BRD and reference video, several assumptions were made to resolve minor ambiguities and ensure a consistent implementation.

## Timescale Dropdown

- The dropdown chevron icon points **up when opened** and **down when closed**, following common UI conventions.
- Although the demo video shows **Month view**, the BRD (`FE-technical-test.md`) specifies **Day view as the default zoom level**. This implementation follows the BRD and defaults to **Day view**.

## Work Order Drawer

- Form field labels use **Capitalized case** (e.g., “Start Date”, “Work Order Name”) for visual consistency.
- The Status dropdown uses the chevron style shown in the design. Any visual differences between dropdowns are assumed to be intentional.

## Work Center & Work Orders

- The **minimum work order duration is 1 day**.
- Users **cannot create work orders prior to today’s date**.
- Completed work orders **cannot be edited or deleted**.
- Work orders must not overlap within the same work center (validation enforced).
