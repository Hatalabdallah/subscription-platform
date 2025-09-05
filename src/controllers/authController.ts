import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { users } from '../data/users';

// Register user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, phone, email, password } = req.body;

    const existingUser = users.find(user => user.email === email || user.phone === phone);
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: Date.now().toString(),
      fullName,
      phone,
      email,
      password: hashedPassword,
      subscribed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(newUser);

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        subscribed: newUser.subscribed,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { emailPhone, password } = req.body;

    const user = users.find(u => u.email === emailPhone || u.phone === emailPhone);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        subscribed: user.subscribed,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Logout user
export const logout = (req: Request, res: Response): void => {
  res.json({ message: 'Logout successful' });
};

// Get current user
export const getCurrentUser = (req: Request, res: Response): void => {
  const user = users.find(u => u.id === (req as any).userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      subscribed: user.subscribed,
      createdAt: user.createdAt
    }
  });
};
