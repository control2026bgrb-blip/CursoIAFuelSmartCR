# Design Guidelines: Allergy Portfolio & Case Study Browser

## Design Approach: Healthcare-Optimized Design System

**Selected System**: Material Design with healthcare-focused adaptations
**Rationale**: Information-dense medical content requires clear hierarchy, excellent readability, and established trust patterns. Material Design provides robust components for complex data display while maintaining accessibility.

**Key Principles**:
- Medical credibility through clean, professional aesthetics
- Maximum readability for detailed case study content
- Clear visual hierarchy for quick information scanning
- Accessible color contrast and typography for all users

---

## Typography System

**Font Families**:
- Primary: Inter (headings, UI elements) - Google Fonts
- Secondary: System UI (body text) - optimized for reading comfort

**Type Scale**:
- H1: text-4xl font-bold (case study titles, main headings)
- H2: text-2xl font-semibold (section headers)
- H3: text-xl font-medium (subsections, card titles)
- Body Large: text-base (primary content)
- Body: text-sm (supporting text, metadata)
- Caption: text-xs (labels, timestamps)

**Reading Optimization**: max-w-prose for long-form case study content

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: p-4, p-6
- Section spacing: py-8, py-12
- Element gaps: gap-4, gap-6
- Card spacing: p-6

**Grid Structure**:
- Main content: max-w-7xl mx-auto
- Case study detail: max-w-4xl mx-auto (optimal reading)
- Search results: CSS Grid with grid-cols-1 md:grid-cols-2 lg:grid-cols-3

---

## Core Layout Sections

### 1. Header/Navigation
- Fixed top navigation with shadow on scroll
- Logo left, search bar center, user menu right
- Primary navigation: Browse, Categories, Search
- Allergy type filter chips (Food, Environmental, Skin, Medication)
- Height: h-16

### 2. Main Browse Interface (Home)
- Left sidebar (w-64): Category filters with checkbox groups
- Main content area: Portfolio grid of case study cards
- Each card includes: thumbnail image, title, allergy type badge, brief summary, "Read More" link
- Card structure: rounded-lg border shadow-sm hover:shadow-md transition

### 3. Case Study Detail Page
- Hero area: Large featured image (if available) with overlay title and metadata (h-96)
- Content sections: Patient Profile, Symptoms Timeline, Treatment Approach, Outcomes, Related Cases
- Use cards (bg-white rounded-lg p-6 shadow) for distinct information blocks
- Side panel: Related case studies, quick facts, share options

### 4. Chatbot Integration
- Fixed bottom-right floating button: rounded-full w-14 h-14 shadow-lg
- Chatbot panel slides up: rounded-t-2xl shadow-2xl h-[600px] w-full md:w-96
- Message area with clear user/bot distinction
- Input field at bottom with send button

---

## Component Library

### Cards
- **Case Study Card**: White background, rounded-lg, subtle shadow, hover lift effect
- **Info Card**: Light background (bg-gray-50), rounded borders, organized data display
- **Stat Card**: Centered content, large numbers, supporting labels

### Badges & Tags
- **Allergy Type Badges**: Pill-shaped (rounded-full px-3 py-1), text-xs, distinct per category
- **Status Indicators**: Small, colored dots for severity/status

### Forms & Inputs
- **Search Bar**: Large, prominent (h-12), rounded-full, icon left, clear button right
- **Filter Checkboxes**: Standard Material checkboxes with labels
- **Chat Input**: Rounded-lg border, h-12, integrated send button

### Navigation
- **Tab Navigation**: For case study sections (underline active state)
- **Breadcrumbs**: For navigation hierarchy (Home > Category > Case Study)

### Data Display
- **Timeline**: Vertical timeline for symptom progression
- **Comparison Tables**: Striped rows for treatment comparisons
- **List Groups**: Bordered lists for symptoms, treatments

### Overlays
- **Modal Dialogs**: Centered, rounded-lg, max-w-2xl, backdrop blur
- **Chatbot Panel**: Slide-up animation, fixed positioning

---

## Images

### Hero Images
- **Home Page**: NOT REQUIRED - prioritize functional search/browse interface
- **Case Study Pages**: Include contextual medical imagery (h-96, object-cover, rounded-t-lg)

### Card Thumbnails
- Portfolio cards: Square or 16:9 thumbnails (h-48, rounded-t-lg)
- Placeholder for cases without images

### Image Treatment
- All images: rounded corners, consistent aspect ratios
- Overlay text: Always on blurred/darkened backgrounds for readability

---

## Accessibility & UX

- High contrast text on all backgrounds (WCAG AA minimum)
- Focus states: ring-2 ring-blue-500 on all interactive elements
- Skip navigation links for keyboard users
- ARIA labels on all icon-only buttons
- Chat messages clearly labeled for screen readers
- Consistent form field styling across entire app

---

## Special Features

### Chatbot Design
- Clear visual distinction between user (right-aligned, blue) and bot messages (left-aligned, gray)
- Typing indicator animation
- Quick reply buttons for common queries
- Minimize/maximize controls

### Search Experience
- Instant results preview as user types
- Filter refinement sidebar
- Result count display
- Clear all filters button

### Portfolio Grid
- Masonry layout option for varied content heights
- Lazy loading for performance
- Skeleton loaders during data fetch

---

**No Animations**: Keep interface calm and professional - avoid distracting motion. Use subtle transitions only (opacity, transform) for state changes.