import { Router } from 'express';
import requireAdmin from '../middleware/requireAdmin.js';
import { getStandings, createStanding, updateStanding, deleteStanding } from '../controllers/standingController.js';

const router = Router();

router.get('/', getStandings);
router.post('/', requireAdmin, createStanding);  // Endpoint untuk menambahkan statistik baru
router.put("/:id", requireAdmin, updateStanding);
router.delete("/:id", requireAdmin, deleteStanding);


export default router;
