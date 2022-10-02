const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validate = require("../Validations/validateSignup");

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const newUser = new User({
    username,
    email,
    password,
  });
  const existedUser = await User.findOne({ email });

  const error = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (existedUser) return res.status(400).send("user already registered");

  const salt = await bcrypt.genSalt(12);
  newUser.password = await bcrypt.hash(newUser.password, salt);

  const user = await newUser.save();
  return res.status(200).json(user);
});

module.exports = router;
