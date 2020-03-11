export type Currency = {name: string; value: number};
export type Currencies = Currency[];
export type DataPoint = {x: number; y: number};
export type DataPoints = DataPoint[];
export type AvailableDays = 10 | 7 | 30 | 90 | 180 | 360 | 1800;

export type CurrencyState = {
  isLoading: boolean;
  currencies: Currencies;
  currenciesFromFiltered: Currencies;
  currenciesToFiltered: Currencies;
  fromCurrency: Currency | null;
  toCurrency: Currency | null;
  chartData: DataPoints;
  currentRate: number;
  historyDaysAgo: AvailableDays;
  currencyFocused: 'From' | 'To';
  error: string | null;
  fromInputValue: number;
  toInputValue: number;
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
