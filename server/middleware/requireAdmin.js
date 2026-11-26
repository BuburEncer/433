import jwt from "jsonwebtoken";

export default function requireAdmin(req, res, next) {
  try {
    req.adminId = jwt.verify(req.session?.token, process.env.JWT_SECRET).id;
    next();
  } catch {
    res.status(401).json({ msg: "Belum login" });
  }
}
