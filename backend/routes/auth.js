const router = require("express").Router();
const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(409).send({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = user.generateAuthToken();
    res.status(201).send({ token, name: user.name });
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).send({ message: "Invalid email or password" });

    const token = user.generateAuthToken();
    res.status(200).send({ token, name: user.name });
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;
