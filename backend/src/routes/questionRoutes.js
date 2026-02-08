const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

/* GET all */
router.get("/", async (req, res) => {
  const data = await Question.find();
  res.json(data);
});

/* ADD */
router.post("/", async (req, res) => {
  const q = new Question(req.body);
  await q.save();
  res.json(q);
});

/* DELETE */
router.delete("/:id", async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

/* UPDATE */
router.put("/:id", async (req, res) => {
  const q = await Question.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(q);
});

module.exports = router;
