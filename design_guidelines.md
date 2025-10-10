# CreativeStudio Platform - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern digital agencies like Tars.pro, Dojo Media, and contemporary interactive studios (Awwwards-featured agencies). The design prioritizes visual impact, interactivity, and emotional engagement typical of agency portfolios.

## Core Design Principles
1. **Bold Minimalism**: Clean layouts with strategic use of vibrant colors and 3D elements
2. **Interactive Depth**: 3D objects and animations create engagement without overwhelming
3. **Directional Color Coding**: Each service direction has distinct visual identity
4. **Progressive Disclosure**: Content reveals purposefully as users scroll

## Color Palette

**Primary Brand Colors:**
- Red Gradient: 0 85% 60% → 15 90% 55% (primary brand identity)
- Deep Black: 0 0% 8% (backgrounds, text)
- Pure White: 0 0% 98% (text on dark, cards)

**Directional Colors:**
- Digital/Brandformance: 0 85% 60% (vibrant red)
- Communication: 280 70% 65% (rich purple)
- Research: 0 0% 15% (charcoal black)
- Tech: 210 80% 55% (electric blue)

**Neutrals:**
- Background Dark: 0 0% 8%
- Surface Dark: 0 0% 12%
- Border Subtle: 0 0% 20%
- Text Secondary: 0 0% 60%

## Typography

**Font Families:**
- Primary: 'Inter' (CDN: Google Fonts) - headings, UI
- Secondary: 'Space Grotesk' (CDN: Google Fonts) - accent text, numbers

**Type Scale:**
- Hero H1: text-6xl md:text-7xl lg:text-8xl font-bold
- Section H2: text-4xl md:text-5xl lg:text-6xl font-bold
- Card H3: text-2xl md:text-3xl font-semibold
- Body: text-base md:text-lg
- Small: text-sm

## Layout System

**Spacing Primitives:** Tailwind units of 4, 8, 12, 16, 20, 24, 32 (e.g., p-8, mb-16, gap-12)

**Containers:**
- Full-width sections: w-full with inner max-w-7xl mx-auto px-6
- Content sections: max-w-6xl mx-auto px-4
- Narrow content: max-w-4xl mx-auto

**Section Padding:**
- Desktop: py-24 to py-32
- Mobile: py-16 to py-20

**Grid Systems:**
- Service Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Cases: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Blog: grid-cols-1 md:grid-cols-3

## Component Library

**Hero Section:**
- Full viewport height (min-h-screen)
- 3D interactive background (Three.js sphere/geometric shape)
- Centered content with gradient text effect on main heading
- Dual CTA buttons: Primary filled (red gradient) + Secondary outline (white, blurred bg)

**Service Direction Cards:**
- Large cards with hover elevation effect
- Color-coded left border (8px) matching direction
- Icon + Direction name + Subtitle + Services list
- Clickable with smooth transition to detail pages
- Background: gradient overlay on card color

**KPI Counter Section:**
- 4 columns on desktop, 2x2 on tablet, stack on mobile
- Large animated numbers (text-5xl to text-6xl)
- Icons from Heroicons (outline variant)
- Count-up animation on scroll into view

**Case Study Slider:**
- Horizontal scroll/carousel using embla-carousel or swiper
- Large image cards (16:9 ratio)
- Overlay with project name + brief result
- Smooth parallax effect

**Testimonial Carousel:**
- Auto-rotating cards with fade transitions
- Client photo (circular, 80px), name, company, quote
- Navigation dots below

**Blog Cards:**
- Featured image (16:9)
- Category badge, date, title, excerpt
- Read more link with arrow icon

**Forms:**
- Floating labels
- Input fields: dark background (bg-neutral-900), white text, red focus ring
- Submit button: red gradient with white text
- reCAPTCHA integration

**Footer:**
- Dark background (bg-black/95)
- 4-column grid: Logo/About, Services, Quick Links, Contact
- Social icons from Font Awesome
- Language switcher: pill-style buttons (RU/KZ/EN)

## Images

**Hero Section:**
- 3D WebGL background (no static image - programmatic 3D object)

**Service Direction Pages:**
- Hero: abstract/geometric background image representing each direction
- Case study thumbnails throughout

**Case Studies:**
- Featured image (1920x1080)
- Multiple screenshots/mockups within case study detail pages
- Before/after comparisons where applicable

**Blog:**
- Article cover images (1200x675)

**Testimonials:**
- Client headshots (circular, 160x160 minimum)

## Animations

**Strategic Use Only:**
- Hero: 3D object mouse tracking (subtle parallax)
- KPI counters: count-up animation on scroll into view
- Cards: hover elevation (translateY -4px, shadow increase)
- Page transitions: smooth fade-in on route change
- Scroll reveals: sections fade-in and slide-up (50px offset)

**No Animations For:**
- Navigation interactions
- Form inputs
- Footer elements

## Multi-Language Considerations
- Language switcher in top-right header and footer
- All dynamic content stored with language keys
- URL structure: /en/, /kz/, /ru/ prefixes
- RTL support not required (all languages LTR)

## Responsive Breakpoints
- Mobile: < 768px (single column, stacked)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (full multi-column layouts)

This design creates a bold, modern digital agency presence that balances aesthetic sophistication with functional clarity, using strategic color coding and interactive 3D elements to differentiate CreativeStudio in the market.