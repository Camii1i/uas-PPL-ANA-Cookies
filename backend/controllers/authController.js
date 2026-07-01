const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const connection = await pool.getConnection();

    try {
      const [users] = await connection.execute(
        "SELECT id, name, email, password, role FROM users WHERE email = ?",
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }

      const user = users[0];

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  login
};
