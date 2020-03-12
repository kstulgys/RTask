export type Currency = {name: string; value: number};
export type Currencies = Currency[];
export type DataPoint = {x: number; y: number};
export type DataPoints = DataPoint[];
export type AvailableDays = 10 | 7 | 30 | 90 | 180 | 360 | 1800;

export type CurrencyState = {
  // fromCurrency: Currency;
  // toCurrency: Currency;
  // currencyFocused: 'From' | 'To';
  selectedFromPocketValue: number;
  selectedToPocketValue: number;
  canSubmit: boolean;
  isLoading: boolean;
  filteredFrom: Currencies;
  filteredTo: Currencies;
  selectedFrom: Currency | null;
  selectedTo: Currency | null;
  currencies: Currencies;
  dataPoints: DataPoints;
  historyDaysAgo: AvailableDays;
  currentRate: number;
  inputValueFrom: number;
  inputValueTo: number;
  error: string | null;
};

export type CurrencyDispatch = React.Dispatch<Action>;
export type Reducer = React.Reducer<CurrencyState, Action>;

export type Action = {
  type: string;
  payload?: any;
};

export interface CurrencyProviderProps {
  [key: string]: any;
}
