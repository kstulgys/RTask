import {ActionType} from './actionTypes';

export type Currency = {name: string; value: number};
export type Currencies = Currency[];
export type DataPoint = {x: number; y: number};
export type DataPoints = DataPoint[];

export interface Status {
  name: 'idle' | 'success' | 'error';
  message: string;
}

export const StatusTypes: {idle: Status; success: Status; error: Status} = {
  idle: {name: 'idle', message: ''},
  success: {name: 'success', message: 'Success.'},
  error: {name: 'error', message: 'Something went wrong.'},
};

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
  currentRate: number;
  inputValueFrom: number;
  inputValueTo: number;
  status: Status;
};

export type CurrencyDispatch = React.Dispatch<Action>;
export type Reducer = React.Reducer<CurrencyState, Action>;

export type Action = {
  type: ActionType;
  payload?: object;
};

export interface CurrencyProviderProps {
  [key: string]: any;
}
