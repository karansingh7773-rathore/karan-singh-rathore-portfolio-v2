# Animation Implementation Reference

This file contains specific animation implementations you can copy to your portfolio.

## 🎨 Background Animations

### 1. Animated Mesh Gradient (CSS Only)
```css
/* Add to globals.css */
@keyframes mesh-animation {
  0%, 100% {
    background-position: 0% 0%, 100% 100%, 50% 50%;
  }
  50% {
    background-position: 100% 100%, 0% 0%, 25% 75%;
  }
}

.mesh-gradient {
  background: 
    radial-gradient(at 0% 0%, hsla(253, 100%, 75%, 1) 0px, transparent 50%),
    radial-gradient(at 100% 100%, hsla(200, 100%, 75%, 1) 0px, transparent 50%),
    radial-gradient(at 50% 50%, hsla(150, 100%, 75%, 1) 0px, transparent 50%);
  background-size: 200% 200%;
  animation: mesh-animation 10s ease infinite;
}
```

### 2. Particle Background (Canvas)
```jsx
// components/background/ParticleBackground.tsx
'use client';

import { useEffect, useRef } from 'react';

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{x: number; y: number; vx: number; vy: number}> = [];
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
}
```

## ✨ Text Animations

### 1. Typewriter Effect
```jsx
// components/animations/TypeWriter.tsx
'use client';

import { TypeAnimation } from 'react-type-animation';

export function TypeWriter() {
  return (
    <TypeAnimation
      sequence={[
        'I am a Developer',
        2000,
        'I am a Designer',
        2000,
        'I am a Creator',
        2000,
      ]}
      wrapper="span"
      speed={50}
      repeat={Infinity}
      className="text-4xl font-bold"
    />
  );
}
```

### 2. Text Reveal on Scroll
```jsx
// components/animations/TextReveal.tsx
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export function TextReveal({ children }: { children: React.ReactNode }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
```

### 3. Staggered Word Animation
```jsx
// components/animations/StaggerWords.tsx
'use client';

import { motion } from 'framer-motion';

export function StaggerWords({ text }: { text: string }) {
  const words = text.split(' ');
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } }
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
```

## 📜 Scroll Animations

### 1. Parallax Section
```jsx
// components/animations/ParallaxSection.tsx
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function ParallaxSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  
  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}
```

### 2. Scroll Progress Indicator
```jsx
// components/animations/ScrollProgress.tsx
'use client';

import { motion, useScroll } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
```

### 3. Fade In on Scroll
```jsx
// components/animations/FadeInScroll.tsx
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export function FadeInScroll({ 
  children,
  delay = 0 
}: { 
  children: React.ReactNode;
  delay?: number;
}) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}
```

## 🌓 Dark Mode Implementation

### 1. Theme Provider Setup
```jsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Theme Toggle Component
```jsx
// components/ThemeToggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800"
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  );
}
```

## 🎯 Complete Page Example

```jsx
// app/page.tsx
'use client';

import { ParticleBackground } from '@/components/background/ParticleBackground';
import { TypeWriter } from '@/components/animations/TypeWriter';
import { FadeInScroll } from '@/components/animations/FadeInScroll';
import { ScrollProgress } from '@/components/animations/ScrollProgress';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <ParticleBackground />
      
      <main className="relative min-h-screen">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <section className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4">
              <TypeWriter />
            </h1>
          </div>
        </section>
        
        <FadeInScroll>
          <section className="py-20 px-4">
            <h2 className="text-4xl font-bold text-center">About Me</h2>
            <p className="mt-4 text-center max-w-2xl mx-auto">
              Content here...
            </p>
          </section>
        </FadeInScroll>
      </main>
    </>
  );
}
```

## 📦 Required Package.json Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "framer-motion": "^11.0.0",
    "next-themes": "^0.2.1",
    "react-intersection-observer": "^9.5.0",
    "react-type-animation": "^3.2.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "@types/react": "^18.0.0"
  }
}
```

## Installation Command

```bash
npm install framer-motion next-themes react-intersection-observer react-type-animation
```
