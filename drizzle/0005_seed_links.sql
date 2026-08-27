-- Seeds /enlaces with the real, already-in-use Casa Vida links (same URLs
-- as lib/data.ts's socialLinks + youtubeChannel) so the page isn't empty
-- on first deploy. Not placeholder data - these are live production links.
INSERT INTO "links" ("title", "url", "icon", "order", "active") VALUES
  ('Nuestra web', 'https://casavidactg.com', 'website', 0, true),
  ('Síguenos en Instagram', 'https://instagram.com/casavidactg', 'instagram', 1, true),
  ('Canal de YouTube', 'https://youtube.com/@casavidatv', 'youtube', 2, true),
  ('Canal de WhatsApp', 'https://whatsapp.com/channel/0029VafmGVF2f3EMMBIqLt0n', 'whatsapp', 3, true);
