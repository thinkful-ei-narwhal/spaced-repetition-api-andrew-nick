const express = require("express");
const LanguageService = require("./language-service");
const { requireAuth } = require("../middleware/jwt-auth");
const LinkedList = require("./../datastructures/LinkedList");
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
    console.log(words);
    console.log(req.language);

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

    const head = await LanguageService.getLanguageHead(
      req.app.get("db"),
      req.language.id
    );

    const allWords = await LanguageService.getLanguageWords(
      req.app.get("db"),
      req.language.id
    );

    //populate linked list
    const LL = new LinkedList();
    let word = head;
    while (word !== null) {
      LL.insertLast(word);
      if (word.next === null) {
        break;
      }
      word = allWords.find((wordInList) => wordInList.id === word.next);
    }

    // LL.printAllNodes();

    //check if correct
    guessCheck = guess
      .toLowerCase()
      .replace(/\s/g, "")
      .replace(/[^\w\s]|_/g, "")
      .replace(/\s+/g, " ");
    translationCheck = head.translation
      .toLowerCase()
      .replace(/\s/g, "")
      .replace(/[^\w\s]|_/g, "")
      .replace(/\s+/g, " ");
    let isCorrect = guessCheck === translationCheck ? true : false;

    //update Head
    const updatedHead = { ...head };
    let m_total_score = head.total_score;
    if (isCorrect) {
      updatedHead.memory_value = head.memory_value * 2;
      updatedHead.correct_count = head.correct_count + 1;
      m_total_score++;
    } else {
      updatedHead.memory_value = 1;
      updatedHead.incorrect_count = head.incorrect_count + 1;
    }

    //Update word, shift by memory value, update head
    LL.shiftHead();
    if (updatedHead.memory_value > LL.size()) {
      LL.insertLast(updatedHead);
    } else {
      LL.insertAt(updatedHead, updatedHead.memory_value);
    }

    //updates Tables
    await LanguageService.setTables(
      req.app.get("db"),
      req.language.id,
      m_total_score,
      LL.createArray()
    );

    //response
    let m_nextWord = allWords.find((word) => word.id === head.next);
    res.status(200).json({
      nextWord: m_nextWord.original,
      totalScore: m_total_score,
      wordCorrectCount: m_nextWord.correct_count,
      wordIncorrectCount: m_nextWord.incorrect_count,
      answer: head.translation,
      isCorrect: isCorrect,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = languageRouter;
