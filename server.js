const express = require("express"); 
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const womenRoutes = require("./routes/womenRoutes");
const investorRoutes = require("./routes/investorRoutes");
const connectDB = require("./config/db");
const Loan = require("./models/Loan"); // Loan model for custom routes

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/women", womenRoutes);
app.use("/api/investor", investorRoutes);

// ✅ Fixed field name: Fetch loans submitted by a specific woman
app.get("/api/women/my-loans", async (req, res) => {
  const { email } = req.query;
  try {
    const loans = await Loan.find({ women_email: email }); // ✅ FIXED: use 'women_email'
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch loans." });
  }
});


// Serve frontend static files
app.use(express.static(path.join(__dirname, "public")));

// Fallback route to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
