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
  (1, 1, 'donde esta el bano', 'where is the bathroom', 2),
  (2, 1, 'disculpe', 'excuse me', 3),
  (3, 1, 'estoy perdido', 'I am lost', 4),
  (4, 1, 'aqui', 'here', 5),
  (5, 1, 'una bebida', 'a drink', 6),
  (6, 1, 'cuanto', 'how much', 7),
  (7, 1, 'por cuanto tiempo', 'how long', 8),
  (8, 1, 'por favor', 'please', 9),
  (9, 1, 'como esta', 'how are you', 10),
  (10, 1, 'como te llamas', 'what is your name', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
