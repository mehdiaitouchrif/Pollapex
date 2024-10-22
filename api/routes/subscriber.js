const express = require("express");
const { addSubscriberEmail } = require("../controllers/subscriber");
const router = express.Router();

router.post("/", addSubscriberEmail);

module.exports = router;
