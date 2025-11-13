# Sentry Error Tracking

This application is configured with Sentry for production error tracking and monitoring.

## Setup

### 1. Create a Sentry Account

1. Go to [https://sentry.io](https://sentry.io) and create a free account
2. Create a new project and select "React" as the platform
3. Copy the DSN (Data Source Name) provided

### 2. Configure Environment Variables

Add the following to your `.env` file:

```env
# Required
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Optional
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_TRACES_SAMPLE_RATE=0.1
VITE_SENTRY_DEBUG=false
```

### Environment Variables

- **VITE_SENTRY_DSN** (required for production)
  - Your Sentry DSN from the project settings
  - Without this, Sentry will not be initialized

- **VITE_SENTRY_ENVIRONMENT** (default: "development")
  - Environment name shown in Sentry
  - Recommended values: "development", "staging", "production"

- **VITE_SENTRY_TRACES_SAMPLE_RATE** (default: 0.1)
  - Percentage of transactions to trace (0.0 to 1.0)
  - 0.1 = 10% of transactions
  - Higher values = more data, but higher quota usage

- **VITE_SENTRY_DEBUG** (default: false)
  - Enable Sentry events in development mode
  - By default, Sentry is disabled in development

## Features

### Error Boundary

The app is wrapped in a Sentry ErrorBoundary that:
- Catches all React errors
- Shows a friendly error page to users
- Automatically sends error reports to Sentry
- In development, shows error details for debugging

### User Context

User information is automatically tracked:
- User ID
- Email address
- Username
- Tracked on sign-in
- Cleared on sign-out

This helps identify which users are experiencing errors.

### Session Replay

Sentry captures session replays for:
- 10% of all sessions
- 100% of sessions with errors

Session replays help debug issues by showing exactly what the user did before the error occurred.

**Privacy:** All text is masked and media is blocked by default.

### Error Filtering

The following errors are ignored:
- Browser extension errors
- Network errors (Failed to fetch, Load failed)
- Known third-party errors

Sensitive data is automatically filtered:
- Cookies
- Authorization headers
- Password fields

## Manual Error Tracking

You can manually track errors and events:

```typescript
import { captureException, captureMessage, addBreadcrumb } from '@/lib/sentry';

// Capture an error
try {
  somethingRisky();
} catch (error) {
  captureException(error, { context: 'additional info' });
}

// Capture a message
captureMessage('User completed onboarding', 'info');

// Add breadcrumb for debugging
addBreadcrumb('User clicked checkout', {
  cart_total: 49.99
});
```

## Testing Sentry

### Test Error Boundary

Add this button temporarily to any component:

```typescript
<button onClick={() => { throw new Error('Test Sentry error!'); }}>
  Test Sentry
</button>
```

### Test Manual Capture

```typescript
import { captureMessage } from '@/lib/sentry';

captureMessage('Test message from app', 'info');
```

### Verify Setup

1. Set `VITE_SENTRY_DEBUG=true` in `.env`
2. Run the app in development
3. Trigger a test error
4. Check browser console for Sentry logs
5. Check Sentry dashboard for the error

## Monitoring

### Sentry Dashboard

Access your Sentry dashboard to:
- View all errors and their frequency
- See error trends over time
- Watch session replays
- Track performance metrics
- Set up alerts for critical errors

### Recommended Alerts

Set up alerts in Sentry for:
- New issues (first occurrence)
- Issue frequency spikes
- Performance degradation
- High error rates

## Performance Monitoring

Sentry also tracks:
- Page load times
- Component render times
- Network request performance
- Custom transactions

Adjust `VITE_SENTRY_TRACES_SAMPLE_RATE` to control how many transactions are tracked.

## Privacy Considerations

By default, the Sentry configuration:
- Masks all user input text
- Blocks all media (images, videos)
- Filters sensitive headers
- Does not capture passwords or tokens

Review the configuration in `src/lib/sentry.ts` to customize privacy settings.

## Troubleshooting

### Sentry not initializing

- Check that `VITE_SENTRY_DSN` is set in `.env`
- Verify the DSN is correct
- Check browser console for "[Sentry]" messages

### Events not appearing in Sentry

- Ensure you're in production mode or `VITE_SENTRY_DEBUG=true`
- Check Sentry quota limits
- Verify network is not blocking sentry.io

### Too many events

- Reduce `VITE_SENTRY_TRACES_SAMPLE_RATE`
- Add more errors to `ignoreErrors` array
- Set up rate limiting in Sentry dashboard

## Resources

- [Sentry React Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Error Boundary](https://docs.sentry.io/platforms/javascript/guides/react/components/errorboundary/)
- [Session Replay](https://docs.sentry.io/platforms/javascript/session-replay/)
- [Performance Monitoring](https://docs.sentry.io/platforms/javascript/performance/)
