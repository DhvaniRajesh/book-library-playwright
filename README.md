# Book Library Playwright Tests

A comprehensive Playwright-based API testing suite for the Book Library application.

## Table of Contents

- [Why This Framework](#why-this-framework)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Future Improvements](#future-improvements)

## Why This Framework

This framework is designed for **long-term maintainability**, **scalability**, and **clear separation of concerns**, making it suitable for enterprise-level API test automation.

### Key Goals

- **Avoid Duplication**: Centralized API clients and services eliminate repeated code across test suites
- **Enforce Consistent API Contracts**: Strongly-typed DTOs and Zod schemas validate request/response structures
- **Improve Test Readability**: High-level service functions hide implementation details, focusing on test logic
- **Support Large, Growing Test Suites**: Modular architecture scales effortlessly with new endpoints and test cases

### Why Playwright?

Playwright was chosen because:

- **Built-in HTTP Client (APIRequestContext)**: Built-in API request context for reliable HTTP operations
- **TypeScript Integration**: Tight integration with TypeScript for full type safety and IntelliSense
- **Comprehensive Tooling**: Tracing, HTML reports, parallel execution, and strong reliability
- **Single Framework**: Handles both API and UI testing, reducing tool fragmentation
- **Industry Standard**: Widely adopted in enterprise test automation with strong community support

## Architecture & Design Decisions

The project follows a **layered architecture** pattern, separating concerns across multiple modules for clarity, reusability, and maintainability.

### Core Layers

#### **Clients** (`src/clients/`)
- **Purpose**: Low-level HTTP communication with the API
- **Why**: Encapsulates all API endpoint URLs and HTTP methods in one place
- **Benefit**: Easy to update API endpoints without touching test code; reusable across services

#### **Services** (`src/services/`)
- **Purpose**: Business logic layer that processes responses and extracts meaningful data
- **Why**: Adds a semantic layer above raw HTTP calls; handles response parsing and error extraction
- **Benefit**: Tests work with clean, domain-specific objects rather than raw JSON; easier to maintain when APIs change

#### **DTOs** (`src/types/`)
- **Purpose**: TypeScript type definitions for request and response payloads
- **Why**: Enforces type safety across the entire codebase; acts as API contract documentation
- **Benefit**: Compile-time checking prevents invalid payloads; IDE autocomplete for all properties

#### **Schemas** (`src/schemas/`)
- **Purpose**: Runtime validation of API responses using Zod
- **Why**: While DTOs ensure type safety during development, schemas detect unexpected API behavior during execution
- **Benefit**: Early detection of breaking API changes; clear error messages when validation fails

#### **Fixtures** (`src/fixtures/`)
- **Purpose**: Pre-configured test setup and data factories
- **Why**: Reduces boilerplate in test files; centralizes common test setup
- **Benefit**: Tests are shorter and more readable; consistent test data across suites
- **Example**: Authentication fixtures that pre-login users for authenticated test scenarios

#### **Utilities** (`src/utils/`)
- **Purpose**: Helper functions and cross-cutting concerns
- **Why**: Centralizes environment loading, schema validation helpers, and other shared logic
- **Benefit**: DRY principle; single source of truth for shared functionality

### Why This Separation?

1. **Single Responsibility**: Each layer has one clear purpose
2. **Testability**: Easy to unit test services with mock HTTP responses
3. **Reusability**: Clients and services can be used across multiple test files
4. **Maintainability**: Changes to API structure only affect the client/schema layer
5. **Readability**: Tests focus on business logic, not HTTP plumbing

## Key Features

- **TypeScript Support**: Full TypeScript for type safety
- **Modular Architecture**: Separation of concerns with clients, services, and utilities
- **Schema Validation**: Zod schemas for request/response validation
- **Environment Management**: Configurable environments via dotenv
- **HTML Reporting**: Detailed HTML test reports with traces
- **API Testing**: Comprehensive API endpoint testing
- **Streamlined Response Assertions**: by combining Zod validation with toMatchObject, eliminating the need for multiple expect statements

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
   cp config/dev.env.example dev.env
   ```

2. **Edit `dev.env`** with your configuration:
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

## Future Improvements

As the test suite grows, the following enhancements will improve robustness, maintainability, and scalability:

### 1. Request/Response Logging

**Goal**: Include middleware to log structured JSON logs for debugging API flows.

**Benefits**:
- Detailed audit trail of all API interactions
- Easier debugging of failed tests
- Better visibility into timing and performance issues

**Implementation**: Interceptors in the HTTP client to capture and log all requests/responses with timestamps.

### 2. OpenAPI Contract Verification

**Goal**: Auto-generate schemas from OpenAPI or validate API spec vs actual responses.

**Benefits**:
- Automatic validation against API contract
- Early detection of breaking API changes
- Auto-generation of types from OpenAPI specs
- Ensures tests always align with API specification

**Implementation**: Integrate OpenAPI parser to generate Zod schemas; validate responses against contract during tests.

### 3. Data Builders

**Goal**: Abstract payload creation to reduce boilerplate and support randomized test data.

**Benefits**:
- Cleaner test code with fluent API for creating test data
- Reduced payload duplication across tests
- Support for randomized data generation for edge case testing

**Implementation**: Create builder class for `CreateBookPayload` with defaults and customization methods.

### 4. Retry & Backoff Logic for Flaky Endpoints

**Goal**: Handle transient failures with custom retry strategies.

**Benefits**:
- More reliable tests in production environments
- Configurable retry policies per endpoint
- Exponential backoff to avoid overwhelming failing services
- Reduces false negatives from temporary network issues

**Implementation**: Add retry wrapper in service layer with configurable backoff strategies (exponential, linear, etc.).

### 5. API Mocking Layer

**Goal**: Mock services for isolated testing or offline environments.

**Benefits**:
- Test without external API dependencies
- Faster test execution for isolated unit tests
- Offline development and testing capability

**Implementation**: Integrate Playwright's route interception or a dedicated mocking library like MSW (Mock Service Worker).

### 6. Test Tagging (smoke, regression, critical)

**Goal**: Run different test suites selectively in CI pipelines.

**Benefits**:
- Quick smoke tests in PR pipelines
- Selective regression testing for release candidates
- Critical path testing on every build

**Implementation**: Add custom tags to test cases; use Playwright's `@tag` feature and filter tests with `--grep` in CI.

### 7. Report Enhancements (Allure Reporting)

**Goal**: Integrate Allure reporting for richer dashboards.

**Benefits**:
- Beautiful, interactive test reports
- Trend analysis over time (pass/fail history)
- Defect tracking and categorization
- Team-friendly dashboards with historical data
- Better CI/CD integration for stakeholder visibility

**Implementation**: Install Allure adapter for Playwright; generate reports in CI pipelines alongside HTML reports.

---

These improvements will evolve the framework from a solid foundation to an enterprise-grade API testing solution with enhanced observability, reliability, and developer experience.

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright API Testing Guide](https://playwright.dev/docs/api-testing)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
