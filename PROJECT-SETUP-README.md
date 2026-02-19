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

While reviewing the requirements doc and reference video, several assumptions were made to resolve minor ambiguities and ensure a consistent implementation.

## Timescale Dropdown

- The dropdown chevron icon points **up when opened** and **down when closed**, following common UI conventions.
- Although the demo video shows **Month view**, the requirement doc (`FE-technical-test.md`) specifies **Day view as the default zoom level**. This implementation follows the requirement doc and defaults to **Day view**.

## Work Order Drawer

- Form field labels use **Capitalized case** (e.g., “Start Date”, “Work Order Name”) for visual consistency.
- The Status dropdown uses the chevron style shown in the design. Any visual differences between dropdowns are assumed to be intentional.

## Work Center & Work Orders

- The **minimum work order duration is 1 day**.
- Users **cannot create work orders prior to today’s date**.
- Completed work orders **cannot be edited or deleted**.
- Work orders must not overlap within the same work center (**FormGroup validation**).

## Date Picker

- I wasn’t able to find a specific design for the calendar dropdown in the Sketch file, so I’m using the default style for now.

# Upgrades / Recommendations

- Enhance accessibility by incorporating ARIA roles and labels where **appropriate**. Even if the application is not specifically designed for users with disabilities, accessibility best practices such as maintaining proper **color contrast** should be included as part of the design guidelines.

- **Optional:** Introducing a custom UI library that centralizes the design elements and style guidelines. By standardizing commonly used UI components, we can ensure a consistent user experience across all products. This approach also improves efficiency — any global design updates can be implemented once in the UI library and automatically applied throughout the application.

- Setting up Angular with Vitest should be relatively straightforward. We should aim to create test cases that validate core functionality and ensure that critical features are not broken. Additionally, we can integrate Husky to run tests automatically before each commit, helping prevent regressions from being checked into the codebase.

- Decide if addDays should always return midnight (startOfDay) or preserve the time.
  Decide if startOfWeek should always return midnight and support offset.
