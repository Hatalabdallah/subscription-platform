import { Request, Response } from 'express';
import { users } from '../data/users'; // ✅ import shared users

export const getSubscriptionPlans = (req: Request, res: Response): void => {
  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 500,
      currency: 'UGX',
      features: ['Access to basic content', 'Standard streaming quality', 'Single device usage']
    },
    {
      id: 'standard',
      name: 'Standard Plan',
      price: 1000,
      currency: 'UGX',
      features: ['Access to all content', 'HD streaming quality', 'Two simultaneous devices']
    }
  ];

  res.json(plans);
};

export const getUserSubscription = (req: Request, res: Response): void => {
  const user = users.find((u: any) => u.id === (req as any).userId); // ✅ typed u as any
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({
    subscribed: user.subscribed,
    subscriptionType: user.subscriptionType,
    subscriptionDate: user.subscriptionDate
  });
};
