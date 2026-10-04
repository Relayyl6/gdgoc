// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  isOnline: boolean;
  meetingLink?: string;
  bevyLink?: string;
  speakerLink?: string;
  traineeLink?: string;
  description: string;
  whatToExpect: string[];
  speakers: { name: string; title: string; bio: string }[];
  agenda: { time: string; title: string; type: string; description?: string }[];
  maxAttendees: number;
  registeredCount: number;
  coverGradient: string;
  image?: string;
  featured?: boolean;
  isPast: boolean;
  createdAt?: string;
  status?: string;
  allowSpeakers?: boolean;
  allowTrainees?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  content: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  division: string;
  bio: string;
  github: string;
  linkedin: string;
  twitter: string;
  isLead: boolean;
  photoUrl?: string;
}

// ─── Events ───────────────────────────────────────────────────────────────────

export const EVENTS: Event[] = [
  {
    id: 'build-with-ai-2026',
    title: 'Build with AI: Gemini API & Agentic Systems Masterclass',
    type: 'Workshop',
    date: '2026-10-21',
    startTime: '10:00 AM',
    endTime: '2:00 PM',
    location: 'Faculty of Physical Sciences, UNIBEN',
    isOnline: false,
    description:
      'An intensive technical deep-dive into Google Gemini API, function calling, multimodal embeddings, and autonomous agent design. Bring your laptop and build a production-ready AI application from scratch.',
    whatToExpect: [
      'Architecting agentic workflows with Gemini Pro and Flash',
      'Implementing multimodal search with text and vision inputs',
      'Hands-on live coding: deploying a full-stack Next.js 14 AI app',
      'Direct 1-on-1 code reviews from Google Developer Experts',
    ],
    speakers: [
      {
        name: 'Chukwuemeka Obi',
        title: 'Senior AI Engineer, Google Cloud',
        bio: 'GDE for Web & Machine Learning with over 8 years building large-scale distributed systems.',
      },
      {
        name: 'Blessing Adebayo',
        title: 'Machine Learning Researcher, UNIBEN',
        bio: 'Doctoral researcher specializing in natural language processing and low-resource African languages.',
      },
    ],
    agenda: [
      { time: '10:00 AM', title: 'Welcome & Environment Verification', type: 'info' },
      { time: '10:30 AM', title: 'Deep Dive: Gemini API, System Instructions & Embeddings', type: 'talk' },
      { time: '11:45 AM', title: 'Architecture Breakdown: Retrieval-Augmented Generation', type: 'talk' },
      { time: '12:30 PM', title: 'Hands-on Code Along: Building CampusBot with Gemini', type: 'workshop' },
      { time: '1:40 PM', title: 'Live Demonstrations, Swag Giveaways & Q&A', type: 'qa' },
    ],
    maxAttendees: 120,
    registeredCount: 86,
    coverGradient: 'from-blue-600 to-indigo-500',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    isPast: false,
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'solution-challenge-info-2026',
    title: 'Google Solution Challenge 2027: Ideation & Team Formation',
    type: 'Speaker Event',
    date: '2026-10-28',
    startTime: '2:00 PM',
    endTime: '5:00 PM',
    location: 'Google Meet & 1000-Seat Lecture Theatre',
    isOnline: false,
    description:
      'Unlock the secrets to building high-impact technology addressing the 17 UN Sustainable Development Goals. Learn how previous UNIBEN finalists progressed to the global top 100 and find your dream project teammates.',
    whatToExpect: [
      'Breakdown of judging criteria, mentorship perks, and global prizes',
      'Pitch-your-problem lightning sessions with fellow innovators',
      'Structured speed networking to form cross-functional 4-person teams',
      'Exclusive access to Google Cloud and Firebase credits for contenders',
    ],
    speakers: [
      {
        name: 'Tope Adeyemi',
        title: 'GDGOC Campus Lead 2026/2027',
        bio: 'Final-year Computer Science student, past Solution Challenge Top 100 Global Semi-Finalist.',
      },
      {
        name: 'Engr. Osasere Idahosa',
        title: 'Tech Policy Consultant & SDGs Advocate',
        bio: 'Adviser to regional tech incubators and champion for clean energy tech adoption in West Africa.',
      },
    ],
    agenda: [
      { time: '2:00 PM', title: 'Opening Remarks & Solution Challenge Playbook', type: 'info' },
      { time: '2:30 PM', title: 'Fireside Chat: From UNIBEN Dorms to Global Semi-Finals', type: 'talk' },
      { time: '3:15 PM', title: 'Team Matchmaking & Brainstorming Sprints', type: 'workshop' },
      { time: '4:30 PM', title: 'Mentor Office Hours & Project Registration Kickoff', type: 'qa' },
    ],
    maxAttendees: 250,
    registeredCount: 142,
    coverGradient: 'from-green-600 to-emerald-400',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    isPast: false,
    createdAt: '2026-09-25T14:30:00Z',
  },
  {
    id: 'devfest-uniben-2026',
    title: 'DevFest UNIBEN 2026: Designing the Intelligent Web',
    type: 'Hackathon',
    date: '2026-11-05',
    startTime: '9:00 AM',
    endTime: '6:00 PM',
    location: 'University of Benin Main Auditorium',
    isOnline: false,
    description:
      "The premier developer gathering in Edo State. DevFest UNIBEN brings together over 600 students, engineers, founders, and designers for keynotes, 3 parallel technical tracks, hands-on labs, and an 8-hour sprint hackathon with cash prizes.",
    whatToExpect: [
      'Keynotes by world-renowned Google Developer Experts and tech founders',
      'Three parallel tracks: Cloud/DevOps, AI/ML, and Modern Frontend Engineering',
      'Live high-stakes 6-hour hackathon with cash prizes and investor intros',
      'Curated networking lunch, exhibition booths, and custom GDG swag boxes',
    ],
    speakers: [
      {
        name: 'Amara Nwosu',
        title: 'CTO, PayPulse Africa',
        bio: 'Serial fintech architect leading payment infrastructure serving over 3 million users across Africa.',
      },
      {
        name: 'Dr. Bola Fashola',
        title: 'Associate Professor of AI, UNIBEN',
        bio: 'Leading researcher in computer vision applications for precision agriculture and environmental conservation.',
      },
      {
        name: 'Tunde Balogun',
        title: 'Staff Infrastructure Engineer, Monzo',
        bio: 'Distributed systems specialist and Kubernetes ecosystem contributor.',
      },
    ],
    agenda: [
      { time: '9:00 AM', title: 'Grand Keynote: Building for the Next Billion Users', type: 'talk' },
      { time: '10:15 AM', title: 'Breakout Tracks: Cloud, Generative AI & Next.js Performance', type: 'workshop' },
      { time: '12:30 PM', title: 'Lunch, Partner Expo & Networking Lounge', type: 'info' },
      { time: '1:30 PM', title: 'DevFest Hackathon Sprint Commences', type: 'workshop' },
      { time: '5:00 PM', title: 'Hackathon Pitch Pit & Prize Presentations', type: 'qa' },
    ],
    maxAttendees: 600,
    registeredCount: 389,
    coverGradient: 'from-red-600 to-orange-400',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
    featured: false,
    isPast: false,
    createdAt: '2026-09-20T08:00:00Z',
  },
  {
    id: 'flutter-forward-extended-2026',
    title: 'Flutter Forward Extended: Cross-Platform Mastery',
    type: 'Workshop',
    date: '2026-09-22',
    startTime: '10:00 AM',
    endTime: '3:30 PM',
    location: 'Computer Science Laboratory 1',
    isOnline: false,
    description:
      'An immersive deep-dive into Flutter 3.x and Dart, covering adaptive layouts for mobile, web, and desktop. Attendees built a real-time campus cafeteria delivery app with Firebase integration.',
    whatToExpect: [
      'Architectural state management with Riverpod and Bloc',
      'Smooth 60fps animations with Flutter CustomPainter',
      'Offline-first sync using Cloud Firestore and SQLite',
      'Real-time app publishing to Google Play Internal Testing',
    ],
    speakers: [
      {
        name: 'Kelechi Iheanacho',
        title: 'Lead Mobile Architect, Kuda Bank',
        bio: 'Flutter specialist with over 6 years building top-ranking fintech applications.',
      },
      {
        name: 'Damilola Jinadu',
        title: 'GDG Mobile Track Co-Lead',
        bio: 'Passionate mobile engineer and open-source enthusiast at UNIBEN.',
      },
    ],
    agenda: [
      { time: '10:00 AM', title: "Keynote: What's New in Flutter & Dart", type: 'talk' },
      { time: '11:00 AM', title: 'Live Build: Clean Architecture with Riverpod', type: 'workshop' },
      { time: '1:00 PM', title: 'Lunch & Firebase Backend Integration', type: 'info' },
      { time: '2:00 PM', title: 'App Optimization & CI/CD with GitHub Actions', type: 'workshop' },
      { time: '3:00 PM', title: 'Showcase & Code Clinic', type: 'qa' },
    ],
    maxAttendees: 90,
    registeredCount: 88,
    coverGradient: 'from-sky-500 to-cyan-400',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    isPast: true,
    createdAt: '2026-09-01T11:00:00Z',
  },
  {
    id: 'web-fundamentals-jam-2026',
    title: 'Modern Web Foundations & TypeScript Study Jam',
    type: 'Study Jam',
    date: '2026-09-15',
    startTime: '11:00 AM',
    endTime: '3:00 PM',
    location: 'Engineering Block B, Room 201',
    isOnline: false,
    description:
      'A rigorous hands-on study jam bridging vanilla JavaScript to modern TypeScript, responsive Tailwind CSS layouts, and Next.js App Router core mental models.',
    whatToExpect: [
      'Core modern JavaScript: closures, event loop, async/await',
      'Type-safe programming with TypeScript generics and utility types',
      'Building accessible, mobile-first responsive components',
      'Interactive pair programming drills and peer reviews',
    ],
    speakers: [
      {
        name: 'Chidi Okonkwo',
        title: 'Technical Lead, GDGOC UNIBEN',
        bio: 'Full-stack engineer passionate about clean code, TypeScript, and modern frontend tools.',
      },
    ],
    agenda: [
      { time: '11:00 AM', title: 'JavaScript Execution Contexts Demystified', type: 'talk' },
      { time: '12:00 PM', title: 'TypeScript from Scratch: Interfaces, Unions & Generics', type: 'workshop' },
      { time: '1:30 PM', title: 'Tailwind CSS Component Speedrun', type: 'workshop' },
      { time: '2:30 PM', title: 'Quiz Challenge & Winners Announcement', type: 'qa' },
    ],
    maxAttendees: 70,
    registeredCount: 70,
    coverGradient: 'from-yellow-500 to-amber-400',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
    featured: false,
    isPast: true,
    createdAt: '2026-08-28T09:15:00Z',
  },
  {
    id: 'cloud-run-serverless-2026',
    title: 'Google Cloud Run & Serverless Microservices Workshop',
    type: 'Workshop',
    date: '2026-08-19',
    startTime: '10:00 AM',
    endTime: '2:00 PM',
    location: 'ICT Centre, Lab 3',
    isOnline: false,
    description:
      'Containerizing and deploying real-world microservices using Docker, Google Cloud Run, Cloud SQL, and Secret Manager with zero infrastructure hassle.',
    whatToExpect: [
      'Dockerizing backend services with multi-stage builds',
      'Continuous deployment from GitHub to Google Cloud Run',
      'Configuring automatic autoscaling to zero for cost optimization',
      'Hands-on lab vouchers with 100 free Google Cloud credits',
    ],
    speakers: [
      {
        name: 'Folake Adeleke',
        title: 'Cloud Solutions Architect, Interswitch',
        bio: 'GCP certified professional cloud architect building resilient financial networks.',
      },
      {
        name: 'Emmanuel Efe',
        title: 'DevOps Engineer & GDG Cloud Lead',
        bio: 'Cloud native builder focused on Kubernetes, Terraform, and cloud cost observability.',
      },
    ],
    agenda: [
      { time: '10:00 AM', title: 'Why Serverless Containers Are The Future', type: 'talk' },
      { time: '10:45 AM', title: 'Docker Containerization Live Demo', type: 'workshop' },
      { time: '11:45 AM', title: 'Deploying to Google Cloud Run in 60 Seconds', type: 'workshop' },
      { time: '1:00 PM', title: 'Connecting Cloud SQL & Environment Secrets Safely', type: 'talk' },
      { time: '1:30 PM', title: 'Q&A, GCP Certification Pathway Overview', type: 'qa' },
    ],
    maxAttendees: 60,
    registeredCount: 58,
    coverGradient: 'from-indigo-600 to-purple-500',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    isPast: true,
    createdAt: '2026-08-05T13:00:00Z',
  },
  {
    id: 'women-techmakers-uniben-2026',
    title: 'Women Techmakers UNIBEN: Dare to Be Inspiring',
    type: 'Speaker Event',
    date: '2026-07-26',
    startTime: '1:00 PM',
    endTime: '5:30 PM',
    location: 'Faculty of Arts Auditorium, UNIBEN',
    isOnline: false,
    description:
      'Celebrating women in tech with inspiring keynotes, career transition panels, technical lightning talks, and personalized mentorship pairing for early-career female engineers.',
    whatToExpect: [
      'Fireside sessions with pioneering women engineering managers',
      'Portfolio & resume critique clinic with senior recruiters',
      'Technical workshops on API development and UI design systems',
      'Networking reception and community sisterhood circle',
    ],
    speakers: [
      {
        name: 'Dr. Oghogho Ikponmwosa',
        title: 'Director of ICT, University of Benin',
        bio: 'Pioneering educator and advocate for women in STEM across sub-Saharan Africa.',
      },
      {
        name: 'Somtochukwu Arinze',
        title: 'Product Designer, Flutterwave',
        bio: 'Design systems advocate passionate about accessible UX for emerging digital markets.',
      },
    ],
    agenda: [
      { time: '1:00 PM', title: 'Welcome Address & WTM Global Vision', type: 'info' },
      { time: '1:30 PM', title: 'Panel: Breaking Barriers in Tech Leadership', type: 'talk' },
      { time: '2:45 PM', title: 'Lightning Demos: Building Without Boundaries', type: 'workshop' },
      { time: '4:00 PM', title: 'Mentorship Circle & Portfolio Reviews', type: 'workshop' },
      { time: '5:00 PM', title: 'Closing Remarks, Photos & Networking Tea', type: 'qa' },
    ],
    maxAttendees: 200,
    registeredCount: 194,
    coverGradient: 'from-pink-600 to-rose-400',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop',
    featured: false,
    isPast: true,
    createdAt: '2026-07-10T12:00:00Z',
  },
];

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'getting-started-gemini-api',
    title: 'Getting Started with the Gemini API in Next.js',
    excerpt:
      "A step-by-step guide to integrating Google's Gemini API into your Next.js 14 app using the App Router and server actions.",
    category: 'Frontend',
    author: 'Chidi Okonkwo',
    authorRole: 'Technical Lead',
    date: '2026-09-28',
    readTime: '8 min read',
    content: 'Full article content goes here...',
  },
  {
    id: 'android-jetpack-compose-intro',
    title: 'Building Beautiful UIs with Jetpack Compose',
    excerpt:
      "Jetpack Compose is Android's modern toolkit for building native UIs. Here's how we used it for our Solution Challenge project.",
    category: 'Android',
    author: 'Ngozi Eze',
    authorRole: 'Android Developer',
    date: '2026-09-20',
    readTime: '6 min read',
    content: 'Full article content goes here...',
  },
  {
    id: 'ai-ml-study-jam-recap',
    title: 'AI/ML Study Jam Recap: What We Learned',
    excerpt:
      'A comprehensive recap of our Google AI Essentials Study Jam, covering key takeaways from 3 weeks of collaborative learning.',
    category: 'AI',
    author: 'Emeka Nwachukwu',
    authorRole: 'Content Lead',
    date: '2026-09-10',
    readTime: '5 min read',
    content: 'Full article content goes here...',
  },
  {
    id: 'figma-to-code-workflow',
    title: 'From Figma to Code: Our Design-Dev Workflow',
    excerpt:
      'How the GDGOC Design Team collaborates with developers to ship polished UIs. Our complete design-to-code process explained.',
    category: 'Design',
    author: 'Adaeze Obi',
    authorRole: 'Design Lead',
    date: '2026-08-30',
    readTime: '7 min read',
    content: 'Full article content goes here...',
  },
  {
    id: 'backend-fastapi-cloud-run',
    title: 'Deploying FastAPI to Google Cloud Run',
    excerpt:
      'We deployed our Solution Challenge backend using FastAPI and Google Cloud Run. Here is our step-by-step deployment guide.',
    category: 'Backend',
    author: 'Praise Ehigie',
    authorRole: 'Backend Developer',
    date: '2026-08-15',
    readTime: '10 min read',
    content: 'Full article content goes here...',
  },
  {
    id: 'devfest-2025-recap',
    title: 'DevFest UNIBEN 2025: A Year in Review',
    excerpt:
      'Reliving the highlights of our biggest event yet — 400+ attendees, 12 speakers, and a hackathon that produced 3 funded startups.',
    category: 'Frontend',
    author: 'Tope Adeyemi',
    authorRole: 'GDGOC Lead',
    date: '2026-07-01',
    readTime: '4 min read',
    content: 'Full article content goes here...',
  },
];

// ─── Team Members ─────────────────────────────────────────────────────────────

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Tope Adeyemi',
    role: 'Chapter Lead',
    division: 'Leadership',
    bio: 'Computer Science student with a passion for AI and community building. Leads all chapter operations.',
    github: 'topeadeyemi',
    linkedin: 'tope-adeyemi',
    twitter: 'topeadeyemi_dev',
    isLead: true,
  },
  {
    id: '2',
    name: 'Chioma Okafor',
    role: 'Co-Lead',
    division: 'Leadership',
    bio: 'Software Engineering student specialising in mobile development and project management.',
    github: 'chiomaokafor',
    linkedin: 'chioma-okafor',
    twitter: 'chioma_codes',
    isLead: true,
  },
  {
    id: '3',
    name: 'Emeka Nwachukwu',
    role: 'Technical Lead',
    division: 'Technical',
    bio: 'Full-stack developer. Organises workshops and study jams for the community.',
    github: 'emeka_nw',
    linkedin: 'emeka-nwachukwu',
    twitter: 'emeka_codes',
    isLead: false,
  },
  {
    id: '4',
    name: 'Adaeze Obi',
    role: 'Design Lead',
    division: 'Design',
    bio: 'UI/UX designer and visual storyteller. Manages all chapter branding and graphic content.',
    github: 'adaeze_obi',
    linkedin: 'adaeze-obi',
    twitter: 'adaeze_designs',
    isLead: false,
  },
  {
    id: '5',
    name: 'Praise Ehigie',
    role: 'Content Lead',
    division: 'Content',
    bio: 'Technical writer and communications strategist. Runs the dev blog and social channels.',
    github: 'praise_e',
    linkedin: 'praise-ehigie',
    twitter: 'praise_writes',
    isLead: false,
  },
  {
    id: '6',
    name: 'Ngozi Eze',
    role: 'Outreach Lead',
    division: 'Outreach',
    bio: 'Handles all community partnerships, sponsorships, and event logistics coordination.',
    github: 'ngozi_eze',
    linkedin: 'ngozi-eze',
    twitter: 'ngozi_outreach',
    isLead: false,
  },
  {
    id: '7',
    name: 'Chidi Okonkwo',
    role: 'Android Developer',
    division: 'Technical',
    bio: 'Android developer obsessed with Jetpack Compose. Leads mobile development workshops.',
    github: 'chidi_dev',
    linkedin: 'chidi-okonkwo',
    twitter: 'chidi_android',
    isLead: false,
  },
  {
    id: '8',
    name: 'Funmi Alalade',
    role: 'Social Media Manager',
    division: 'Content',
    bio: 'Creates engaging content across all GDGOC social channels. Instagram growth strategist.',
    github: 'funmi_al',
    linkedin: 'funmi-alalade',
    twitter: 'funmi_social',
    isLead: false,
  },
];
