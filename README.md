# DPO Pay Subscription Platform

A subscription platform integrated with DPO Pay for mobile money payments in Uganda.

## Features

- User registration and authentication
- Subscription plan selection
- DPO Pay integration for MTN and Airtel Mobile Money payments
- Responsive web interface

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your configuration
4. Run in development: `npm run dev`
5. Build for production: `npm run build`

## Environment Variables

Create a `.env` file with the following variables:


JWT_SECRET=your-super-secret-jwt-key
DPO_COMPANY_TOKEN=8D3DA73D-9D7F-4E09-96D4-3D44E7A83EA3
DPO_SERVICE_ID=5525
DPO_API_URL=https://secure.3gdirectpay.com/API/v6/
DPO_PAYMENT_URL=https://secure.3gdirectpay.com/payv2.php?ID=
PORT=3000



## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/subscription/plans` - Get subscription plans
- `POST /api/payment/initiate` - Initiate payment
- `GET /api/payment/success` - Payment success callback
- `GET /api/payment/cancel` - Payment cancellation callback