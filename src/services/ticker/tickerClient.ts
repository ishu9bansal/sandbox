import { InstrumentResponse, QuoteResponse, StraddleResponse } from "@/models/ticker";
import ApiClient, { ApiClientConfig } from "../api/api";

export class TickerClient {
  private client: ApiClient;
  constructor(config: ApiClientConfig) {
    this.client = new ApiClient(config);
  }
  async getUser() {
    const uri = `/ticker/user`;
    try {
      const response = await this.client.get<any>(uri);
      return response;
    } catch (error) {
      console.error(error); // NOTE: do not expose internal error details to user
      throw Error("Error while fetching user data");  // user facing message
    }
  }
  async getInstruments() {
    const uri = `/ticker/instruments`;
    try {
      const response = await this.client.get<InstrumentResponse>(uri);
      return response;
    } catch (error) {
      console.error(error); // NOTE: do not expose internal error details to user
      throw Error("Error while fetching instruments");  // user facing message
    }
  }
  async getQuote(underlying: string) {
    const queryParams = new URLSearchParams({ underlying });
    const queryString = queryParams.toString();
    const uri = `/ticker/quote/?${queryString}`;
    try {
      const now = new Date();
      const timestamp = now.getTime();
      const response = await this.client.get<QuoteResponse>(uri);
      const quote = response ? Object.values(response)[0] : null;
      return { timestamp, quote };
    } catch (error) {
      console.error(error); // NOTE: do not expose internal error details to user
      throw Error("Error while fetching quote");  // user facing message
    }
  }
  async getStraddles(underlying: string) {
    const queryParams = new URLSearchParams({ underlying });
    const queryString = queryParams.toString();
    const uri = `/ticker/straddles/?${queryString}`;
    try {
      const response = await this.client.get<StraddleResponse>(uri);
      return response;
    } catch (error) {
      console.error(error); // NOTE: do not expose internal error details to user
      throw Error("Error while fetching straddles");  // user facing message
    }
  }
  async getHistory(underlying: string, from_time: Date) {
    const from = this.formatDate(from_time); 
    const queryParams = new URLSearchParams({ underlying, from });
    const queryString = queryParams.toString();
    const uri = `/ticker/history/?${queryString}`;
    try {
      const response = await this.client.get(uri);
      return response;
    } catch (error) {
      console.error(error); // NOTE: do not expose internal error details to user
      throw Error("Error while fetching history");  // user facing message
    }
  }
  private formatDate(date: Date) {
    return date.toLocaleString('sv-SE', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    }).replace(' ', 'T').replace(',', '');
  }
};

export class HealthClient {
  private client: ApiClient;
  constructor(config: ApiClientConfig) {
    this.client = new ApiClient(config);
  }
  async checkHealth() {
    const uri = `/health`;
    try {
      const response = await this.client.get<{ status: string }>(uri, {
        timeout: 800
      });
      return response?.status === 'healthy';
    } catch (error) {
      console.error(error); // NOTE: do not expose internal error details to user
      throw Error("Error while checking service health");  // user facing message
    }
  }
}
