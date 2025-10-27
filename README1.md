# Pointer Landing Template

A modern landing page template with smooth animations, dark mode support, and responsive design.

## Features

### 🎨 Animations Implemented

#### 1. **Background Animations**
- **Gradient Animation**: Smooth moving gradient backgrounds
- **Particle Effects**: Animated particle systems (canvas/WebGL)
- **Mesh Gradients**: Animated mesh/blob backgrounds
- **Libraries Used**: 
  - `framer-motion` - For React animations
  - `@react-three/fiber` - For 3D backgrounds
  - CSS `@keyframes` - For pure CSS animations

#### 2. **Text Animations**
- **Fade In**: Elements fade in on page load
- **Slide In**: Text slides from different directions
- **Type Writer Effect**: Text appears character by character
- **Stagger Animation**: Multiple elements animate in sequence
- **Text Reveal**: Text reveals with mask/clip-path
- **Libraries Used**:
  - `framer-motion` - For declarative animations
  - `react-type-animation` - For typewriter effects
  - `gsap` - For advanced scroll-triggered animations

#### 3. **Scroll Animations**
- **Parallax Scrolling**: Elements move at different speeds
- **Scroll Triggered Animations**: Elements animate when scrolled into view
- **Progress Indicators**: Animated scroll progress bars
- **Sticky Elements**: Headers/sidebars that stick on scroll
- **Libraries Used**:
  - `framer-motion` - `useScroll`, `useTransform` hooks
  - `react-intersection-observer` - Detect when elements enter viewport
  - `gsap/ScrollTrigger` - Advanced scroll animations

#### 4. **Dark Mode**
- Theme switching with CSS variables
- Smooth transitions between themes
- System preference detection
- Persistent theme selection
- **Implementation**: 
  - `next-themes` - Theme management
  - CSS custom properties (`:root` and `.dark`)
  - Tailwind CSS dark mode (`dark:` prefix)

## Tech Stack

- **Framework**: Next.js 14+
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, GSAP
- **Theme**: next-themes
- **UI Components**: Radix UI (shadcn/ui)

## Animation Code Examples

### Background Gradient Animation (CSS)
```css
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animated-gradient {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}
```

### Text Fade In (Framer Motion)
```jsx
import { motion } from 'framer-motion';

<motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  Hello World
</motion.h1>
```

### Scroll Animation (Framer Motion)
```jsx
import { motion, useScroll, useTransform } from 'framer-motion';

const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

<motion.div style={{ y }}>
  Parallax Content
</motion.div>
```

### Stagger Children Animation
```jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.div variants={container} initial="hidden" animate="show">
  <motion.div variants={item}>Item 1</motion.div>
  <motion.div variants={item}>Item 2</motion.div>
  <motion.div variants={item}>Item 3</motion.div>
</motion.div>
```

## Installation & Setup

```bash
# Install dependencies
npm install

# Required animation libraries
npm install framer-motion
npm install next-themes
npm install react-intersection-observer

# Optional advanced animations
npm install gsap
npm install @react-three/fiber @react-three/drei three
npm install react-type-animation
```

## Project Structure

```
d:\pointer-landing-template\
├── components/
│   ├── ui/              # Reusable UI components
│   ├── animations/      # Animation wrapper components
│   ├── background/      # Animated background components
│   └── theme-toggle.tsx # Dark mode toggle
├── app/
│   ├── layout.tsx       # Root layout with theme provider
│   └── page.tsx         # Main landing page
├── styles/
│   └── globals.css      # Global styles & CSS variables
├── lib/
│   └── utils.ts         # Utility functions
└── public/              # Static assets
```

## CSS Variables for Theming

The project uses HSL color values in CSS variables for easy theming:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  /* ...more variables */
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  /* ...more variables */
}
```

## Common Animation Patterns

### 1. Hover Scale Effect
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click Me
</motion.button>
```

### 2. Page Transition
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5 }}
>
  Page Content
</motion.div>
```

### 3. Scroll Progress Bar
```jsx
const { scrollYProgress } = useScroll();

<motion.div
  style={{
    scaleX: scrollYProgress,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: 'blue',
    transformOrigin: '0%'
  }}
/>
```

## Performance Tips

1. Use `will-change` CSS property sparingly
2. Prefer `transform` and `opacity` for animations (GPU accelerated)
3. Use `IntersectionObserver` to only animate visible elements
4. Debounce scroll event listeners
5. Use `useReducedMotion` for accessibility

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid & Flexbox
- CSS Custom Properties
- ES6+ JavaScript

## License

MIT

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [GSAP Docs](https://greensock.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Next.js Docs](https://nextjs.org/docs)
