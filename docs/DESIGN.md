# DESIGN.md — GDG on Campus UNIBEN Website

This is the authoritative visual and interaction reference for the GDGOC UNIBEN website. It translates modern, sleek, animated web aesthetics into a functional web component system suitable for a tech-forward student community.

---

## 1. Design Philosophy

The site should feel **modern, sleek, and animated**. It is a bridge between academic theory and practical industry experience, heavily relying on high-contrast editorial layouts (inspired by "STUDIOPEPE") and massive typography. 

**Signature Aesthetic: Glassmorphism**
Glassmorphism is a core visual signature across the platform. Use it to create depth, establish hierarchy, and maintain a sleek, tech-forward vibe. This involves using semi-transparent backgrounds with background blur (`backdrop-blur`), subtle white borders (`border-white/10`), and soft drop shadows on floating elements like navigation bars, event cards, and sticky components.

---

## 2. Foundations

### 2.1 Color Palette

The official Google palette serves as accents, while stark black and white are used for high-impact editorial moments.

| Token | Value | Usage |
|---|---|---|
| `color-google-blue` | `#4285f4` | Primary brand accent |
| `color-google-green`| `#34a853` | Success states, secondary accents |
| `color-google-yellow`| `#f9ab00` | Highlights, warning states |
| `color-google-red`  | `#ea4335` | Error states, urgent callouts |
| `color-ink-main`    | `#000000` | Stark black for backgrounds (Contact page) or text |
| `color-white`       | `#ffffff` | Primary background, high-contrast text |
| `color-glass`       | `rgba(255,255,255,0.1)`| For glassmorphic surfaces over images/dark backgrounds |

### 2.2 Typography

| Font Family | Usage |
|---|---|
| **Google Sans** | Main typeface. Used massively for heroic text reveals and standardly for body text. |
| **Google Sans Mono** | Secondary typeface reserved strictly for code blocks and tech tags. |

### 2.3 Animations (Framer Motion)
- Smooth entry animations for all pages.
- Interactive, dynamic elements (e.g., floating 3D elements, particle systems, or cursor-following blobs) to give a tech-forward feel.

---

## 3. Core Component Patterns

### 3.1 Hero Section
- Huge, bold typography spelling **"GDGOC"**, with a smaller **"UNIBEN"** elegantly positioned below it to the right.
- An interactive "animated something" (e.g., cursor-following blob or floating 3D element) is prominent to establish the dynamic vibe.

### 3.2 What We Do Cards
Clean glassmorphic or white surface cards on an off-white (`#f0f0f0`) background. Each card should feature a distinct icon (ideally utilizing one of the 4 Google colors), a bold title, and a brief explanatory paragraph. 

### 3.3 Team Member Cards
Professional yet approachable layout utilizing glassmorphic accents where applicable.
- Square or circular avatar photo.
- Name in bold.
- Role/Division clearly stated.
- 1-2 sentence bio focusing on major, interests, and role focus. Keep it role-relevant.
- Icon links to GitHub, LinkedIn, Twitter/X.

### 3.4 Event Tabs & Filters
Pill-shaped toggle buttons for filtering events (e.g., Workshops, Speaker Events, Hackathons). Active state uses a filled brand color; inactive state is outlined, gray, or glassmorphic.

### 3.5 Blog / Tech Post Cards
Card layout featuring a category tag at the top. The category tag should use **Google Sans Mono** to emphasize the technical nature of the blog (e.g., `<Frontend />`, `[AI/ML]`). Glassmorphic hover states are encouraged.

### 3.6 Event Detail Modal/Card
Includes sections for: About, What to Expect, Speakers, Location, and an unmissable "RSVP Now" button linking to the GDG Platform. Should heavily utilize glassmorphism if displayed as a modal over the main page.

---

## 4. Page-Specific Direction

- **Home:** Must immediately communicate the core message. Focus on the primary CTA to join, the mission statement, and show the most immediate upcoming events auto-pulled from the platform.
- **About:** Tone shifts to inspirational. Focus on the mission, the global scale (100+ countries, 2,100+ clubs), and the rebranding story (GDSC → GDG on Campus).
- **Events:** Needs a clear visual distinction between "Upcoming" and "Past" events. Upcoming events must dominate the page hierarchy. Clearly explain the difference between Technical Workshops, Study Jams, and Speaker Events. Includes the filtering sidebar.
- **Teams:** Showcase the current GDGOC UNIBEN core team with bespoke, grid-based formatting.
- **Join Us:** Step-by-step clarity. Use a simple component to explain the signup process (Click Join → GDG Platform signup → Verification). Emphasize that it is free.
- **Contact:** Minimalist, high-contrast, editorial style (STUDIOPEPE inspired). Stark black background, massive white typography "CONTACT" at bottom, columns top left (General Enquiries, Socials, Work With Us), stylized image block on the right.

---

## 5. Required Legal / Compliance

- **Footer Disclaimer:** Every page must render the disclaimer: *"GDG on Campus is an independent group; activities and opinions should not be linked to Google, the corporation."*
- **Code of Conduct:** Must be linked prominently and align with Google's community guidelines, emphasizing inclusivity and respect.
