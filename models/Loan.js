const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    women_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"]
    },
    loan_amount: {
      type: Number,
      required: true,
      min: [1, "Loan amount must be greater than 0"]
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "funded"],
      default: "pending"
    },
  
    
    investor_email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"]
    },
    ml_prediction: {
      type: String,
      enum: ['genuine', 'not genuine'],
      default: 'genuine'
    }
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

module.exports = mongoose.model("Loan", loanSchema);
