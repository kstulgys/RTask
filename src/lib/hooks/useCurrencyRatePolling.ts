import * as React from 'react';
import {getCurrentRate} from 'services/exchangerates-api';
import {ActionTypes} from 'context/actionTypes';
import {CurrencyDispatch, Currency} from 'context/types';

interface Props {
  dispatch: CurrencyDispatch;
  selectedFrom: Currency | null;
  selectedTo: Currency | null;
  currentRate: number;
  interval?: number;
}

export function useCurrencyRatePolling({
  dispatch,
  selectedFrom,
  selectedTo,
  currentRate,
  interval = 10000,
}: Props): void {
  React.useEffect(() => {
    const pollRate = async () => {
      if (selectedFrom && selectedTo) {
        const newRate = await getCurrentRate({selectedFrom, selectedTo});
        const prevRate = currentRate;
        if (newRate !== prevRate) {
          dispatch({
            type: ActionTypes.FETCH_CURRENCY_RATE,
            payload: {currentRate: newRate},
          });
        }
      }
    };

    const timer = setInterval(pollRate, interval);
    return () => clearInterval(timer);
  }, [selectedFrom, selectedTo]);
}
