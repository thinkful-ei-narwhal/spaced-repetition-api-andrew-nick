BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Spanish', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, '¿Dønde estå el baño?', 'Where is the bathroom?', 2),
  (2, 1, 'Disculpe', 'Excuse me', 3),
  (3, 1, 'Estoy perdido', 'I am lost', 4),
  (4, 1, '¿Cømo te llamas?', 'What is your name?', 5),
  (5, 1, 'una bebida', 'a drink', 6),
  (6, 1, '¿Cuånto cuesta?', 'How much is it?', 7),
  (7, 1, 'Yo (no) entiendo', 'I do not understand', 8),
  (8, 1, 'Por favor', 'please', 9),
  (9, 1, '¿Cømo estå?', 'How are you?', 10),
  (10, 1, 'Mucho gusto', 'Nice to meet you', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
