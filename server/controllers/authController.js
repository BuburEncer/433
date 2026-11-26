// File: server/controllers/authController.js
import { Admin } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Accounts created before hashing store plaintext; upgrade them on first successful login.
export async function checkPassword(admin, password) {
  if (admin.password.startsWith("$2")) return bcrypt.compare(password, admin.password);
  if (password !== admin.password) return false;
  admin.password = await bcrypt.hash(password, 10);
  await admin.save();
  return true;
}

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ msg: "Email dan password wajib diisi" });
  }

  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin || !(await checkPassword(admin, password))) {
      return res.status(401).json({ msg: "Email atau password salah" });
    }

    
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // New session ID on login so a pre-login session ID cannot be reused (session fixation).
    req.session.regenerate((err) => {
      if (err) return res.status(500).json({ msg: "Login gagal" });
      req.session.token = token;
      res.json({ msg: "Login berhasil", username: admin.username });
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Login gagal, coba lagi nanti" });
  }
};

export const logoutAdmin = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ msg: "Logout gagal" });
    res.json({ msg: "Logout berhasil" });
  });
};

export const getAdminProfile = async (req, res) => {
  if (!req.session.token) return res.status(401).json({ msg: "Belum login" });

  try {
    const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
    const admin = await Admin.findByPk(decoded.id, { attributes: ['id', 'username'] });
    res.json(admin);
  } catch (err) {
    res.status(401).json({ msg: "Token tidak valid" });
  }
};
