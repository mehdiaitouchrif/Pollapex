const Survey = require("../models/survey");
const Response = require("../models/response");
const Question = require("../models/question");

async function createDefaultData(user) {
  const questions = [
    {
      question: "What is your age?",
      optional: false,
      type: "singleChoice",
      choices: [
        "Under 18",
        "18-24",
        "25-34",
        "35-44",
        "45-54",
        "55-64",
        "65 or over",
      ],
    },
    {
      question: "Which gender do you identify with?",
      optional: false,
      type: "singleChoice",
      choices: ["Male", "Female", "Prefer not to say"],
    },
    {
      question: "Do you currently own our product?",
      optional: false,
      type: "singleChoice",
      choices: ["Yes", "No"],
    },
    {
      question: "How satisfied are you with our product?",
      optional: false,
      type: "rating",
    },
    {
      question: "What features would you like to see in our product?",
      optional: true,
      type: "paragraph",
    },
  ];

  const insertedQuestions = await Question.insertMany(questions);
  const questionIds = insertedQuestions.map((q) => q._id);

  const defaultSurvey = await Survey.create({
    title: "Default Example Survey",
    description:
      "Participate in our Market Research Survey and help us tailor our products to your preferences. Share your valuable insights, from product satisfaction to feature suggestions. Your opinions matter, and together, we can shape the future of our offerings. Join us today!",
    owner: user._id,
    questions: questionIds,
  });

  // Insert responses
  await Response.insertMany([
    {
      survey: defaultSurvey._id,
      answers: [
        { question: questionIds[0], answer: "25-34" },
        { question: questionIds[1], answer: "Male" },
        { question: questionIds[2], answer: "Yes" },
        { question: questionIds[3], answer: 4 },
        {
          question: questionIds[4],
          answer: "I would like to see more color options.",
        },
      ],
      meta: {
        ipAddress: "192.168.1.101",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
      },
    },
    {
      survey: defaultSurvey._id,
      answers: [
        { question: questionIds[0], answer: "18-24" },
        { question: questionIds[1], answer: "Female" },
        { question: questionIds[2], answer: "No" },
        { question: questionIds[3], answer: 5 },
        {
          question: questionIds[4],
          answer: "The product quality is excellent.",
        },
      ],
      meta: {
        ipAddress: "192.168.1.102",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
      },
    },
    {
      survey: defaultSurvey._id,
      answers: [
        { question: questionIds[0], answer: "35-44" },
        { question: questionIds[1], answer: "Other" },
        { question: questionIds[2], answer: "No" },
        { question: questionIds[3], answer: 3 },
        {
          question: questionIds[4],
          answer: "The pricing is too high.",
        },
      ],
      meta: {
        ipAddress: "192.168.1.103",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
      },
    },
    {
      survey: defaultSurvey._id,
      answers: [
        { question: questionIds[0], answer: "45-54" },
        { question: questionIds[1], answer: "Female" },
        { question: questionIds[2], answer: "Yes" },
        { question: questionIds[3], answer: 2 },
        {
          question: questionIds[4],
          answer: "The customer service is excellent.",
        },
      ],
      meta: {
        ipAddress: "192.168.1.104",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
      },
    },
    {
      survey: defaultSurvey._id,
      answers: [
        { question: questionIds[0], answer: "18-24" },
        { question: questionIds[1], answer: "Male" },
        { question: questionIds[2], answer: "Yes" },
        { question: questionIds[3], answer: 5 },
        {
          question: questionIds[4],
          answer: "I love the product design.",
        },
      ],
      meta: {
        ipAddress: "192.168.1.105",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
      },
    },
    {
      survey: defaultSurvey._id,
      answers: [
        { question: questionIds[0], answer: "55+" },
        { question: questionIds[1], answer: "Other" },
        { question: questionIds[2], answer: "No" },
        { question: questionIds[3], answer: 4 },
        {
          question: questionIds[4],
          answer: "I would recommend this product to others.",
        },
      ],
      meta: {
        ipAddress: "192.168.1.106",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
      },
    },
    {
      survey: defaultSurvey._id,
      answers: [
        { question: questionIds[0], answer: "25-34" },
        { question: questionIds[1], answer: "Male" },
        { question: questionIds[2], answer: "No" },
        { question: questionIds[3], answer: 3 },
        {
          question: questionIds[4],
          answer: "The product is not user-friendly.",
        },
      ],
      meta: {
        ipAddress: "192.168.1.107",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
      },
    },
    {
      survey: defaultSurvey._id,
      answers: [
        { question: questionIds[0], answer: "18-24" },
        { question: questionIds[1], answer: "Female" },
        { question: questionIds[2], answer: "Yes" },
        { question: questionIds[3], answer: 5 },
        {
          question: questionIds[4],
          answer: "I have no complaints about the product.",
        },
      ],
      meta: {
        ipAddress: "192.168.1.108",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
      },
    },
  ]);
}

module.exports = createDefaultData;
