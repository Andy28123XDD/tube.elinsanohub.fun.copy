# API Reference

This section contains the API documentation for our project.

## Core APIs

### `createWidget(options)`

Creates a new widget with the specified options.

```ts
interface WidgetOptions {
  name: string;
  type: 'basic' | 'advanced';
}

function createWidget(options: WidgetOptions): Widget;
```