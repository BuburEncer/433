import { Router } from 'express';
import matchRoutes from './matches.js';
import newsRoutes from './news.js';
import standingRoutes from './standings.js';
import teamRoutes from './team.js';

const router = Router();

router.use('/matches', matchRoutes);
router.use('/news',     newsRoutes);
router.use('/standings', standingRoutes);
router.use('/teams', teamRoutes);

export default router;
