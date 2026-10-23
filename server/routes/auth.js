
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const expectedUsername = process.env.ORGANIZER_USERNAME;
    const passwordHash = process.env.ORGANIZER_PASSWORD_HASH;
    const jwtSecret = process.env.JWT_SECRET;

    if (!expectedUsername || !passwordHash || !jwtSecret) {
      console.error("Organizer authentication environment variables are missing");

      return res.status(500).json({
        message: "Organizer login is not configured",
      });
    }

    const usernameMatches = username.trim() === expectedUsername;
    const passwordMatches = await bcrypt.compare(password, passwordHash);

    if (!usernameMatches || !passwordMatches) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      {
        username: expectedUsername,
        role: "organizer",
      },
      jwtSecret,
      {
        expiresIn: "2h",
        issuer: "eventease-api",
        audience: "eventease-organizer",
      }
    );

    return res.json({
      message: "Organizer login successful",
      token,
      expiresIn: 7200,
    });
  } catch (error) {
    console.error("Organizer login error:", error.message);

    return res.status(500).json({
      message: "Login failed",
    });
  }
});

module.exports = router;
