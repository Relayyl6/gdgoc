import { EVENTS, BLOG_POSTS, TEAM_MEMBERS } from './lib/data';
import { getCollection, saveCollection } from './lib/db';

const fallbackShowcase = [
  { id: 'sc-seed-1', eventId: 'flutter-forward-extended-2026', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop', status: 'approved', caption: 'Cross-platform reactive state engines live demonstration on Android & Desktop.', title: 'Flutter Live Build Session', aspect: 'aspect-[4/3]' },
  { id: 'sc-seed-2', eventId: 'cloud-run-serverless-2026', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop', status: 'approved', caption: 'Deploying serverless microservices with real-time autoscaling and Cloud SQL integration.', title: 'Cloud Run Docker Lab', aspect: 'aspect-[16/10]' },
];

const fallbackProjects = [
  {
    id: 'proj-1', title: 'Uniben Nav App', description: 'Campus navigation tool.', category: 'Mobile App', team: ['Samuel', 'John'], image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800', tech: ['Flutter', 'Firebase'], demoUrl: '#', status: 'approved'
  }
];

async function seed() {
  console.log("Checking gdgoc_events...");
  let events = await getCollection("gdgoc_events");
  if (!events || events.length === 0) {
    console.log("Seeding EVENTS...");
    await saveCollection("gdgoc_events", EVENTS);
  }

  console.log("Checking gdgoc_blog_posts...");
  let blogs = await getCollection("gdgoc_blog_posts");
  if (!blogs || blogs.length === 0) {
    console.log("Seeding BLOG_POSTS...");
    await saveCollection("gdgoc_blog_posts", BLOG_POSTS);
  }

  console.log("Checking gdgoc_team...");
  let team = await getCollection("gdgoc_team");
  if (!team || team.length === 0) {
    console.log("Seeding TEAM_MEMBERS...");
    await saveCollection("gdgoc_team", TEAM_MEMBERS);
  }

  console.log("Checking gdgoc_showcase...");
  let showcase = await getCollection("gdgoc_showcase");
  if (!showcase || showcase.length === 0) {
    console.log("Seeding SHOWCASE...");
    await saveCollection("gdgoc_showcase", fallbackShowcase);
  }

  console.log("Checking gdgoc_community_projects...");
  let projects = await getCollection("gdgoc_community_projects");
  if (!projects || projects.length === 0) {
    console.log("Seeding PROJECTS...");
    await saveCollection("gdgoc_community_projects", fallbackProjects);
  }
  
  console.log("Done!");
}

seed();
