// File: server/routes/matches.js
import { Router } from 'express';
import requireAdmin from '../middleware/requireAdmin.js';
import { getAllMatches, getMatchById, createMatch, updateMatch, deleteMatch } from '../controllers/matchController.js';

const router = Router();

router.get('/', getAllMatches);
router.get('/:id', getMatchById);
router.post('/', requireAdmin, createMatch);
router.put('/:id', requireAdmin, updateMatch);
router.delete('/:id', requireAdmin, deleteMatch);

export default router;
