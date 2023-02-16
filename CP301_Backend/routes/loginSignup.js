// Library Imports
const express = require("express");

// Controller imports
const loginSignupMailGenerator = require("../controllers/mailsender");
const { authorize } = require("../controllers/otp");

// Initializing router
const router = express.Router();

// Setting up login routes

// takes: {email} 
// returns: OK + message if successful
router.route("/").post(loginSignupMailGenerator);

// takes: {email, role, otp} 
// returns: OK + {email, role, token, message} if successful
router.route("/verify").post(authorize);

module.exports = router;
