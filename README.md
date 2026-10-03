# GDG on Campus Website

> An energetic, welcoming, action-oriented platform uniting students interested in development, peer-to-peer learning, and community impact.

---

## Overview

The **GDG on Campus Website** is the central digital hub for our chapter. It showcases our events, team, and content while serving as the primary entry point for new members to join our community. It bridges the gap between academic learning and industry needs, supported by Google but driven by students.

---

## Key Features & Capabilities

### 📅 Event Management & Integration
Pull upcoming events directly from the GDG Platform. Showcase past events with filters (Workshops, Speaker Events, Hackathons, Study Jams) and provide detailed event information with RSVPs.

### 👥 Team & Community Showcase
Highlight the chapter's Organizers and Core Teams (Technical, Design, Content & Communications, Outreach & Operations). Feature member cards with roles, bios, and social links.

### 📝 Development Blog
A technical blog organized by track (Frontend, Backend, Android, AI, Design) showcasing tutorials, event recaps, and community-contributed projects.

### 🚀 Seamless Onboarding
Clear "Join Us" flows explaining membership benefits, directing users to the GDG Platform signup, and outlining role opportunities and the community Code of Conduct.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js (App Router) |
| **Styling** | Tailwind CSS |
| **Integrations** | GDG Platform API/RSS |

---

## Project Structure

```
gdg-on-campus/
├── app/
│   ├── (public)/                # Public facing pages
│   │   ├── page.tsx             # Home
│   │   ├── about/               # Our Story & Mission
│   │   ├── events/              # Upcoming & Past Events
│   │   ├── team/                # Organizers & Core Teams
│   │   ├── join/                # Membership info & Benefits
│   │   ├── blog/                # Tech posts & tutorials
│   │   └── contact/             # Socials & inquiry form
│   └── (admin)/                 # (Phase 3) Admin Panel
├── components/                  # Shared UI components
├── lib/                         # Utilities & API integrations
├── public/                      # Static assets & logos
├── docs/                        # Project documentation
│   ├── DESIGN.md                # Brand & component system
│   └── AGENTS.md                # Build rules & constraints
└── README.md
```

---

## Core User Flows

### 1. Discover & RSVP to Events
1. Visitor lands on the Home page or Events page.
2. Explores the "Upcoming Events" pulled from the GDG Platform.
3. Reviews event details (Technical Workshop vs Speaker Event).
4. Clicks "RSVP Now" and is directed to the official GDG Platform event page to register.

### 2. Join the Community
1. Student visits the "Join Us" page to learn about membership benefits.
2. Follows the step-by-step guide (Click Join → GDG Platform signup → Verification).
3. Reviews the Code of Conduct.

### 3. Read Technical Content
1. Member navigates to the Blog section.
2. Filters by categories like AI, Android, or Frontend.
3. Reads community-contributed tutorials or event recaps without gatekeeping jargon.

---

## Design System Quick Look

**Colors:** Official Google Palette (Blue `#4285f4`, Green `#34a853`, Yellow `#f9ab00`, Red `#ea4335`).
**Typography:** Google Sans (Primary) and Google Sans Mono (Code/Technical).
**Tone:** Inspirational, community-focused, accessible. Avoid corporate Google marketing language.

---

## What This Platform Is Not
- **Not a corporate Google site** — Emphasize the student-led nature of the club. Activities and opinions are independent.
- **Not a standalone event ticketing system** — All RSVPs and official memberships go through the GDG Platform.

---

## Implementation Priority
- **Phase 1 (MVP):** Home, About, Events, Team
- **Phase 2:** Join Us, Blog, Contact, Code of Conduct
- **Phase 3:** Admin/Management interface (member management, application review)

---

## Documentation

| Document | Purpose |
|---|---|
| [`docs/DESIGN.md`](docs/DESIGN.md) | Brand guidelines, color tokens, and UI components |
| [`docs/AGENTS.md`](docs/AGENTS.md) | Build rules, constraints, and AI contributor guidelines |
