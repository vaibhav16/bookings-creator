# Widget Testing Guide

This guide explains how to test your embeddable booking widget that uses the simple script snippet:

```html
<div id="ghl-booking" data-config="/configs/salon.json"></div>
<script src="/widget.js" async></script>
```

## Prerequisites

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Install Testing Dependencies:**
   ```bash
   npm install playwright concurrently
   ```

## Testing Methods

### Method 1: Manual Testing (Recommended for Development)

#### Step 1: Start Both Servers
```bash
# Terminal 1: Start mock API server
npm run start

# Terminal 2: Start Nuxt development server  
npm run dev
```

#### Step 2: Test Widget Embedding
Open these test files in your browser:

1. **Basic Widget Test:**
   - Open: `http://localhost:3000/test-widget-salon.html`
   - Tests: Single salon widget embedding

2. **All Verticals Test:**
   - Open: `http://localhost:3000/test-widget-all-verticals.html`
   - Tests: Salon, Class, and Rental widgets

3. **External Website Simulation:**
   - Open: `http://localhost:3000/test-widget-external.html`
   - Tests: How widget appears on external sites

4. **Built-in Widget Demo:**
   - Open: `http://localhost:3000/widget-demo`
   - Tests: The existing widget demo page

#### Step 3: Test Direct Booking Pages
Test the SSR pages directly:

1. **Salon Booking:** `http://localhost:3000/booking/salon`
2. **Class Booking:** `http://localhost:3000/booking/class`
3. **Rental Booking:** `http://localhost:3000/booking/rental`

### Method 2: Automated Testing

#### Run All Tests
```bash
# Run unit tests + widget tests
npm run test:all

# Run only widget tests
npm run test:widget

# Run only unit tests
npm run test
```

#### Run Both Servers Together
```bash
# Start both servers in one command
npm run dev:full
```

## What to Test

### 1. Widget Embedding ✅
- [ ] Widget loads on page
- [ ] Iframe is created correctly
- [ ] Iframe points to correct booking URL
- [ ] Multiple widgets work on same page
- [ ] Different verticals load correctly

### 2. SSR Output ✅
- [ ] Booking pages load without errors
- [ ] Configuration is fetched correctly
- [ ] Theme is applied properly
- [ ] Loading states work
- [ ] Error states work

### 3. Hydration & Interactions ✅
- [ ] Interactive elements work after load
- [ ] Service selection works (salon)
- [ ] Provider selection works (salon)
- [ ] Time slot selection works (salon)
- [ ] Class selection works (class)
- [ ] Session selection works (class)
- [ ] Date selection works (rental)
- [ ] Item selection works (rental)

### 4. API Integration ✅
- [ ] Config API responds correctly
- [ ] Availability API works
- [ ] Sessions API works (class)
- [ ] Inventory API works (rental)
- [ ] Booking API works
- [ ] Error handling works

### 5. Cross-Browser Testing ✅
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Test Scenarios

### Scenario 1: Basic Widget Loading
```html
<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body>
    <div id="ghl-booking" data-config="/configs/salon.json"></div>
    <script src="/widget.js" async></script>
</body>
</html>
```

**Expected Result:**
- Widget loads and creates iframe
- Iframe src points to `/booking/salon`
- Iframe is 600px tall with no border

### Scenario 2: Multiple Widgets
```html
<div id="ghl-booking-1" data-config="/configs/salon.json"></div>
<div id="ghl-booking-2" data-config="/configs/class.json"></div>
<script src="/widget.js" async></script>
```

**Expected Result:**
- Both widgets load independently
- Each creates its own iframe
- Correct URLs for each vertical

### Scenario 3: Error Handling
```html
<div id="ghl-booking" data-config="/configs/invalid.json"></div>
<script src="/widget.js" async></script>
```

**Expected Result:**
- Widget handles missing config gracefully
- No JavaScript errors

## Troubleshooting

### Widget Not Loading
1. Check browser console for errors
2. Verify both servers are running
3. Check network tab for failed requests
4. Ensure widget.js is accessible at `/widget.js`

### Iframe Not Created
1. Check that `data-config` attribute is present
2. Verify config file exists and is valid JSON
3. Check browser console for JavaScript errors

### Booking Flow Not Working
1. Check if iframe loads the correct URL
2. Verify API endpoints are responding
3. Check browser console for API errors
4. Test direct booking page access

### Styling Issues
1. Check if Tailwind CSS is loading
2. Verify theme variables are applied
3. Check iframe styling in widget.js

## Performance Testing

### Load Time Testing
- Widget should load within 2 seconds
- Iframe should appear within 1 second of widget load
- Booking page should be interactive within 3 seconds

### Memory Testing
- Multiple widgets shouldn't cause memory leaks
- Page should remain responsive with multiple widgets

## Security Testing

### XSS Prevention
- Widget should not execute arbitrary JavaScript
- Iframe should be properly sandboxed

### CORS Testing
- Widget should work on external domains
- API calls should handle CORS properly

## Browser Compatibility

Test on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Mobile Testing

Test on:
- iOS Safari
- Android Chrome
- Responsive design on various screen sizes

## Debugging Tips

1. **Enable Console Logging:**
   ```javascript
   // Add to widget.js for debugging
   console.log('Widget loading...', container);
   ```

2. **Check Network Requests:**
   - Open DevTools → Network tab
   - Look for failed requests to `/api/*` endpoints

3. **Inspect Iframe:**
   - Right-click on iframe → Inspect
   - Check iframe src attribute

4. **Test API Directly:**
   ```bash
   curl http://localhost:5050/api/config?vertical=salon
   ```

## Test Results

After running tests, check:
- `widget-test-results.json` - Automated test results
- Browser console - Manual test observations
- Network tab - API request/response logs

## Continuous Integration

For CI/CD, add these commands:
```yaml
- name: Install dependencies
  run: npm install

- name: Install Playwright
  run: npx playwright install

- name: Start servers
  run: npm run dev:full &
  
- name: Wait for servers
  run: sleep 10

- name: Run tests
  run: npm run test:all
```
