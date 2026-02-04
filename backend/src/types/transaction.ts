/**
 * Type definitions for Fraud Detection Dashboard (backend)
 */

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Transaction {
  _id?: string;
  transaction_id: string;
  user_id: string;
  timestamp: string;
  amount: number;
  location: Location;
  country?: string;
}

export type FraudType = "HIGH_FREQUENCY" | "DISTANT_LOCATIONS";

export interface FraudEvent {
  transaction_id: string;
  user_id: string;
  timestamp: string;
  fraud_type: FraudType;
  amount?: number;
  country?: string;
  description?: string;
}

export interface FraudSummary {
  total: number;
  byType: Record<FraudType, number>;
  events: FraudEvent[];
}

export interface CountryFraudInsight {
  country: string;
  fraudCount: number;
  percentage: number;
}

export interface CountryFraudInsightResponse {
  insights: CountryFraudInsight[];
  total: number;
}

export interface DateRangeQuery {
  startDate?: string;
  endDate?: string;
}
