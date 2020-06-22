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
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get("db"),
      req.language.id
    );

    const head = await LanguageService.getLanguageHead(
      req.app.get("db"),
      req.language.id,
      language.head
    );

    res.json({
      nextWord: head.original,
      totalScore: language.total_score,
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

    const language = await LanguageService.getUsersLanguage(
      req.app.get("db"),
      req.language.id
    );

    const head = await LanguageService.getLanguageHead(
      req.app.get("db"),
      req.language.id,
      language.head
    );

    console.log("LANGUAGE ", language);
    console.log("HEAD ", head);

    //memory value > lower the memory value, the faster it comes back
    //Move the head by the amount of memory value
    //take memory value and multiply by 2
    //Once it is wrong, the value gets incremented by 1
    //move the head of the list by 1

    //determine if the guess was correct
    let isCorrect = guess === head.translation ? true : false;

    // -----------UPDATE CALLS

    //Set the new head
    await LanguageService.setLanguageHead(
      req.app.get("db"),
      head.next,
      isCorrect ? language.totalScore++ : language.totalScore
    );

    await LanguageService.setWordCount(
      req.app.get("db"),
      head.id,
      isCorrect ? head.correct_count++ : head.correct_count,
      isCorrect ? head.incorrect_count : head.incorrect_count++
    );

    // ------------SECOND CALL

    const language2 = await LanguageService.getUsersLanguage(
      req.app.get("db"),
      req.language.id
    );

    const head2 = await LanguageService.getLanguageHead(
      req.app.get("db"),
      req.language.id,
      language2.head
    );

    console.log("NEW LANGUAGE ", head2);
    console.log("NEW HEAD ", head2);

    res.status(200).json({
      nextWord: head2.original,
      totalScore: language.total_score,
      wordCorrectCount: head.correct_count,
      wordIncorrectCount: head.incorrect_count,
      answer: head.translation,
      isCorrect: isCorrect,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = languageRouter;
