import { Request, Response } from 'express';
import { DPOApi } from '../utils/dpoApi';

const dpoApi = new DPOApi();

// Initiate payment
export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const { amount, plan } = req.body;
    const userId = (req as any).userId; // Assuming authentication middleware sets req.user

    // Create payment token with DPO
    const result = await dpoApi.createToken(
      amount,
      'UGX',
      `${plan} Subscription`,
      `${process.env.BASE_URL}/payment/success`,
      `${process.env.BASE_URL}/payment/cancel`
    );

    // TODO: Store transaction in your database
    // await saveTransaction(userId, result.TransToken, amount, plan);

    res.json({
  paymentUrl: `${dpoApi.getPaymentUrl()}${result.TransToken}`,
  transactionToken: result.TransToken
  });

  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
};

// Payment success callback
export const paymentSuccess = async (req: Request, res: Response) => {
  try {
    const { transactionToken } = req.query;

    if (!transactionToken || typeof transactionToken !== 'string') {
      return res.redirect('/error.html');
    }

    // TODO: Verify transaction with DPO
    // const verification = await dpoApi.verifyToken(transactionToken);

    // TODO: Update user subscription in database
    // await updateUserSubscription((req as any).user.id, true);

    res.redirect('/success.html');
  } catch (error) {
    console.error('Payment success error:', error);
    res.redirect('/error.html');
  }
};

// Payment cancel callback
export const paymentCancel = (req: Request, res: Response) => {
  // Optional: handle logging or notification
  res.redirect('/cancel.html');
};

// Verify payment (for backend checks)
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { transactionToken } = req.body;

    if (!transactionToken) {
      return res.status(400).json({ error: 'Transaction token is required' });
    }

    // TODO: Verify with DPO API
    // const verification = await dpoApi.verifyToken(transactionToken);

    res.json({
      message: 'Payment verification successful',
      transactionToken,
      status: 'SUCCESS' // Replace with actual verification result
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
};
