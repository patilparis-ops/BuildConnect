# BuildConnect

Your Vision, Built by the Best — India's premium construction marketplace connecting homeowners with verified contractors.

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## Testing

### Unit Tests (Vitest)

Unit tests are located alongside components in `__tests__` directories. They use [Vitest](https://vitest.dev/) with React Testing Library.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### End-to-End Tests (Playwright)

E2E tests are in the `e2e/` directory. They use [Playwright](https://playwright.dev/) to verify the app in a real browser.

```bash
# Run all E2E tests
npx playwright test

# Run with UI mode (interactive)
npx playwright test --ui

# View the HTML report
npx playwright show-report
```

The E2E tests are configured to automatically start the Vite dev server before running.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19, TypeScript 6 |
| Build | Vite 8, Rolldown |
| Styling | Tailwind CSS 4 |
| Routing | React Router v7 |
| State | Zustand + TanStack Query |
| Animations | Framer Motion 12 |
| Forms | React Hook Form + Zod |
| UI Icons | Lucide React |
| Unit Tests | Vitest + Testing Library |
| E2E Tests | Playwright |
