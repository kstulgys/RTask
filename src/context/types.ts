import {IToast} from '@chakra-ui/core';
import {ActionType} from './actionTypes';
export type Currency = {name: string; value: number};
export type Currencies = Currency[];
export type DataPoint = {x: number; y: number};
export type DataPoints = DataPoint[];

export type CurrencyState = {
  isSubmitting: boolean;
  selectedFromPocketValue: number;
  selectedToPocketValue: number;
  canSubmit: boolean;
  isLoading: boolean;
  selectedFrom: Currency | null;
  selectedTo: Currency | null;
  currencies: Currencies;
  dataPoints: DataPoints;
  currentRate: number;
  inputValueFrom: number;
  inputValueTo: number;
  status: IToast['status'];
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
