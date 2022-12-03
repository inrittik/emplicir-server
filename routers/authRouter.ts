import express from "express"
const authController = require("../controllers/authController")

const router = express.Router();

router.post("/register", authController.registerUser)
router.post("/login", authController.loginUser)
// router.get("/logout", authController.logoutUser)
// router.get("/user", authController.checkUser)
// router.put("/password/forgot", authController.forgotPassword)
// router.put("/password/reset", authController.resetPassword)
// router.put("/password.update", authController.updatePassword)
// router.put("/user/update", authController.updateUserById)
// router.get("/email-otp", authController.sendEmailOtp)
router.post("/verify/email", authController.verifyEmail)
// router.post("sms-otp", authController.sendSmsOtp)
// router.post("/verify/sms-otp", authController.verifySmsOtp)

module.exports = router