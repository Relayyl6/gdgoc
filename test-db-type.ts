import { db } from './lib/firebase';
console.log("db.type:", (db as any).type);
console.log("db.app exists:", !!(db as any).app);
console.log("db keys:", Object.keys(db));
