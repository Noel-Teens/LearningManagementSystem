app.post("/auth/register", async (req, res) => {
  const { email, password, role } = req.body;

  const user = new User({
    email,
    password,
    role,
  });
  console.log("REQ BODY:", req.body);
console.error(err);

  await user.save();
  res.json({ message: "User registered" });
});
