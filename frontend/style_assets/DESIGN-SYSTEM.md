# SpeakQuest Design System

## Quick Reference Guide

A children's speech therapy app with **dual-mode interface**:
- **Kids Mode**: Bright, colorful, playful
- **Therapist Mode**: Professional, data-focused, cool blue/gray

---

## 🎨 Color Palette

### Kids Mode - Primary Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Mint Green** | `#5EE7B5` → `#3CD5A0` | Practice, success, primary CTAs |
| **Soft Yellow** | `#FFE66D` → `#FFF59D` | Rewards, highlights, accents |
| **Coral Pink** | `#FF6B9D` → `#F57E84` | Games, secondary actions |
| **Light Blue** | `#74C9FF` → `#3FA9F5` | Progress, info |

### Therapist Mode - Professional Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Professional Blue** | `#3FA9F5` → `#2563EB` | Primary actions, data viz |
| **Cool Gray** | `#F3F4F6` → `#6B7280` | Backgrounds, text |
| **Accent Blue** | `#60A5FA` | Links, interactive elements |

### Gradients (Kids Mode)

```css
/* Mint - Primary CTAs */
background: linear-gradient(135deg, #5EE7B5 0%, #3CD5A0 100%);

/* Blue - Secondary CTAs */
background: linear-gradient(135deg, #74C9FF 0%, #3FA9F5 100%);

/* Coral - Games & Rewards */
background: linear-gradient(135deg, #FFA6A9 0%, #F57E84 100%);

/* Yellow Mix - Fun backgrounds */
background: linear-gradient(135deg, #5EE7B5 0%, #FFF59D 100%);
```

### Semantic Colors

| Purpose | Color |
|---------|-------|
| Success | `#10B981` |
| Warning | `#F59E0B` |
| Error | `#EF4444` |
| Info | `#3B82F6` |

---

## 📝 Typography

### Font Families
- **Primary**: Poppins, Nunito (clean sans-serif)
- **Fallback**: `system-ui, -apple-system, sans-serif`

### Font Sizes
**⚠️ Important**: Use semantic HTML elements (h1, h2, h3, p) instead of Tailwind text classes

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| `<h1>` | 1.5rem (24px) | 500 | 1.5 |
| `<h2>` | 1.25rem (20px) | 500 | 1.5 |
| `<h3>` | 1.125rem (18px) | 500 | 1.5 |
| `<p>` | 1rem (16px) | 400 | 1.5 |
| `<button>` | 1rem (16px) | 500 | 1.5 |

### Font Weights
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Custom Sizes (when needed)
```css
font-size: 19px;        /* Kids mode large buttons */
font-weight: 700;       /* Kids mode emphasis */
text-shadow: 0 1px 2px rgba(0,0,0,0.1);  /* Gradient text readability */
```

---

## 📐 Spacing

### Base Unit: 4px

| Class | Value | Usage |
|-------|-------|-------|
| `p-2` | 0.5rem (8px) | Small padding |
| `p-3` | 0.75rem (12px) | Compact elements |
| `p-4` | 1rem (16px) | Standard padding |
| `p-5` | 1.25rem (20px) | Medium cards |
| `p-6` | 1.5rem (24px) | Large cards |
| `p-8` | 2rem (32px) | Main containers |

### Gaps
```jsx
gap-1   // 0.25rem (4px)  - tight spacing
gap-2   // 0.5rem (8px)   - compact lists
gap-3   // 0.75rem (12px) - standard spacing
gap-4   // 1rem (16px)    - generous spacing
```

### Margins
```jsx
mb-2    // 0.5rem   - small spacing
mb-3    // 0.75rem  - compact sections
mb-4    // 1rem     - standard sections
mb-6    // 1.5rem   - large sections
mb-8    // 2rem     - major sections
```

---

## 🔲 Border Radius

| Class | Value | Usage |
|-------|-------|-------|
| `rounded-lg` | 0.75rem (12px) | Small buttons, badges |
| `rounded-xl` | 0.75rem (12px) | Standard buttons, inputs |
| `rounded-2xl` | 1rem (16px) | Cards, large buttons |
| `rounded-3xl` | 1.5rem (24px) | **Main containers** ⭐ |
| `rounded-full` | 9999px | Pills, icons, circles |

### Semantic Usage
- **Main Card Container**: `rounded-3xl` (24px)
- **Buttons**: `rounded-2xl` or `rounded-xl`
- **Small Cards/Sections**: `rounded-xl`
- **Icon Containers**: `rounded-lg` or `rounded-full`

---

## 🌑 Shadows

| Class | Usage |
|-------|-------|
| `shadow-lg` | Buttons, small cards |
| `shadow-xl` | **Main containers**, important cards ⭐ |
| `hover:shadow-xl` | Hover states for buttons |

```jsx
// Standard card
className="bg-white rounded-3xl p-8 shadow-xl"

// Button hover
className="shadow-lg hover:shadow-xl transition-all"
```

---

## ✨ Effects

### Blur (Decorative Backgrounds)
```jsx
// Decorative blob
<div className="absolute top-10 right-10 w-20 h-20 rounded-full 
                bg-yellow-200 opacity-30 blur-xl" />
```

### Opacity
- Decorative elements: `opacity-30` to `opacity-50`
- Icon backgrounds: `bg-white/30` or `bg-white/40`

### Text Shadow
```css
text-shadow: 0 1px 2px rgba(0,0,0,0.1);  /* Subtle - buttons */
text-shadow: 0 2px 4px rgba(0,0,0,0.1);  /* Medium - headings on gradients */
```

---

## 🎯 Component Sizing

### Icons
```jsx
w-4 h-4   // 16px - small icons, badges
w-5 h-5   // 20px - standard UI icons
w-6 h-6   // 24px - navigation icons
w-7 h-7   // 28px - prominent icons
w-10 h-10 // 40px - large icon containers
w-12 h-12 // 48px - hero icons
```

### Buttons
```jsx
// Kids Mode - Large
py-6 px-6  // 1.5rem vertical, 1.5rem horizontal

// Therapist Mode - Standard
py-3 px-4  // 0.75rem vertical, 1rem horizontal

// Small/Compact
py-2 px-4  // 0.5rem vertical, 1rem horizontal
```

### Illustrations
- Small: `150px × 150px`
- Medium: `180px × 180px`
- Large: `200px × 200px`

### Container Max Width
```jsx
max-w-md   // 28rem (448px)  - mobile cards
max-w-lg   // 32rem (512px)  - standard cards
max-w-2xl  // 42rem (672px)  - modals
```

---

## ⚡ Motion & Animation

### Transitions
```jsx
transition-all       // All properties
transition-colors    // Color changes only
transition-transform // Transform only
```

### Durations
| Duration | Milliseconds | Usage |
|----------|--------------|-------|
| Fast | 200ms | Quick color changes |
| Base | 300ms | **Standard transitions** ⭐ |
| Slow | 500ms | Progress bars, smooth animations |
| Slower | 800ms | Pulse effects |

### Scale Transforms
```jsx
hover:scale-[1.02]   // Subtle hover - cards, large buttons
hover:scale-105      // Medium hover - icons, small buttons
hover:scale-110      // Prominent hover - icon containers
```

### Motion Components (Framer Motion)
```jsx
import { motion } from 'motion/react';

// Pulse animation
<motion.button
  animate={{ scale: [1, 1.1, 1] }}
  transition={{ duration: 0.8, repeat: Infinity }}
>

// Fade in
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
>
```

---

## 🧩 Common Component Patterns

### Main Card Container
```jsx
<div className="bg-white rounded-3xl p-8 shadow-xl">
  {/* Content */}
</div>
```

### Kids Mode Button (Primary)
```jsx
<button
  className="w-full text-white rounded-2xl py-6 px-6 
             flex items-center justify-between 
             hover:shadow-xl transition-all transform hover:scale-[1.02] 
             shadow-lg"
  style={{ 
    background: 'linear-gradient(135deg, #5EE7B5 0%, #3CD5A0 100%)',
    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
  }}
>
  <div className="flex items-center gap-4">
    <div className="bg-white/30 p-3 rounded-xl">
      <Mic className="w-7 h-7" />
    </div>
    <span style={{ fontSize: '19px', fontWeight: 700 }}>Start Practice</span>
  </div>
  <span className="text-2xl">→</span>
</button>
```

### Therapist Mode Button (Primary)
```jsx
<button 
  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 
             text-white rounded-xl py-3 
             hover:shadow-lg transition-all" 
  style={{ fontWeight: 600 }}
>
  Schedule Session
</button>
```

### Progress Bar
```jsx
<div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
  <div
    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 
               rounded-full transition-all duration-500"
    style={{ width: `${progress}%` }}
  />
</div>
```

### Gradient Background Section
```jsx
<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
  {/* Content */}
</div>
```

### Icon Container
```jsx
<div className="bg-white/30 p-3 rounded-xl">
  <Mic className="w-7 h-7" />
</div>

// Or with solid background
<div className="w-10 h-10 rounded-lg bg-blue-100 
                flex items-center justify-center">
  <span className="text-blue-600" style={{ fontWeight: 700 }}>R</span>
</div>
```

### Decorative Dots
```jsx
<div className="flex justify-center gap-2">
  <div className="w-3 h-3 rounded-full bg-pink-300 opacity-50" />
  <div className="w-3 h-3 rounded-full bg-yellow-300 opacity-50" />
  <div className="w-3 h-3 rounded-full bg-blue-300 opacity-50" />
</div>
```

### Decorative Background Blur
```jsx
<div className="relative overflow-hidden">
  {/* Background elements */}
  <div className="absolute top-10 right-10 w-20 h-20 
                  rounded-full bg-yellow-200 opacity-30 blur-xl" />
  <div className="absolute bottom-20 left-10 w-32 h-32 
                  rounded-full bg-pink-200 opacity-30 blur-xl" />
  
  {/* Content with relative z-10 */}
  <div className="relative z-10">
    {/* Actual content */}
  </div>
</div>
```

### Navigation Header
```jsx
<div className="flex items-center justify-between mb-6">
  <button
    onClick={onBack}
    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
  >
    <ArrowLeft className="w-6 h-6 text-gray-600" />
  </button>
  <h1 className="text-2xl text-gray-800" style={{ fontWeight: 600 }}>
    Title
  </h1>
  <div className="w-10" /> {/* Spacer for centering */}
</div>
```

---

## 🎯 Mode-Specific Guidelines

### Kids Mode
✅ **Do:**
- Use vibrant gradients
- Include playful illustrations (SVG)
- Large touch targets (min 44px)
- Emoji and encouraging language
- Rounded corners (minimum 1rem)
- High contrast colors
- Decorative elements (dots, blurred backgrounds)

❌ **Don't:**
- Use small text (minimum 16px)
- Overcomplicate navigation
- Use subtle colors or gray text
- Include technical jargon

### Therapist Mode
✅ **Do:**
- Use professional blue gradients
- Include data visualization
- Gray backgrounds for sections (`bg-gray-50`)
- Clear hierarchies with spacing
- Compact, efficient layouts
- Professional terminology

❌ **Don't:**
- Use overly bright colors
- Include decorative elements like emoji
- Use playful language
- Overcrowd data displays

---

## 📏 Stroke & Borders

### SVG Strokes
```jsx
stroke="#2D3748"      // Bold black outlines (Young Heroes style)
strokeWidth="2"       // Standard
strokeWidth="3"       // Thick/prominent
strokeLinecap="round" // Friendly rounded ends
```

### CSS Borders
```jsx
border-2 border-blue-200  // Secondary buttons
border border-gray-200    // Subtle dividers
```

---

## ♿ Accessibility

### Touch Targets
- Minimum: **44px × 44px** for all interactive elements
- Kids mode buttons: **Larger** (py-6 = 48px minimum)

### Contrast Ratios
- Minimum: **4.5:1** for normal text
- Large text: **3:1**
- White text on gradients: Always include `text-shadow: 0 1px 2px rgba(0,0,0,0.1)`

### Focus States
```jsx
className="p-2 hover:bg-gray-100 rounded-full transition-colors 
           focus:outline-none focus:ring-2 focus:ring-blue-500"
```

---

## 🛠️ Implementation Notes

### Tailwind CSS
- Using **Tailwind v4.0**
- Core tokens in `/styles/globals.css`
- Do NOT create `tailwind.config.js`

### Typography Rules ⚠️
**CRITICAL**: Do NOT use Tailwind classes for:
- `text-*` (font-size) - Use semantic HTML instead
- `font-*` (font-weight) - Use inline styles when needed
- `leading-*` (line-height) - Defaults are set

**Use this instead:**
```jsx
// ❌ Don't do this
<h1 className="text-4xl font-bold">Title</h1>

// ✅ Do this
<h1 className="text-gray-800">Title</h1>
// or with custom weight
<h1 className="text-gray-800" style={{ fontWeight: 600 }}>Title</h1>
```

### Inline Styles
Use inline styles for:
- Custom gradients
- Font weights (when different from defaults)
- Specific font sizes (e.g., 19px for kids buttons)
- Dynamic values (e.g., progress percentages)

```jsx
style={{ 
  background: 'linear-gradient(135deg, #5EE7B5 0%, #3CD5A0 100%)',
  fontWeight: 700,
  fontSize: '19px'
}}
```

---

## 📦 File Structure

```
/styles/globals.css          - Core CSS variables
/design-tokens.json          - Complete design system (this file)
/design-tokens.css           - CSS variables version
/DESIGN-SYSTEM.md           - Quick reference (you are here)
/components/*                - All React components
```

---

## 🎨 Tools & Resources

### Color Testing
- Use browser DevTools to test contrast ratios
- Kids mode: Ensure colors are vibrant and distinguishable
- Therapist mode: Maintain professional, calming palette

### Icons
- **lucide-react**: Primary icon library
- Sizes: 16px, 20px, 24px, 28px, 40px, 48px

### Fonts
- Import Poppins or Nunito from Google Fonts if needed
- System fallbacks work well for prototyping

---

## 📋 Checklist for New Components

- [ ] Main container uses `rounded-3xl p-8 shadow-xl`
- [ ] All interactive elements have `transition-all` or `transition-colors`
- [ ] Buttons have hover states with `scale-[1.02]`
- [ ] Icons are sized appropriately (w-5 h-5 minimum)
- [ ] Colors match the current mode (kids vs therapist)
- [ ] Touch targets are minimum 44px × 44px
- [ ] Text uses semantic HTML (h1, h2, p, button)
- [ ] Gradients use inline styles with `style={}` 
- [ ] Spacing uses 4px base unit (gap-2, p-4, mb-6)
- [ ] Border radius is generous (minimum 1rem for buttons/cards)

---

## 🚀 Quick Copy-Paste Snippets

### Kids Mode Card
```jsx
<div className="bg-white rounded-3xl p-8 shadow-xl">
  <h1 className="text-4xl mb-4 text-gray-800">SpeakQuest</h1>
  {/* Content */}
</div>
```

### Therapist Mode Card
```jsx
<div className="bg-white rounded-3xl p-8 shadow-xl">
  <h1 className="text-2xl text-gray-800" style={{ fontWeight: 600 }}>
    Dashboard
  </h1>
  {/* Content */}
</div>
```

### Gradient Button (Kids)
```jsx
<button
  className="w-full text-white rounded-2xl py-6 px-6 
             flex items-center justify-between 
             hover:shadow-xl transition-all transform hover:scale-[1.02] 
             shadow-lg"
  style={{ 
    background: 'linear-gradient(135deg, #5EE7B5 0%, #3CD5A0 100%)',
    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
  }}
>
  <span style={{ fontSize: '19px', fontWeight: 700 }}>Button Text</span>
</button>
```

### Section Header
```jsx
<div className="flex items-center gap-2 mb-4">
  <TrendingUp className="w-5 h-5 text-blue-600" />
  <h3 className="text-lg text-gray-800" style={{ fontWeight: 600 }}>
    Section Title
  </h3>
</div>
```

---

**Version**: 1.0  
**Last Updated**: November 2025  
**Maintained by**: SpeakQuest Design Team
