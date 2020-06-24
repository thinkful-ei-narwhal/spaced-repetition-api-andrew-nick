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

  getLanguages(db) { return db .from("language") .select( "language.id", "language.name", "language.user_id", "language.head", "language.total_score" ); },

  setUsersLanguage(db, id, newHead, totalScore) {
    return db
      .from("language")
      .select(
        "language.id",
        "language.name",
        "language.user_id",
        "language.head",
        "language.total_score"
      )
      .where({ id })
      .first()
      .update({ head: newHead, total_score: totalScore });
  },

  setGuessWord(db, id, next, memory_value, correct_count, incorrect_count) {
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
      .where({ id })
      .first()
      .update({ next, memory_value, correct_count, incorrect_count });
  },

  setWordInsert(db, id, next) {
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
      .where({ id })
      .first()
      .update({ next });
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
};

module.exports = LanguageService;
