import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';

// Need the config inline since we are running a raw node script
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Events data needed for seeding registrations
const EVENTS = [
  { id: 'build-with-ai-2026', registeredCount: 173 },
  { id: 'devfest-uniben-2026', registeredCount: 421 },
  { id: 'solution-challenge-info-2026', registeredCount: 89 },
  { id: 'web-fundamentals-jam-2026', registeredCount: 52 },
];

async function seed() {
  console.log("Seeding started...");
  try {
    // Clear old registrations
    const existingRegs = await getDocs(collection(db, 'gdgoc_registrations'));
    let count = 0;
    for (const d of existingRegs.docs) {
      if (d.id.startsWith('reg-')) {
        await deleteDoc(doc(db, 'gdgoc_registrations', d.id));
        count++;
      }
    }
    console.log(`Cleared ${count} old registrations.`);

    // Rich varied seed data
    const firstNames = ['Ada', 'Chidi', 'Ngozi', 'Emeka', 'Praise', 'John', 'Jane', 'Alex', 'Sarah', 'Michael', 'David', 'Joy', 'Grace', 'Tobi', 'Chioma', 'Kemi', 'Femi', 'Amaka', 'Bola', 'Seun', 'Tunde', 'Yetunde', 'Gbenga', 'Funke', 'Uche', 'Ike', 'Nnenna', 'Obinna', 'Adaeze', 'Chiamaka'];
    const lastNames = ['Okonkwo', 'Eze', 'Nwachukwu', 'Obi', 'Ehigie', 'Smith', 'Doe', 'Johnson', 'Okafor', 'Adeyemi', 'Abubakar', 'Bello', 'Salisu', 'Yusuf', 'Musa', 'Ibrahim', 'Hassan', 'Afolabi', 'Olawale', 'Adeleke'];
    const faculties = ['Engineering', 'Computer Science', 'Mechatronics Engineering', 'Electrical Engineering', 'Physics', 'Mathematics', 'Information Technology', 'Biochemistry', 'Medicine', 'Law', 'Economics', 'Business Administration'];
    const levels = ['100', '200', '300', '400', '500', 'Postgraduate'];
    const experiences = ['None — complete beginner', 'Beginner — built a few small projects', 'Intermediate — 1-2 years experience', 'Advanced — 3+ years experience'];
    const hearAbouts = ['Social Media (Instagram/Twitter)', 'WhatsApp Group', 'Friend or Colleague', 'Email Newsletter', 'GDGOC Website', 'Departmental Notice Board', 'Student Union Announcement'];
    const orgs = ['Google Nigeria', 'Microsoft Africa', 'Andela', 'Flutterwave', 'Paystack', 'NITDA', 'Interswitch', 'Konga', 'Covenant University', 'University of Lagos'];
    const jobTitles = ['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'DevOps Engineer', 'Backend Developer', 'Android Engineer', 'ML Engineer', 'Full Stack Developer', 'Solutions Architect'];
    const talkTitles = ['Building with the Gemini API', 'Cloud Native Development on GCP', 'Flutter for Cross-Platform Apps', 'AI/ML with TensorFlow', 'Modern Android Development', 'Firebase for Rapid Prototyping', 'Next.js and the App Router', 'Responsible AI Practices'];
    const talkDescs = [
      'A practical deep-dive into integrating Google Gemini API into production applications. We will cover authentication, prompt engineering, streaming responses, and safety filters.',
      'How to build and deploy scalable cloud-native apps on Google Cloud Platform using Cloud Run, Cloud SQL, and Pub/Sub.',
      'Building cross-platform mobile apps with Flutter. We cover state management, navigation, and publishing to both Play Store and App Store.',
      'An introduction to TensorFlow and Keras for building real-world ML pipelines — from data preparation to model deployment.',
      'Best practices for modern Android development including Jetpack Compose, MVVM architecture, and integrating Firebase.',
    ];
    const techStacks = ['React, Next.js, TypeScript', 'Python, FastAPI, PostgreSQL', 'Flutter, Dart, Firebase', 'Node.js, Express, MongoDB', 'Kotlin, Jetpack Compose', 'TensorFlow, Keras, Python', 'Vue.js, Nuxt, Tailwind CSS', 'Java, Spring Boot, MySQL'];
    const goals = [
      'Build a full-stack web application by end of programme',
      'Learn mobile development fundamentals and ship my first app',
      'Understand AI/ML concepts and apply them to real-world problems',
      'Contribute to open source projects within 3 months',
      'Land my first tech internship at a reputable company',
      'Win Google Solution Challenge with my team this year',
      'Master Cloud development and earn a Google Cloud certification',
    ];
    const commitments = ['2-4 hrs/week', '4-6 hrs/week', '6-8 hrs/week', 'Full-time commitment'];
    const regTypes = ['attendee', 'attendee', 'attendee', 'attendee', 'attendee', 'trainee', 'trainee', 'speaker'];

    let addedCount = 0;
    for (const event of EVENTS) {
      if (event.registeredCount && event.registeredCount > 0) {
        for (let i = 0; i < event.registeredCount; i++) {
          const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
          const fName = pick(firstNames);
          const lName = pick(lastNames);
          const regType = pick(regTypes);
          const regId = `reg-${event.id}-${i}`;
          const phone = `+234${Math.floor(7000000000 + Math.random() * 2999999999)}`;
          const daysAgo = Math.floor(Math.random() * 60);
          const registeredAt = new Date(Date.now() - daysAgo * 86400000).toISOString();

          let data = {
            firstName: fName,
            lastName: lName,
            email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@gmail.com`,
            phone,
          };

          if (regType === 'attendee') {
            data = { ...data,
              faculty: pick(faculties),
              level: pick(levels),
              experience: pick(experiences),
              hearAbout: pick(hearAbouts),
            };
          } else if (regType === 'speaker') {
            const talkIdx = Math.floor(Math.random() * talkTitles.length);
            data = { ...data,
              organization: pick(orgs),
              jobTitle: pick(jobTitles),
              talkTitle: talkTitles[talkIdx],
              talkDescription: talkDescs[talkIdx % talkDescs.length],
              linkedin: `https://linkedin.com/in/${fName.toLowerCase()}-${lName.toLowerCase()}`,
            };
          } else {
            data = { ...data,
              faculty: pick(faculties),
              level: pick(levels),
              techStack: pick(techStacks),
              goals: pick(goals),
              commitment: pick(commitments),
            };
          }

          await setDoc(doc(db, 'gdgoc_registrations', regId), { id: regId, eventId: event.id, type: regType, registeredAt, data });
          addedCount++;
        }
      }
    }
    console.log(`Seeded ${addedCount} new rich registrations successfully!`);
  } catch (error) {
    console.error("Seed error:", error);
  }
}

seed();
