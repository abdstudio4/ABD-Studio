const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let otpStore = {}; // temporary storage

// OTP generate function
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP
app.post("/send-otp", (req, res) => {
  const { phone } = req.body;

  const otp = generateOTP();

  // store OTP with expiry (2 min)
  otpStore[phone] = {
    otp,
    expires: Date.now() + 2 * 60 * 1000,
  };

  console.log(`OTP for ${phone}: ${otp}`); // real app me SMS API use hoti hai

  res.json({ message: "OTP sent successfully" });
});

// Verify OTP
app.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  const data = otpStore[phone];

  if (!data) {
    return res.json({ success: false, message: "No OTP found" });
  }

  if (Date.now() > data.expires) {
    return res.json({ success: false, message: "OTP expired" });
  }

  if (data.otp === otp) {
    delete otpStore[phone]; // remove after success
    return res.json({ success: true, message: "Login successful" });
  } else {
    return res.json({ success: false, message: "Invalid OTP" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));