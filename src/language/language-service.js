const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from("language")
      .select(
        "language.id",
        "language.name",
        "language.user_id",
        "language.head",
        "language.total_score"
      )
      .where("language.user_id", user_id)
      .first();
  },

  getLanguages(db) {
    return db
      .from("language")
      .select(
        "language.id",
        "language.name",
        "language.user_id",
        "language.head",
        "language.total_score"
      );
  },

  setLanguage(db, id, head, total_score) {
    return db
      .from("language")
      .select("id", "name", "user_id", "head", "total_score")
      .where({ id })
      .update({ head: head, total_score });
  },

  getLanguageHead(db, language_id) {
    return db
      .from("word")
      .select(
        "word.id",
        "word.language_id",
        "word.original",
        "word.translation",
        "word.next",
        "word.memory_value",
        "word.correct_count",
        "word.incorrect_count",
        "language.total_score",
        "language.head"
      )
      .leftJoin("language", "language.head", "word.id")
      .where({ "language.id": language_id })
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from("word")
      .select(
        "id",
        "language_id",
        "original",
        "translation",
        "next",
        "memory_value",
        "correct_count",
        "incorrect_count"
      )
      .where({ language_id });
  },

  setTables(db, language_id, total_score, wordArr) {
    return db.transaction(async (block) => {
      return Promise.all([
        block("language")
          .where({ id: language_id })
          .update({ head: wordArr[0].id, total_score }),

        ...wordArr.map((word, index) => {
          const wordId = index + 1;
          word.next =
            wordId >= wordArr.length ? null : (word.next = wordArr[wordId].id);
          return block("word")
            .select(
              "id",
              "language_id",
              "original",
              "translation",
              "next",
              "memory_value",
              "correct_count",
              "incorrect_count"
            )
            .where({ id: word.id })
            .update({
              id: word.id,
              language_id: word.language_id,
              original: word.original,
              translation: word.transaction,
              next: word.next,
              memory_value: word.memory_value,
              correct_count: word.correct_count,
              incorrect_count: word.incorrect_count,
            });
        }),
      ]);
    });
  },
};

module.exports = LanguageService;
