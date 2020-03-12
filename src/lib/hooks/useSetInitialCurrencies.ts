import * as React from 'react';
import actions from 'context/actions';
import {CurrencyDispatch, Currencies, Currency} from 'context/types';

interface Props {
  dispatch: CurrencyDispatch;
  currencies: Currencies;
}

export function useSetInitialCurrencies({dispatch, currencies}: Props): void {
  const initialFrom = 'GBP';
  const initialTo = 'USD';

  React.useEffect(() => {
    if (currencies.length > 0) {
      const selectedFrom = currencies.find((c: Currency) => c.name === initialFrom);
      const toCurrency = currencies.find((c: Currency) => c.name === initialTo);
      if (selectedFrom) {
        dispatch({
          type: actions.SET_FROM_CURRENCY,
          payload: selectedFrom,
        });
      }
      if (toCurrency) {
        dispatch({
          type: actions.SET_TO_CURRENCY,
          payload: toCurrency,
        });
      }
    }
  }, [currencies]);
}
