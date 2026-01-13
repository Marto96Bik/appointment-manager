import twilio, { Twilio } from "twilio";

export class TwilioClient {
  private client: Twilio;
  constructor() {
    this.client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
  }

  async sendMessage(fromNumber: string, toNumber: string, message: string) {
    return await this.client.messages.create({
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${toNumber}`,
      body: message,
    });
  }
}
