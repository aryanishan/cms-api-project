import {
  initiateSignupService,
  verifySignupOtpService,
  loginService
} from "../services/auth.service.js";

/**
 * POST /auth/signup/initiate
 */
export const initiateSignup = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const result = await initiateSignupService(email);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      ...result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * POST /auth/signup/verify
 */
export const verifySignupOtp = async (req, res) => {
  try {
    const user = await verifySignupOtpService(req.body);

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * POST /auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    const result = await loginService(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      ...result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};
