import { getCollection } from './lib/db';

async function test() {
  console.log("Fetching events from db...");
  const events = await getCollection('gdgoc_events');
  console.log("Events found:", events.length);
  if (events.length > 0) {
    console.log("First event:", events[0].title);
  } else {
    console.log("No events returned!");
  }
}
test();
