import * as React from 'react';
import {getCurrencies, getDataPoints} from 'services/exchangerates-api';
import actions from 'context/actions';
import {CurrencyDispatch} from 'context/types';

export function useSetInitialState(dispatch: CurrencyDispatch): void {
  React.useEffect(() => {
    try {
      getCurrencies().then(currencies => {
        dispatch({
          type: actions.FETCH_CURRENCIES_SUCCESS,
          payload: currencies,
        });
      });
    } catch (error) {
      dispatch({
        type: actions.FETCH_CURRENCIES_FAIL,
        payload: error,
      });
    }
  }, []);
}
