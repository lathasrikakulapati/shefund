const express = require("express");
const router = express.Router();
const investorController = require("../controllers/investorController");

// Investor registration
router.post("/register", investorController.register);

// Investor login
router.post("/login", investorController.login);

// Get all pending loan requests
router.get("/pending-loans", investorController.pendingLoans);

// Get loans funded by a specific investor
router.get("/my-loans", investorController.myLoans);

// Approve (fund) a loan request
router.post("/fund", investorController.fundLoan);

module.exports = router;
