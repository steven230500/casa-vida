// Bulk-imports people from a cleaned JSON file (array of PersonInput-shaped
// objects) into the people table.
// Usage: DATABASE_URL=... node scripts/import-people.mjs path/to/people.json

import { readFileSync } from "fs";
import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;
const filePath = process.argv[2];

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL environment variable.");
  process.exit(1);
}
if (!filePath) {
  console.error("Usage: node scripts/import-people.mjs path/to/people.json");
  process.exit(1);
}

const records = JSON.parse(readFileSync(filePath, "utf-8"));

async function main() {
  const sql = postgres(DATABASE_URL);
  try {
    let inserted = 0;
    for (const r of records) {
      await sql`
        INSERT INTO people (full_name, email, phone, birthdate, status, neighborhood, caregiver_name, notes)
        VALUES (${r.fullName}, ${r.email}, ${r.phone}, ${r.birthdate}, ${r.status}, ${r.neighborhood}, ${r.caregiverName}, ${r.notes})
      `;
      inserted += 1;
    }
    console.log(`Imported ${inserted} people.`);
  } finally {
    await sql.end();
  }
}

main();
