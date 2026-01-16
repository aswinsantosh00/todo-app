# TO-DO Application

A modern, accessible to-do web application built with React, featuring a bold Neubrutalist UI design.

## Features

- ✅ Add, edit, delete, and complete tasks
- 🎯 Filter tasks by All / Active / Completed
- 💾 Persistent storage using localStorage
- ⌨️ Full keyboard navigation support
- ♿ WCAG AA accessibility compliant
- 📱 Mobile-first responsive design
- 🎨 Neubrutalist UI with bold colors and strong shadows

## Tech Stack

- **React** - Functional components with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **localStorage** - Client-side persistence

## Design Principles

### Neubrutalist Style
- High-contrast, bold colors
- Thick borders (3-4px)
- Sharp corners (minimal border-radius)
- Strong offset shadows (no blur)
- Large, expressive typography
- Clear visual hierarchy

### Accessibility
- Semantic HTML elements
- WCAG AA color contrast
- Visible focus states
- Screen-reader friendly ARIA labels
- Keyboard navigation support

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── TaskInput.jsx      # Add new tasks
│   ├── TaskList.jsx       # Display task list
│   └── FilterButtons.jsx  # Filter controls
├── App.jsx                # Main app component
├── main.jsx              # Entry point
└── index.css             # Tailwind directives
```

## Component Overview

### TaskInput
- Accepts user input for new tasks
- Keyboard-friendly form submission
- Clear button press feedback

### TaskList
- Displays filtered tasks
- Empty state message
- Individual task items with edit/delete actions

### FilterButtons
- Toggle between All/Active/Completed views
- Shows active task count
- Visual feedback for selected filter

## Keyboard Shortcuts

- `Enter` - Submit new task / Save edit
- `Escape` - Cancel edit
- `Tab` - Navigate between elements
- `Space` - Toggle checkboxes and buttons

## Browser Support

Modern browsers with ES6+ support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT
