const WA_LINK_API_URL = "https://api.wa.link/v1/newlink";

export interface CreateLinkParams {
  phone: string;
  countryCode: string;
  message: string;
}

export interface CreateLinkResponse {
  status: string;
  data: { shortUrl: string };
}

/**
 * Client for wa.link API. Generates a short WhatsApp link with a pre-filled
 * message instead of sending the message directly (e.g. instead of Twilio).
 */
export class WaLinkClient {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.WA_LINK_API_KEY ?? "";

    if (!this.apiKey) {
      throw new Error("WA_LINK_API_KEY is required for WaLinkClient");
    }
  }

  /**
   * Creates a tiny wa.link URL that opens WhatsApp with the given phone and pre-filled message.
   */
  async createLink(params: CreateLinkParams): Promise<string> {
    const { phone, countryCode, message } = params;
    const normalizedPhone = this.normalizePhone(phone, countryCode);

    const res = await fetch(WA_LINK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
        "x-api-key": this.apiKey,
        Origin: "https://crear.wa.link",
        Referer: "https://crear.wa.link/",
      },
      body: JSON.stringify({
        phone: normalizedPhone,
        countryCode,
        message,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`wa.link API error ${res.status}: ${text}`);
    }

    const data = (await res.json()) as CreateLinkResponse & { url?: string; link?: string };

    const raw =
      data.data?.shortUrl ?? (typeof data.link === "string" ? data.link : data.url);

    if (!raw || typeof raw !== "string") {
      throw new Error("wa.link API did not return a link");
    }

    return this.toAbsoluteWaLinkUrl(raw);
  }

  /**
   * Ensures the link is an absolute URL that opens wa.link (and then WhatsApp).
   * The API may return a path like "abc123" or "/abc123"; using that as href
   * would navigate within our site instead of opening WhatsApp.
   */
  private toAbsoluteWaLinkUrl(raw: string): string {
    const trimmed = raw.trim();
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    const path = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
    return `https://wa.link/${path}`;
  }

  /**
   * If phone already starts with country code (e.g. 972...), strip it so we send only local number.
   */
  private normalizePhone(phone: string, countryCode: string): string {
    const digits = phone.replaceAll(/\D/g, "");
    const code = countryCode.replaceAll(/\D/g, "");
    if (code && digits.startsWith(code)) {
      return digits.slice(code.length);
    }
    return digits;
  }
}
