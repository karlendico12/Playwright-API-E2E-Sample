# Playwright Beginner

A TypeScript Playwright project for practicing UI and API-validated authentication tests.

The tests target two public demo applications:

- [Sauce Demo](https://www.saucedemo.com/)
- [Thinking Tester Contact List](https://thinking-tester-contact-list.herokuapp.com/)

## Prerequisites

- Node.js 20 or later
- npm
- Internet access

## Installation

Install the project dependencies:

```powershell
npm install
```

Install the Playwright browser binaries:

```powershell
npx playwright install
```

## Run Tests

Run the complete suite in all configured browsers:

```powershell
npx playwright test
```

Run the suite in Chromium:

```powershell
npx playwright test --project=chromium
```

Run tests with a visible browser window:

```powershell
npx playwright test --project=chromium --headed
```

List discovered tests without running them:

```powershell
npx playwright test --list
```

Run one test file:

```powershell
npx playwright test tests/login.spec.ts --project=chromium
npx playwright test tests/login-before-each.spec.ts --project=chromium
npx playwright test tests/contact-login.spec.ts --project=chromium
```

Test files must use Playwright's default `*.spec.ts` or `*.test.ts` naming pattern. For example, `login-before-each.spec.ts` is discovered, while `login-before-each.ts` is not.

## Test Coverage

### `tests/login.spec.ts`

- Logs in to Sauce Demo with valid credentials.
- Verifies an invalid Sauce Demo password displays an error.

### `tests/login-before-each.spec.ts`

- Creates a unique Contact List user through the API before each test.
- Logs in and validates the `/users/login` API response.
- Logs in, logs out, and validates the `/users/logout` API response and login form.

### `tests/contact-login.spec.ts`

Runs a serial authentication flow using a generated account:

- Sign up through the UI and validate the `POST /users` response.
- Log in with the created account and validate the login response.
- Log out and verify the login form is visible.

## Configuration

Playwright configuration is in [`playwright.config.ts`](playwright.config.ts).

Configured projects:

- Chromium
- Firefox
- WebKit

The HTML reporter is enabled by default. After a test run, open the report with:

```powershell
npx playwright show-report
```

## Notes

- Tests use live external websites and APIs, so network outages, service changes, rate limits, or slow responses can cause failures.
- No local web server or `baseURL` is configured.
- The Contact List tests generate temporary accounts with unique email addresses.
- The test suite runs in parallel by default. The `contact-login.spec.ts` authentication flow is explicitly serial because later tests use the account created by the signup test.
