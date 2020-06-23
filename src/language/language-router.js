const express = require("express");
const LanguageService = require("./language-service");
const { requireAuth } = require("../middleware/jwt-auth");
const jsonBodyParser = express.json();
const languageRouter = express.Router();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get("db"),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`,
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get("/", async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get("db"),
      req.language.id
    );

    res.json({
      language: req.language,
      words,
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get("/head", async (req, res, next) => {
  //Need to redo this with Alex's joins

  try {
    const head = await LanguageService.getLanguageHead(
      req.app.get("db"),
      req.language.id
    );

    res.json({
      nextWord: head.original,
      totalScore: head.total_score,
      wordCorrectCount: head.correct_count,
      wordIncorrectCount: head.incorrect_count,
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.post("/guess", jsonBodyParser, async (req, res, next) => {
  try {
    const { guess } = req.body;
    if (!guess) {
      return res.status(400).json({ error: "Missing 'guess' in request body" });
    }

    const languageAndHeadWord = await LanguageService.getLanguageHead(
      req.app.get("db"),
      req.language.id
    );

    const allWords = await LanguageService.getLanguageWords(
      req.app.get("db"),
      req.language.id
    );

    //check if correct
    let isCorrect = guess === languageAndHeadWord.translation ? true : false;

    //destruct all values
    let m_memory_value;
    let m_total_score = languageAndHeadWord.total_score;
    let m_wordCorrectCount = languageAndHeadWord.correct_count;
    let m_wordIncorrectCount = languageAndHeadWord.incorrect_count;
    let m_answer = languageAndHeadWord.translation;
    let m_nextWord = allWords.find(
      (word) => word.id === languageAndHeadWord.next
    );
    let m_head = languageAndHeadWord.next;
    if (isCorrect) {
      m_memory_value = languageAndHeadWord.memory_value * 2;
      m_total_score++;
      m_wordCorrectCount++;
    } else {
      m_memory_value = 1;
      m_wordIncorrectCount++;
    }

    //Iterate through the chain and insert in the right place
    let iteratedWord = allWords.find(
      (word) => word.id === languageAndHeadWord.id
    );
    let nextWordId;
    for (let i = 0; i < m_memory_value; i++) {
      nextWordId = iteratedWord.next;
      if (nextWordId === null) {
        break;
      }
      iteratedWord = allWords.find((word) => word.id === nextWordId);
    }
    let iteratedWordId = iteratedWord.id;
    let iteratedWordNext = languageAndHeadWord.id;
    let m_word_next = nextWordId;

    //POST Updates:
    await LanguageService.setUsersLanguage(
      req.app.get("db"),
      req.language.id,
      m_head,
      m_total_score
    );

    await LanguageService.setGuessWord(
      req.app.get("db"),
      req.language.id,
      m_word_next,
      m_memory_value,
      m_wordCorrectCount,
      m_wordIncorrectCount
    );

    await LanguageService.setWordInsert(
      req.app.get("db"),
      iteratedWordId,
      iteratedWordNext
    );

    //response
    res.status(200).json({
      nextWord: m_nextWord.original,
      totalScore: m_total_score,
      wordCorrectCount: m_nextWord.correct_count, //next word's correct count
      wordIncorrectCount: m_nextWord.incorrect_count, //next word's incorrect count
      answer: m_answer,
      isCorrect: isCorrect,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = languageRouter;
