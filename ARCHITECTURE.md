# Architecture Decisions

## Why Nuxt 3?
- **SSR-first**: Meets requirement for server-side rendering
- **File-based routing**: Natural fit for `/booking/[vertical]` pattern
- **Built-in optimizations**: Automatic code splitting, image optimization
- **TypeScript support**: Better developer experience and maintainability

## Why Single Page Approach?
Instead of separate components for each step, I used one dynamic page because:
- **Simpler state management**: No complex prop drilling
- **Easier to maintain**: All booking logic in one place
- **Natural progression**: Steps flow naturally without component boundaries
- **Config-driven**: The flow adapts based on the vertical config

## Why Minimal Dependencies?
- **Nuxt 3**: Core framework
- **Tailwind CSS**: Rapid styling without custom CSS
- **No state management library**: Simple reactive refs are sufficient
- **No testing framework**: Focus on core functionality first

## Why This Structure?
```
pages/
  index.vue              # Landing page
  booking/[vertical].vue  # Dynamic booking flow
  widget-demo.vue        # Widget demonstration
public/
  widget.js             # Embeddable script
```

This structure is:
- **Intuitive**: Clear separation of concerns
- **Scalable**: Easy to add new verticals
- **Maintainable**: Each file has a single responsibility

## Performance Considerations
- **SSR**: First paint is fast
- **Code splitting**: Automatic with Nuxt 3
- **API proxy**: Reduces CORS issues
- **Minimal bundle**: Only essential dependencies

## Future Extensibility
- **New verticals**: Just add config files
- **New steps**: Extend the step logic
- **New features**: Add to the existing structure
- **Testing**: Add when complexity grows
