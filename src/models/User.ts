export interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  subscribed: boolean;
  subscriptionType?: string;
  subscriptionDate?: Date;
  createdAt: Date;   // ✅ added
  updatedAt?: Date;  // optional if you want to track updates
}