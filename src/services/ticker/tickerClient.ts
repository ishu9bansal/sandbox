import { InstrumentResponse } from "@/models/ticker";
import ApiClient from "../api/api";

export class TickerClient {
  constructor(private client: ApiClient) {}
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
      const response = await this.client.get(uri);
      return response;
    } catch (error) {
      console.error(error); // NOTE: do not expose internal error details to user
      throw Error("Error while fetching quote");  // user facing message
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
