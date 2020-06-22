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

  //get language by ID
  //get language head >

  setLanguageHead(db, newHead, totalScore) {
    return db
      .from("language")
      .select(
        "language.id",
        "language.name",
        "language.user_id",
        "language.head",
        "language.total_score"
      )
      .first()
      .update({ head: newHead, total_score: totalScore });
  },

  setWordCount(db, language_id, id, correct_count, incorrect_count) {
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
      .where({ language_id, id })
      .update({ correct_count, incorrect_count });
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
        "language.total_score"
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
};

module.exports = LanguageService;
