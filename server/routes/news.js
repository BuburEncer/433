import { Router } from 'express';
import requireAdmin from '../middleware/requireAdmin.js';
import multer from 'multer';
import path from 'path';
import { getAllNews, addNews, deleteNews } from '../controllers/newsController.js';

const router = Router();

const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext.toLowerCase()}`);
  },
});
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

export function isImageUpload(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  return file.mimetype.startsWith('image/') && IMAGE_EXTENSIONS.includes(ext);
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (isImageUpload(file)) return cb(null, true);
    const err = new Error('Hanya file gambar (jpg, png, webp, gif) yang diizinkan');
    err.status = 400;
    cb(err);
  },
});

router.get('/', getAllNews);
router.post('/', requireAdmin, upload.single('image'), addNews);
router.delete('/:id', requireAdmin, deleteNews);

export default router;
