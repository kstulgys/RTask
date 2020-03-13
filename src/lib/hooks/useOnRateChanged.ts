import * as React from 'react';
import {getCurrencies, getCurrentRate, updatePockets} from 'services/exchangerates-api';
import actions from 'context/actions';
import {CurrencyDispatch, Currency} from 'context/types';

interface Props {
  dispatch: CurrencyDispatch;
  selectedTo: Currency | null;
  inputValueFrom: number;
  currentRate: number;
}

export function useOnRateChanged({dispatch, currentRate, inputValueFrom, selectedTo}: Props): void {
  React.useEffect(() => {
    if (selectedTo && currentRate) {
      const inputValueTo = +(inputValueFrom * currentRate).toFixed(2);
      const selectedToPocketValue = +(inputValueTo + selectedTo.value).toFixed(2);

      dispatch({
        type: actions.TO_INPUT_CHANGED,
        payload: inputValueTo,
      });
      dispatch({
        type: actions.UPDATE_SELECTED_TO_POCKET_VALUE,
        payload: selectedToPocketValue,
      });
    }
  }, [currentRate, inputValueFrom, selectedTo]);
}
