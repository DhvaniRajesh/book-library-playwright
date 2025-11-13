# Book Library Playwright Tests

A comprehensive Playwright-based API testing suite for the Book Library application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)

## Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**: For cloning the repository

## Installation

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd book-library-playwright
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify installation**:
   ```bash
   npx playwright --version
   ```

## Configuration

### Environment Variables

The project uses a `.env` file to configure the API base URL and authentication credentials.

1. **Copy the environment file**:
   ```bash
   cp config/dev.env .env
   ```

2. **Edit `.env`** with your configuration:
   ```dotenv
   BASE_URL=http://localhost:3000
   USERNAME=admin
   PASSWORD=
   ENV=staging
   ```

   - `BASE_URL`: The base URL of the Book Library API
   - `USERNAME`: Authentication username
   - `PASSWORD`: Authentication password
   - `ENV`: Environment designation (e.g., staging, production)

### TypeScript Configuration

The project includes `tsconfig.json` for TypeScript compilation settings.

## Running Tests

### Run All Tests

Execute all test suites in the project:

```bash
npm test
```

or

```bash
npx playwright test
```


### Run Specific Test File

Run tests from a single test file:

```bash
npx playwright test tests/auth/login.spec.ts
```

or

```bash
npx playwright test tests/books/getBooks.spec.ts
```

### Run Tests with Debugging

Run tests with the Playwright inspector for step-by-step debugging:

```bash
npx playwright test --debug
```

### Generate and View HTML Report

After running tests, view the generated HTML report:

```bash
npx playwright show-report
```

## Project Structure

```
├── config/
│   └── dev.env                 # Environment configuration
├── src/
│   ├── clients/                # HTTP clients for API communication
│   │   ├── auth.client.ts      # Authentication API client
│   │   └── books.client.ts     # Books API client
│   ├── fixtures/               # Test fixtures and setup
│   │   └── auth.fixture.ts     # Authentication test fixtures
│   ├── schemas/                # Validation schemas
│   │   └── book.schema.ts      # Book data validation
│   ├── services/               # Business logic services
│   │   ├── auth.service.ts     # Authentication service
│   │   └── books.service.ts    # Books service
│   ├── types/                  # TypeScript type definitions
│   │   └── book.dto.ts         # Book data transfer objects
│   └── utils/                  # Utility functions
│       ├── env.ts              # Environment variable loader
│       └── schema-helpers.ts   # Schema validation helpers
├── tests/
│   ├── auth/
│   │   └── login.spec.ts       # Login authentication tests
│   └── books/
│       ├── deleteBook.spec.ts  # Book deletion tests
│       ├── getBookById.spec.ts # Single book retrieval tests
│       ├── getBooks.spec.ts    # List books tests
│       ├── postBook.spec.ts    # Book creation tests
│       └── putBooks.spec.ts    # Book update tests
├── playwright-report/          # Generated test reports
├── test-results/               # Test result artifacts
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies
```


## Key Features

- **TypeScript Support**: Full TypeScript for type safety
- **Modular Architecture**: Separation of concerns with clients, services, and utilities
- **Schema Validation**: Zod schemas for request/response validation
- **Environment Management**: Configurable environments via dotenv
- **HTML Reporting**: Detailed HTML test reports with traces
- **API Testing**: Comprehensive API endpoint testing

## Troubleshooting

### Tests Won't Run
- Ensure Node.js and npm are installed: `node --version && npm --version`
- Reinstall dependencies: `rm -r node_modules && npm install`
- Check the `BASE_URL` in `.env` is correct and the API is running

### Playwright Issues
- Update Playwright: `npm install --save-dev @playwright/test@latest`
- Clear cache: `npx playwright install`

### Authentication Failures
- Verify credentials in `.env` file
- Check API is accessible at the configured `BASE_URL`
- Review test output for detailed error messages

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright API Testing Guide](https://playwright.dev/docs/api-testing)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
