import * as React from 'react';
import {getCurrencies, getCurrentRate, updatePockets} from 'services/exchangerates-api';
import actions from 'context/actions';
import {CurrencyDispatch, Currency} from 'context/types';

interface Props {
  dispatch: CurrencyDispatch;
  selectedFrom: Currency | null;
  selectedTo: Currency | null;
  interval?: number;
}

export function useCurrencyRatePolling({dispatch, selectedFrom, selectedTo, interval = 1000000}: Props): void {
  React.useEffect(() => {
    let timer: any = null;

    if (selectedFrom && selectedTo) {
      (function foo(): void {
        getCurrentRate({selectedFrom, selectedTo}).then(payload => {
          dispatch({
            type: actions.FETCH_RATE_SUCCESS,
            payload,
          });
        });
        timer = setTimeout(foo, interval);
      })();
    }
    return (): void => timer && clearInterval(timer);
  }, [selectedFrom, selectedTo]);
}
