# AGENTS.md — Build Rules for GDG on Campus UNIBEN Website

You are building the official digital presence for the GDG on Campus UNIBEN chapter. You are working against the project requirements and the design system outlined in `docs/DESIGN.md`.

---

## 0. The one sentence that governs everything

**"Learn, build, and grow with a modern, animated, and tech-forward community platform."** 
The site must feel modern, sleek, and animated, embracing the "STUDIOPEPE" aesthetic for key moments while retaining student-led community vibes.

---

## 1. Non-negotiable product rules

1. **Mandatory Disclaimer:** The footer must always prominently include: *"GDG on Campus is an independent group; activities and opinions should not be linked to Google, the corporation."*
2. **Events Ecosystem Truth:**
   - **Directory:** The main events page features a sidebar for filtering (Upcoming, Past, Categories).
   - **Creation:** Authorized users (Trainers, Mentors, Speakers, and Trainees) can create and submit events directly on the platform.
   - **Details:** The event details view is a comprehensive "big page" detailing agenda, speakers, location, time, and prerequisites.
   - **Registration:** A dedicated, streamlined flow branching off the details page specifically for user registration and ticketing is required.
3. **Teams Identity:** The teams page must use bespoke formatting for the current GDGOC UNIBEN core team featuring high-quality pictures, social handles, roles within GDGOC, and professional job titles.
4. **Brand Assets:** Only use the official GDG on Campus logo lockups. Horizontal is preferred, stacked is an alternative.
5. **No Gatekeeping:** The tone must remain educational and accessible. Avoid overly complex jargon without explanation. 

---

## 2. Tech stack & architecture rules

- **Framework:** Next.js (App Router, latest version).
- **Styling:** Tailwind CSS + Framer Motion (for the animations and huge text reveals).
- **Backend/DB:** Firebase/Firestore or Supabase for event creation and registrations.
- **App structure:** Keep pages mapped directly to the sitemap (Home, About, Events, Team, Blog, Join, Contact).

---

## 3. Design system enforcement

- **Vibe:** Modern, sleek, animated, high-contrast, editorial.
- **Typography Strictness:** **Google Sans** must be used for all primary text. Massive, screen-spanning typography is encouraged for key pages (Home, Contact).
- **Color Usage:** Stark contrasts (black/white) are encouraged for editorial impact (e.g., Contact page), utilizing the Google colors (Blue, Green, Yellow, Red) thoughtfully as accents.

---

## 4. Coding conventions

- Semantic HTML is required for accessibility.
- Use responsive design principles (mobile-first).
- Animate elements purposefully using Framer Motion (e.g., text reveals, interactive blobs).

---

## 5. Definition of Done (per feature/screen)

Before considering any screen finished, confirm:
- [ ] Incorporates sleek, purposeful animations (Framer Motion).
- [ ] Events flow supports the sidebar, creation capabilities, detailed views, and the sub-page registration.
- [ ] Teams page uses bespoke grid formatting.
- [ ] Contact page matches the high-contrast minimalist editorial vision.
- [ ] The mandatory independent group disclaimer is present in the layout footer.

---

## 6. When to stop and ask, rather than deciding alone

- Before finalizing the backend database schema for events and registration.
- Before inventing new UI components that deviate from the established editorial/animated style in `docs/DESIGN.md`.

---

## 7. Explicitly out of scope / banned outright

- Corporate marketing jargon.
- Stiff, unanimated UI lacking modern interaction.
