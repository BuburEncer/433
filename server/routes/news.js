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
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

router.get('/', getAllNews);
router.post('/', requireAdmin, upload.single('image'), addNews);
router.delete('/:id', requireAdmin, deleteNews);

export default router;
