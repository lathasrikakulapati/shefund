const WomenUser = require("../models/WomenUser");
const Loan = require("../models/Loan");

// Register a new woman
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await WomenUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new WomenUser({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// Woman login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await WomenUser.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", email });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

// Apply for a loan
// Apply for a loan
exports.applyLoan = async (req, res) => {
  const { email, amount, description } = req.body;

  try {
    console.log("Backend received loan request:", req.body);
    const loan = new Loan({
      women_email: email, // 🔧 FIXED FIELD NAME (was woman_email)
      loan_amount: amount,
      description,
      status: "pending",
    });

    await loan.save();
    res.status(201).json({ message: "Loan application submitted successfully" });
  } catch (err) {
    console.error("Loan request error:", err);
    res.status(500).json({ error: "Loan request failed" });
  }
};



// Get all loans for a woman
exports.getLoans = async (req, res) => {
  const { email } = req.query;

  try {
    const loans = await Loan.find({ women_email: email }); // ✅ FIXED
    res.status(200).json(loans);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch loans" });
  }
};
