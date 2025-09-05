import express from 'express';
import { getSubscriptionPlans, getUserSubscription } from '../controllers/subscriptionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/plans', getSubscriptionPlans);
router.get('/user', authenticateToken, getUserSubscription);

export default router;