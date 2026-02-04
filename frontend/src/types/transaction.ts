/**
 * Shared types for API responses (frontend)
 */
export interface Location {
  latitude: number;
  longitude: number;
}

export interface Transaction {
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
