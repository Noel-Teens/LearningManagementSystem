app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

   const user = await User.findOne({ email, password });
   if (!user) return res.status(401).json({ message: "Invalid credentials" });

   res.json({
     token: "dummy-token",
     role: user.role,
   });
 });
