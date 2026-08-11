// Creates or updates a user in the admin panel's users table.
// Usage: EMAIL=... PASSWORD=... ROLE=admin|pastor|servidor FULL_NAME=... [PASTOR_NAME=...] \
//   DATABASE_URL=... node scripts/seed-user.mjs

import postgres from "postgres";
import { scryptSync, randomBytes } from "crypto";

const DATABASE_URL = process.env.DATABASE_URL;
const email = (process.env.EMAIL || "").trim().toLowerCase();
const password = process.env.PASSWORD || "";
const role = process.env.ROLE || "servidor";
const fullName = process.env.FULL_NAME || email;
const pastorName = process.env.PASTOR_NAME || null;

const validRoles = ["admin", "pastor", "servidor"];

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL environment variable.");
  process.exit(1);
}
if (!email || !password) {
  console.error("Missing EMAIL or PASSWORD environment variable.");
  process.exit(1);
}
if (!validRoles.includes(role)) {
  console.error(`ROLE must be one of: ${validRoles.join(", ")}`);
  process.exit(1);
}
if (role === "pastor" && !pastorName) {
  console.error(
    "ROLE=pastor requires PASTOR_NAME (must match the name used in pastor_availability, e.g. 'Ps. Carlos Guardela').",
  );
  process.exit(1);
}

function hashPassword(plain) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(plain, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function seedUser() {
  const sql = postgres(DATABASE_URL);

  try {
    const passwordHash = hashPassword(password);

    await sql`
      INSERT INTO admin_users (email, password_hash, full_name, role, pastor_name)
      VALUES (${email}, ${passwordHash}, ${fullName}, ${role}, ${pastorName})
      ON CONFLICT (email)
      DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        pastor_name = EXCLUDED.pastor_name
    `;

    console.log(`Usuario listo: ${email} / ${password} (rol: ${role})`);
  } finally {
    await sql.end();
  }
}

seedUser();
