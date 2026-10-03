import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDocs, collection, writeBatch } from 'firebase/firestore';
import { EVENTS, BLOG_POSTS, TEAM_MEMBERS } from '@/lib/data';

const SHOWCASE = [
  { id: '1', eventId: 'devfest-uniben-2025', src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop', status: 'approved' },
  { id: '2', eventId: 'flutter-forward-2026', src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop', status: 'approved' },
  { id: '3', eventId: 'ai-ml-study-jam-recap', src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop', status: 'approved' },
  { id: '4', eventId: 'web-fundamentals-jam-2026', src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop', status: 'approved' },
  { id: '5', eventId: 'devfest-uniben-2025', src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop', status: 'approved' },
  { id: '6', eventId: 'flutter-forward-2026', src: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop', status: 'approved' }
];

const COMMUNITY_PROJECTS = [
  {
    id: 'proj-1',
    title: 'Uniben Campus Navigator',
    description: 'A mobile app built with Flutter that helps new students navigate the Ugbowo campus efficiently using custom maps.',
    projectType: 'Mobile App',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop',
    liveLink: 'https://play.google.com/store/apps/details?id=uniben.navigator',
    githubLink: 'https://github.com/gdgoc-uniben/campus-nav',
    contributors: ['Emeka N.', 'Chidi O.'],
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'proj-2',
    title: 'GDGOC UNIBEN Design System',
    description: 'A comprehensive Figma UI kit and design system used for all our community projects.',
    projectType: 'UI/UX Design',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
    figmaLink: 'https://figma.com/file/uniben-design-system',
    contributors: ['Adaeze Obi'],
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'proj-3',
    title: 'Study Room Booker',
    description: 'A web application built with Next.js and Firebase to help students book empty lecture halls for group study sessions.',
    projectType: 'Web App',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
    liveLink: 'https://studybooker.vercel.app',
    githubLink: 'https://github.com/gdgoc-uniben/study-booker',
    contributors: ['Tunde A.', 'Ngozi E.'],
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

const VOLUNTEERS = [
  {
    id: 'vol-1',
    fullName: 'Ada Okonkwo',
    email: 'ada@example.com',
    phone: '+2348012345678',
    department: 'Computer Science',
    level: '300 Level',
    role: 'Dev Rel',
    reason: 'I love speaking and writing about code.',
    experience: 'I run a medium blog with 1k followers.',
    availability: ['Weekends'],
    status: 'New',
    date: new Date().toISOString()
  },
  {
    id: 'vol-2',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+2348098765432',
    department: 'Engineering',
    level: '200 Level',
    role: 'Events',
    reason: 'I want to help organize the best tech events on campus.',
    experience: 'Organized my departmental week.',
    availability: ['Weekday Evenings'],
    status: 'Reviewed',
    date: new Date().toISOString()
  }
];

export const dynamic = 'force-dynamic';

/** Commit an array of docs in batches of ≤500 (Firestore limit) */
async function batchWrite(items: { ref: any; data: any }[]) {
  const CHUNK = 500;
  for (let i = 0; i < items.length; i += CHUNK) {
    const batch = writeBatch(db);
    items.slice(i, i + CHUNK).forEach(({ ref, data }) => batch.set(ref, data));
    await batch.commit();
  }
}

export async function GET() {
  try {
    // Inject placeholder images for team members if missing
    const enrichedTeam = TEAM_MEMBERS.map((t, idx) => ({
      ...t,
      photoUrl: t.photoUrl || `https://images.unsplash.com/photo-${1500000000000 + idx}?auto=format&fit=crop&q=80&w=200&h=200`
    }));

    // ── 1. Static collections ─────────────────────────────────────────────────
    const staticItems = [
      ...EVENTS.map(e => ({ ref: doc(db, 'gdgoc_events', e.id), data: e })),
      ...BLOG_POSTS.map(b => ({ ref: doc(db, 'gdgoc_blog_posts', b.id), data: b })),
      ...enrichedTeam.map(t => ({ ref: doc(db, 'gdgoc_team', t.id), data: t })),
      ...SHOWCASE.map(s => ({ ref: doc(db, 'gdgoc_media_gallery', s.id), data: s })),
      ...COMMUNITY_PROJECTS.map(p => ({ ref: doc(db, 'gdgoc_community_projects', p.id), data: p })),
      ...VOLUNTEERS.map(v => ({ ref: doc(db, 'gdgoc_volunteers', v.id), data: v })),
    ];
    await batchWrite(staticItems);

    // ── 2. Clear old seeded registrations ────────────────────────────────────
    const existingRegs = await getDocs(collection(db, 'gdgoc_registrations'));
    const deleteItems = existingRegs.docs.filter(d => d.id.startsWith('reg-'));
    const CHUNK = 500;
    for (let i = 0; i < deleteItems.length; i += CHUNK) {
      const batch = writeBatch(db);
      deleteItems.slice(i, i + CHUNK).forEach(d => batch.delete(d.ref));
      await batch.commit();
    }

    // ── 3. Rich varied registrations (NO ATTENDEES, ONLY SPEAKERS/TRAINEES) ───
    const firstNames = ['Ada','Chidi','Ngozi','Emeka','Praise','John','Jane','Alex','Sarah','Michael','David','Joy','Grace','Tobi','Chioma','Kemi','Femi','Amaka','Bola','Seun','Tunde','Yetunde','Gbenga','Funke','Uche','Ike','Nnenna','Obinna','Adaeze','Chiamaka'];
    const lastNames  = ['Okonkwo','Eze','Nwachukwu','Obi','Ehigie','Smith','Doe','Johnson','Okafor','Adeyemi','Abubakar','Bello','Salisu','Yusuf','Musa','Ibrahim','Hassan','Afolabi','Olawale','Adeleke'];
    const faculties  = ['Engineering','Computer Science','Mechatronics Engineering','Electrical Engineering','Physics','Mathematics','Information Technology','Biochemistry','Medicine','Law','Economics','Business Administration'];
    const levels     = ['100','200','300','400','500','Postgraduate'];
    const orgs        = ['Google Nigeria','Microsoft Africa','Andela','Flutterwave','Paystack','NITDA','Interswitch','Konga','Covenant University','University of Lagos'];
    const jobTitles   = ['Software Engineer','Data Scientist','Product Manager','UX Designer','DevOps Engineer','Backend Developer','Android Engineer','ML Engineer','Full Stack Developer','Solutions Architect'];
    const talkTitles  = ['Building with the Gemini API','Cloud Native Development on GCP','Flutter for Cross-Platform Apps','AI/ML with TensorFlow','Modern Android Development','Firebase for Rapid Prototyping','Next.js and the App Router','Responsible AI Practices'];
    const talkDescs   = [
      'A practical deep-dive into integrating Google Gemini API into production applications.',
      'How to build and deploy scalable cloud-native apps on GCP using Cloud Run.',
      'Building cross-platform mobile apps with Flutter covering state management.',
      'An introduction to TensorFlow and Keras for real-world ML pipelines.',
      'Best practices for modern Android development including Jetpack Compose.',
    ];
    const techStacks  = ['React, Next.js, TypeScript','Python, FastAPI, PostgreSQL','Flutter, Dart, Firebase','Node.js, Express, MongoDB','Kotlin, Jetpack Compose'];
    const goals       = ['Build a full-stack web application','Learn mobile development','Understand AI/ML concepts','Win Google Solution Challenge'];
    const commitments = ['2-4 hrs/week','4-6 hrs/week','6-8 hrs/week','Full-time commitment'];
    
    // Only speakers and trainees
    const regTypes = ['trainee','trainee','trainee','speaker'];

    const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

    const regItems: { ref: any; data: any }[] = [];

    for (const event of EVENTS) {
      // Seed fewer internal registrations since most are attendees now handled by Bevy
      const count = Math.min((event as any).registeredCount ?? 0, 10); 
      for (let i = 0; i < count; i++) {
        const fName   = pick(firstNames);
        const lName   = pick(lastNames);
        const regType = pick(regTypes);
        const regId   = `reg-${event.id}-${i}`;
        const phone   = `+234${Math.floor(7000000000 + Math.random() * 2999999999)}`;
        const registeredAt = new Date(Date.now() - Math.floor(Math.random() * 60) * 86400000).toISOString();

        let data: Record<string, string> = {
          firstName: fName,
          lastName: lName,
          email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@gmail.com`,
          phone,
        };

        if (regType === 'speaker') {
          const ti = Math.floor(Math.random() * talkTitles.length);
          data = { ...data, organization: pick(orgs), jobTitle: pick(jobTitles), talkTitle: talkTitles[ti], talkDescription: talkDescs[ti % talkDescs.length], linkedin: `https://linkedin.com/in/${fName.toLowerCase()}-${lName.toLowerCase()}` };
        } else {
          data = { ...data, faculty: pick(faculties), level: pick(levels), techStack: pick(techStacks), goals: pick(goals), commitment: pick(commitments) };
        }

        regItems.push({ ref: doc(db, 'gdgoc_registrations', regId), data: { id: regId, eventId: event.id, type: regType, registeredAt, data } });
      }
    }

    await batchWrite(regItems);

    return NextResponse.json({ success: true, message: `Seeded basic collections and ${regItems.length} speaker/trainee registrations across ${EVENTS.length} events` });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
