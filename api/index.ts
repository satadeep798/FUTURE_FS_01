import express from "express";

const app = express();
app.use(express.json());

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  console.log("Contact form submission:", { name, email, message });
  res.json({ success: true, message: "Message received!" });
});

export default app;
