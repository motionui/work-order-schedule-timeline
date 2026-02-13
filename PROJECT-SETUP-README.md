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
