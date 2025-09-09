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

## Widget Integration

```html
<div id="ghl-booking" data-config="/configs/salon.json"></div>
<script src="/widget.js" async></script>
```

## Testing

```bash
npm test
```

Unit tests cover booking flow validation for all three verticals.

## Production Roadmap

**Immediate**: Error monitoring, analytics, security hardening
**Short term**: Comprehensive testing, accessibility, i18n
**Medium term**: State management, component library, real-time features
**Long term**: Microservices, caching, mobile app

---
