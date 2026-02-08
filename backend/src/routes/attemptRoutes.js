const express = require("express");
const router = express.Router();
const Attempt = require("../models/Attempt");

/* save attempt */
router.post("/", async (req, res) => {
  const a = new Attempt(req.body);
  await a.save();
  res.json(a);
});

/* list attempts */
router.get("/", async (req, res) => {
  const data = await Attempt
    .find()
    .sort({ takenAt: -1 });

  res.json(data);
});

module.exports = router;
