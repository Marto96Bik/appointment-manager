import twilio, { Twilio } from "twilio";

export class TwilioClient {
  private client: Twilio;
  constructor() {
    this.client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
  }

  async sendMessage(number: string) {
    const toNumber = `whatsapp:${number}`;
    const mensaje = "¡Hola! Esta es una prueba desde mi script Node.js 😎";
    return await this.client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: toNumber,
      body: mensaje,
    });
  }
}
