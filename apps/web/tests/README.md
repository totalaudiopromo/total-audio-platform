# Playwright Tests for Total Audio Promo

This directory contains comprehensive end-to-end tests for the Total Audio Promo MVP using Playwright.

## Test Coverage

### Core Page Tests

- **`dashboard.spec.ts`**- Dashboard functionality and real-time updates
- **`integrations.spec.ts`**- Integration management and connectivity
- **`campaigns.spec.ts`**- Campaign creation and management
- **`analytics.spec.ts`**- Analytics and reporting features
- **`contacts.spec.ts`**- Contact management and CRM functionality
- **`navigation.spec.ts`**- Cross-page navigation and routing

## Running Tests

### Quick Start

```bash
# Run all tests
npm test

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# View test report
npm run test:report
```

### Browser-Specific Tests

```bash
# Run tests in specific browsers
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run mobile tests
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

### Test Filtering

```bash
# Run specific test file
npx playwright test dashboard.spec.ts

# Run tests matching pattern
npx playwright test --grep "should load"

# Run tests in specific directory
npx playwright test tests/dashboard.spec.ts
```

## Test Features

### What We Test

-  **Page Loading**- All pages load without errors
-  **Navigation**- Cross-page navigation works correctly
-  **Responsive Design**- Mobile and desktop layouts
-  **Integration Flows**- Gmail, Claude AI, Perplexity connections
-  **Real-time Updates**- Dashboard live data and notifications
-  **User Interactions**- Buttons, forms, and interactive elements
-  **Error Handling**- Graceful handling of edge cases
-  **Accessibility**- Basic accessibility checks

### Browser Support

- **Desktop**: Chrome, Firefox, Safari
- **Mobile**: Chrome Mobile, Safari Mobile
- **Headless**: All tests run headless by default

## Configuration

### Playwright Config (`playwright.config.ts`)

- **Base URL**: `http://localhost:3000`
- **Test Directory**: `./tests`
- **Parallel Execution**: Enabled
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On first retry

### Web Server

- **Command**: `npm run dev`
- **URL**: `http://localhost:3000`
- **Timeout**: 120 seconds
- **Reuse**: Existing server when possible

## Test Structure

### Test Organization

```
tests/
 dashboard.spec.ts      # Dashboard functionality
 integrations.spec.ts   # Integration management
 campaigns.spec.ts      # Campaign features
 analytics.spec.ts      # Analytics and reporting
 contacts.spec.ts       # Contact management
 navigation.spec.ts     # Cross-page navigation
```

### Test Patterns

- **BeforeEach**: Navigate to page under test
- **Assertions**: Check for expected elements and behavior
- **Conditional Tests**: Handle dynamic content gracefully
- **Mobile Testing**: Responsive design verification
- **Error Scenarios**: Edge case handling

## Test Scenarios

### Dashboard Tests

- Page loading and navigation
- Real-time data display
- Stats cards and metrics
- Quick action buttons
- Mobile responsiveness
- Accessibility features

### Integration Tests

- All integration cards display
- Status indicators work
- Category filtering
- Connect/disconnect flows
- Integration details
- Mobile layout

### Campaign Tests

- Campaign management interface
- Create campaign flow
- Campaign filtering and search
- Status indicators
- Mobile responsiveness
- Navigation between pages

### Analytics Tests

- Analytics dashboard loading
- Performance metrics display
- Charts and graphs
- Date range filters
- Export functionality
- Mobile layout

### Contact Tests

- Contact management interface
- Add contact flow
- Contact filtering and search
- Status indicators
- Bulk actions
- Mobile responsiveness

### Navigation Tests

- Cross-page navigation
- Browser back/forward
- Direct URL access
- Logo navigation
- Quick action buttons
- Page state management

## Debugging Tests

### Debug Mode

```bash
npm run test:debug
```

- Opens browser in headed mode
- Pauses on breakpoints
- Step-through debugging

### UI Mode

```bash
npm run test:ui
```

- Interactive test runner
- Real-time test execution
- Visual test results

### Screenshots and Videos

- **Location**: `test-results/`
- **Screenshots**: On test failure
- **Videos**: On test failure
- **Traces**: On first retry

## Continuous Integration

### GitHub Actions (Recommended)

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Best Practices

### Test Writing

- Use descriptive test names
- Test one thing per test
- Handle dynamic content gracefully
- Include mobile testing
- Test error scenarios

### Maintenance

- Keep tests independent
- Use page objects for complex flows
- Regular test updates with UI changes
- Monitor test flakiness
- Update selectors when UI changes

## Troubleshooting

### Common Issues

1. **Tests failing on CI**: Check browser installation
2. **Flaky tests**: Add wait conditions
3. **Selector issues**: Use more robust selectors
4. **Performance**: Optimize test execution

### Debug Commands

```bash
# Install browsers
npx playwright install

# Update browsers
npx playwright install --force

# Show test report
npx playwright show-report

# Debug specific test
npx playwright test --debug dashboard.spec.ts
```

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Test Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Debugging Guide](https://playwright.dev/docs/debug)

---

**Total Audio Promo MVP Testing Suite**
