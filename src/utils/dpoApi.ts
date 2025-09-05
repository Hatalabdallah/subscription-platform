import axios from 'axios';
import { Builder } from 'xml2js';

export class DPOApi {
  private companyToken: string;
  private apiUrl: string;
  private paymentUrl: string;

  constructor() {
    this.companyToken = process.env.DPO_COMPANY_TOKEN || '8D3DA73D-9D7F-4E09-96D4-3D44E7A83EA3';
    this.apiUrl = process.env.DPO_API_URL || 'https://secure.3gdirectpay.com/API/v6/';
    this.paymentUrl = process.env.DPO_PAYMENT_URL || 'https://secure.3gdirectpay.com/payv2.php?ID=';
  }

  // ✅ Getter to safely expose payment URL
  public getPaymentUrl(): string {
    return this.paymentUrl;
  }

  async createToken(
    amount: number,
    currency: string,
    serviceDescription: string,
    redirectUrl: string,
    backUrl: string
  ): Promise<any> {
    const builder = new Builder();
    const xml = builder.buildObject({
      API3G: {
        CompanyToken: this.companyToken,
        Request: 'createToken',
        Transaction: {
          PaymentAmount: amount,
          PaymentCurrency: currency,
          CompanyRef: Math.random().toString(36).substring(7), // Unique reference
          RedirectURL: redirectUrl,
          BackURL: backUrl
        },
        Services: {
          Service: {
            ServiceType: process.env.DPO_SERVICE_ID || '5525',
            ServiceDescription: serviceDescription,
            ServiceDate: new Date().toISOString().split('T')[0] + ' 19:00'
          }
        }
      }
    });

    try {
      const response = await axios.post(this.apiUrl, xml, {
        headers: { 'Content-Type': 'application/xml' }
      });
      return response.data;
    } catch (error) {
      console.error('DPO API Error:', error);
      throw error;
    }
  }

  async verifyToken(transactionToken: string): Promise<any> {
    // Implementation for verifyToken API call
    return { status: 'SUCCESS', token: transactionToken }; // Mock example
  }
}
