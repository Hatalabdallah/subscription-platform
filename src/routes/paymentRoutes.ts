import express from 'express';
import {
  initiatePayment,
  paymentSuccess,
  paymentCancel,
  verifyPayment
} from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Payment routes
router.post('/initiate', authenticateToken, initiatePayment);
router.get('/success', paymentSuccess);
router.get('/cancel', paymentCancel);
router.post('/verify', authenticateToken, verifyPayment);

export default router;
