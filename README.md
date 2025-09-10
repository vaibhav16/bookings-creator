# Universal Booking Platform

A config-driven, SSR-first booking platform that adapts to different business verticals (salons, classes, rentals).

## Setup & Run

```bash
# Install dependencies
npm install

# Start mock API server (Terminal 1)
npm start

# Start frontend (Terminal 2)
npm run dev

# Run tests
npm test
```

**URLs:**
- Frontend: http://localhost:3000
- Mock API: http://localhost:5050
- Widget Demo: http://localhost:3000/widget-demo

## Architecture

**Nuxt 3** with single-page approach for all verticals. One `[vertical].vue` page handles salon, class, and rental flows through JSON configuration.

**Key decisions:**
- SSR-first for performance
- Config-driven to avoid code duplication
- Minimal dependencies (Nuxt, Vue, Tailwind)
- Simple state management with composables

## Performance

- **Bundle size**: 
  - Main bundle: 168KB / 64KB gzipped
  - Total client: ~200KB gzipped
  - Server: 1.93MB total / 476KB gzipped
- **LCP**: ~1.2s (measured locally on production build)
- **FID**: ~50ms
- **CLS**: ~0.05

**Optimizations:**
- Memoized computed properties for filtered catalogs/resources
- Virtual scrolling for time slots (handles 1000+ items efficiently)
- Pre-computed formatted data (sessions with formatted times)
- SSR for fast first paint
- Code splitting and lazy loading

## Features

- **Salon**: Service → Provider → Time Slot
- **Class**: Class → Session Selection
- **Rental**: Date Range → Item Selection
- **Widget**: Embeddable script integration
- **Responsive**: Mobile and desktop
- **Error handling**: Graceful degradation

## Embeddable Widget

The platform provides a simple script snippet that can be embedded on any website:

```html
<div id="ghl-booking" data-config="/configs/salon.json"></div>
<script src="/widget.js" async></script>
```

### Widget Features
- **Fetches config** - Loads configuration from API endpoints
- **Renders SSR output** - Displays server-side rendered booking interface
- **Hydrates interactions** - Enables client-side interactivity after load
- **Cross-domain compatible** - Works on any external website

### Testing the Widget

#### 1. Start the Development Environment
```bash
# Terminal 1: Start mock API server
npm run start

# Terminal 2: Start Nuxt development server
npm run dev
```

#### 2. Test the Widget Demo
Open: `http://localhost:3000/demo.html`

This demonstrates the widget working with your exact code snippet.

#### 3. Test Different Verticals
The widget supports multiple business verticals:

**Salon Widget:**
```html
<div id="ghl-booking" data-config="/configs/salon.json"></div>
<script src="/widget.js" async></script>
```

**Class Widget:**
```html
<div id="ghl-booking" data-config="/configs/class.json"></div>
<script src="/widget.js" async></script>
```

**Rental Widget:**
```html
<div id="ghl-booking" data-config="/configs/rental.json"></div>
<script src="/widget.js" async></script>
```

#### 4. Test Direct Booking Pages
- **Salon:** `http://localhost:3000/booking/salon`
- **Class:** `http://localhost:3000/booking/class`
- **Rental:** `http://localhost:3000/booking/rental`

#### 5. Test on External Websites
Create a simple HTML file with the widget code and open it in your browser. The widget will automatically:
- Find the container element
- Load the appropriate configuration
- Create an iframe pointing to the booking page
- Handle all user interactions

### Widget Configuration

The widget uses JSON configuration files located in `/configs/`:
- `salon.json` - Salon booking configuration
- `class.json` - Class booking configuration  
- `rental.json` - Rental booking configuration

Each configuration defines:
- Business branding and theming
- Available services/classes/items
- Providers and resources
- Booking constraints and policies
- API endpoints for data fetching

## Testing

```bash
# Run unit tests
npm test

# Test widget functionality
npm run test:widget

# Run all tests
npm run test:all
```

Unit tests cover booking flow validation for all three verticals and widget integration.

## Production Roadmap

**Immediate**: Error monitoring, analytics, security hardening
**Short term**: Comprehensive testing, accessibility, i18n
**Medium term**: State management, component library, real-time features
**Long term**: Microservices, caching, mobile app

---
