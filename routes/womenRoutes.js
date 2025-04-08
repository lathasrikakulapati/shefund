const express = require("express");
const router = express.Router();
const womenController = require("../controllers/womenController");

router.post("/register", womenController.register);
router.post("/login", womenController.login);
router.post("/loan", womenController.applyLoan);
router.post("/request-loan", womenController.applyLoan);
router.get("/loans", womenController.getLoans);

module.exports = router;
