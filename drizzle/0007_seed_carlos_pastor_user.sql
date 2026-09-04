INSERT INTO "admin_users" ("email", "password_hash", "full_name", "role", "pastor_name") VALUES
  ('guardelacarlos@gmail.com', '3c417ef466e199d7a8bd9dd6756afba1:829b5740e788e8a76ad43d304255939644ccbafb9c3a89f70ad6fc33680bd158dc9401f695e82987baab35fbd24fdc3b2100dab4f64a8d69cae237710e145001', 'Carlos Guardela', 'pastor', 'Carlos Guardela')
ON CONFLICT ("email") DO NOTHING;
