export type QuoteSummary = {
  customer: string;
  project: string;
  product: string;
  scope: string;
  leadTime: string;
  unitPrice: string;
  minOrderQty: number;
  terms: string;
};

export type PricingRow = {
  product: string;
  laborCost: number;
  materialCost: number;
  overhead: number;
  margin: number;
  leadTime: number;
  unitPrice: number;
};
