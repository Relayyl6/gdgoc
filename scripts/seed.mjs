import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const EVENTS = [
  { id: 'build-with-ai-2026', title: 'Build with AI — Gemini API Masterclass', type: 'Workshop', date: '2026-10-21', startTime: '10:00 AM', endTime: '1:00 PM', location: 'Faculty of Physical Sciences, UNIBEN', isOnline: false, description: "A hands-on technical workshop where we dive deep into integrating the Gemini API into web applications. Bring your own device and code along with our facilitators.", whatToExpect: ['Set up a Gemini API project from scratch', 'Build a real AI-powered Next.js app', 'Learn prompt engineering fundamentals', 'Get code reviewed by GDGOC Technical Team'], speakers: [{ name: 'Chukwuemeka Obi', title: 'Software Engineer, Google', bio: 'GDE for Web Technologies with 8 years of experience building scalable web applications.' }], agenda: [{ time: '10:00 AM', title: 'Welcome & Setup', type: 'info' }, { time: '10:30 AM', title: 'Gemini API Deep Dive', type: 'talk' }, { time: '12:00 PM', title: 'Hands-on Build Session', type: 'workshop' }, { time: '12:45 PM', title: 'Showcase & Q&A', type: 'qa' }], maxAttendees: 80, registeredCount: 54, coverGradient: 'from-blue-600 to-blue-400', isPast: false },
  { id: 'devfest-uniben-2026', title: 'DevFest UNIBEN 2026', type: 'Hackathon', date: '2026-11-05', startTime: '9:00 AM', endTime: '6:00 PM', location: 'University of Benin Main Auditorium', isOnline: false, description: "GDGOC UNIBEN's flagship annual developer festival. A full day of talks, workshops, networking, and a hackathon challenge. Open to all students.", whatToExpect: ['Keynote sessions from industry leaders', 'Parallel workshop tracks', '6-hour hackathon', 'Networking with developers across Nigeria'], speakers: [{ name: 'Amara Nwosu', title: 'CTO, TechNG', bio: 'Serial founder and technical leader driving innovation in Nigerian fintech.' }, { name: 'Dr. Bola Fashola', title: 'CS Lecturer, UNIBEN', bio: 'Leading researcher in machine learning and data science applications.' }], agenda: [{ time: '9:00 AM', title: 'Opening Keynote', type: 'talk' }, { time: '10:30 AM', title: 'Workshop Tracks Begin', type: 'workshop' }, { time: '12:00 PM', title: 'Lunch & Networking', type: 'info' }, { time: '1:00 PM', title: 'Hackathon Kickoff', type: 'workshop' }, { time: '5:00 PM', title: 'Demos & Awards', type: 'qa' }], maxAttendees: 300, registeredCount: 187, coverGradient: 'from-red-600 to-orange-400', isPast: false },
  { id: 'solution-challenge-info-2026', title: 'Solution Challenge Info Session', type: 'Speaker Event', date: '2026-10-28', startTime: '2:00 PM', endTime: '4:00 PM', location: 'Online (Google Meet)', isOnline: true, description: 'Learn about the Google Solution Challenge 2026 — a global competition to solve UN Sustainable Development Goals using Google technology.', whatToExpect: ['Overview of the Solution Challenge', 'Tips from past finalists', 'Team formation session', 'Q&A with GDGOC leads'], speakers: [{ name: 'Tope Adeyemi', title: 'GDGOC Lead', bio: 'Computer Science student passionate about building solutions that matter.' }], agenda: [{ time: '2:00 PM', title: 'Introduction', type: 'info' }, { time: '2:30 PM', title: 'Challenge Overview', type: 'talk' }, { time: '3:00 PM', title: 'Team Formation', type: 'workshop' }, { time: '3:30 PM', title: 'Q&A', type: 'qa' }], maxAttendees: 150, registeredCount: 72, coverGradient: 'from-green-600 to-emerald-400', isPast: false },
  { id: 'web-fundamentals-jam-2026', title: 'Web Fundamentals Study Jam', type: 'Study Jam', date: '2026-09-15', startTime: '11:00 AM', endTime: '2:00 PM', location: 'Engineering Block B, Room 201', isOnline: false, description: 'Past event: A collaborative learning session covering HTML, CSS, and JavaScript fundamentals for beginners.', whatToExpect: ['HTML structure basics', 'CSS styling techniques', 'JavaScript essentials', 'Mini project build'], speakers: [], agenda: [], maxAttendees: 50, registeredCount: 48, coverGradient: 'from-yellow-500 to-amber-400', isPast: true }
];

const BLOG_POSTS = [
  { id: 'getting-started-gemini-api', title: 'Getting Started with the Gemini API in Next.js', excerpt: "A step-by-step guide to integrating Google's Gemini API into your Next.js 14 app using the App Router and server actions.", category: 'Frontend', author: 'Chidi Okonkwo', authorRole: 'Technical Lead', date: '2026-09-28', readTime: '8 min read', content: '## Introduction\n\nFull article content goes here...' },
  { id: 'android-jetpack-compose-intro', title: 'Building Beautiful UIs with Jetpack Compose', excerpt: "Jetpack Compose is Android's modern toolkit for building native UIs. Here's how we used it for our Solution Challenge project.", category: 'Android', author: 'Ngozi Eze', authorRole: 'Android Developer', date: '2026-09-20', readTime: '6 min read', content: 'Full article content goes here...' }
];

const TEAM_MEMBERS = [
  { id: '1', name: 'Tope Adeyemi', role: 'Chapter Lead', division: 'Leadership', bio: 'Computer Science student with a passion for AI and community building. Leads all chapter operations.', github: 'topeadeyemi', linkedin: 'tope-adeyemi', twitter: 'topeadeyemi_dev', isLead: true },
  { id: '2', name: 'Chioma Okafor', role: 'Co-Lead', division: 'Leadership', bio: 'Software Engineering student specialising in mobile development and project management.', github: 'chiomaokafor', linkedin: 'chioma-okafor', twitter: 'chioma_codes', isLead: true }
];

async function seed() {
  console.log('Seeding Events...');
  for (const item of EVENTS) {
    await setDoc(doc(db, 'gdgoc_events', item.id), item);
  }
  
  console.log('Seeding Blog Posts...');
  for (const item of BLOG_POSTS) {
    await setDoc(doc(db, 'gdgoc_blog_posts', item.id), item);
  }
  
  console.log('Seeding Team Members...');
  for (const item of TEAM_MEMBERS) {
    await setDoc(doc(db, 'gdgoc_team', item.id), item);
  }
  
  console.log('Done!');
  process.exit(0);
}

seed();
