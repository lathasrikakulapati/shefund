const InvestorUser = require("../models/InvestorUser");
const Loan = require("../models/Loan");

// Investor Registration
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existingUser = await InvestorUser.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists. Please login." });
    }

    const newUser = new InvestorUser({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
};

// Investor Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await InvestorUser.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", email });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};

// Get all pending loans
exports.pendingLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ status: "pending" }).sort({ createdAt: -1 });
    res.status(200).json(loans);
  } catch (err) {
    console.error("Error fetching pending loans:", err);
    res.status(500).json({ error: "Failed to fetch pending loans" });
  }
};

// Get all loans funded by this investor
exports.myLoans = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Investor email is required" });
  }

  try {
    const loans = await Loan.find({ investor_email: email });
    res.status(200).json(loans);
  } catch (err) {
    console.error("Error fetching funded loans:", err);
    res.status(500).json({ error: "Failed to fetch funded loans" });
  }
};

// Fund a loan
exports.fundLoan = async (req, res) => {
  const { loanId, investor_email } = req.body;

  if (!loanId || !investor_email) {
    return res.status(400).json({ error: "Loan ID and investor email are required" });
  }

  try {
    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    if (loan.status !== "pending") {
      return res.status(400).json({ error: "Loan is not in a pending state" });
    }

    loan.status = "funded";
    loan.investor_email = investor_email;
    await loan.save();

    res.status(200).json({ message: "Loan funded successfully" });
  } catch (err) {
    console.error("Error funding loan:", err);
    res.status(500).json({ error: "Funding failed due to server error" });
  }
};
