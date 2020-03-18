export type Currency = {name: string; value: number};
export type Currencies = Currency[];
export type DataPoint = {x: number; y: number};
export type DataPoints = DataPoint[];

export type Error = {message: string; type: 'success' | 'warning'} | null;

export type CurrencyState = {
  isSubmitting: boolean;
  pocketValueFrom: number;
  pocketValueTo: number;
  canSubmit: boolean;
  isLoading: boolean;
  selectedFrom: Currency | null;
  selectedTo: Currency | null;
  currencies: Currencies;
  dataPoints: DataPoints;
  currentRate: number | null;
  inputValueFrom: number;
  inputValueTo: number;
  error: Error;
  timesSubmitted: number;
};
