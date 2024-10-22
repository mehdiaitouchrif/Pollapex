const Subscriber = require("../models/subscriber");

exports.addSubscriberEmail = async (req, res, next) => {
  const { email } = req.body;

  console.log(email);
  try {
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      const error = new Error("Email is already subscribed");
      error.statusCode = 400;
      throw error;
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    res.status(201).json({ message: "Subscription successful!" });
  } catch (error) {
    next(error);
  }
};
