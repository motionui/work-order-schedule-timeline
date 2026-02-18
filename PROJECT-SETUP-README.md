# ProjectSetup

```bash
nvm use 24.12.0
ng new work-order-schedule-timeline --standalone --style=scss --strict --routing=false
cd work-order-schedule-timeline
ng add @ng-bootstrap/ng-bootstrap
npm install @ng-select/ng-select
npm install --save-dev prettier
npm install --save-dev eslint-config-prettier (Turns off ESLint rules that conflict with Prettier formatting.)
npm install --save-dev husky lint-staged (Add auto format to pre-commit to ensure consistent code.)
```

```
Timescale dropdown
- chevron color not consistent
- icon direction (should be pointing up when dropdown menu is opened)
- requirement stated default zoom level is day and video state month
- this demo will assume day zoom level

Work order drawer
- form field labels (sentense case or capitalized)
- status dropdown seems to have a different chevron icon

Work center work order
- minimum duration = 1 day

Add project setup approach
Libraries used and why
```
