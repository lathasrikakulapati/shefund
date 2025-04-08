
const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const axios = require('axios');

// Submit loan request (Woman)
router.post('/apply', async (req, res) => {
  try {
    const { women_email, loan_amount, description } = req.body;

    // Example features to be passed to ML API (replace with actual logic if needed)
    const features = [loan_amount, 0.5, 0.3, 1.0, 0.8];

    // Call ML API
    const mlResponse = await axios.post('http://localhost:5000/predict', {
      features: features
    });

    const prediction = mlResponse.data.prediction;

    // If ML model predicts "not genuine", reject loan
    if (prediction === 'not genuine') {
      return res.status(400).json({ 
        error: 'Loan rejected by ML model', 
        prediction: prediction 
      });
    }

    // Else, create and save the loan
    const loan = new Loan({
      ...req.body,
      ml_prediction: prediction
    });

    await loan.save();
    res.status(201).json({ message: 'Loan request submitted with ML prediction', prediction });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Loan request failed', details: err.message });
  }
});



// Get loans for a woman
router.get('/woman/:email', async (req, res) => {
  try {
    const loans = await Loan.find({ womanEmail: req.params.email });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch loans' });
  }
});

// Get all pending loans for investors
router.get('/pending', async (req, res) => {
  try {
    const loans = await Loan.find({ status: 'pending' });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch pending loans' });
  }
});

// Approve a loan
router.post('/approve', async (req, res) => {
  const { loanId, investorEmail } = req.body;
  try {
    await Loan.findByIdAndUpdate(loanId, {
      status: 'approved',
      investorEmail: investorEmail
    });
    res.json({ message: 'Loan approved' });
  } catch (err) {
    res.status(500).json({ error: 'Approval failed' });
  }
});

// Get loans funded by an investor
router.get('/investor/:email', async (req, res) => {
  try {
    const loans = await Loan.find({ investorEmail: req.params.email });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch funded loans' });
  }
});

module.exports = router;
