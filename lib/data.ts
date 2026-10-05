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
