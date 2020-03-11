import actions from './actions';
import {CurrencyState, Action} from './types';

function currencyReducer(state: CurrencyState, action: Action): CurrencyState {
  switch (action.type) {
    case actions.FETCH_CURRENCIES_START: {
      return {...state, isLoading: true};
    }
    case actions.FETCH_CURRENCIES_SUCCESS: {
      return {...state, currencies: action.payload, isLoading: false};
    }
    case actions.FETCH_CURRENCIES_FAIL: {
      return {...state, isLoading: false, error: action.payload};
    }
    case actions.SET_FROM_CURRENCY: {
      return {...state, fromCurrency: action.payload};
    }
    case actions.SET_TO_CURRENCY: {
      return {...state, toCurrency: action.payload};
    }
    case actions.SELECT_FROM_CURRENCY: {
      return {...state, fromCurrency: action.payload};
    }
    case actions.SELECT_TO_CURRENCY: {
      return {...state, toCurrency: action.payload};
    }
    case actions.FETCH_RATE_SUCCESS: {
      return {...state, currentRate: action.payload};
    }
    case actions.SET_FILTERED_FROM_CURRENCIES: {
      return {...state, currenciesFromFiltered: action.payload};
    }
    case actions.SET_FILTERED_TO_CURRENCIES: {
      return {...state, currenciesToFiltered: action.payload};
    }
    case actions.FROM_INPUT_CHANGED: {
      return {...state, fromInputValue: action.payload};
    }
    case actions.TO_INPUT_CHANGED: {
      return {...state, toInputValue: action.payload};
    }
    case actions.SWAP_INPUTS: {
      const copy = {...state};
      const updates = {
        fromCurrency: copy.toCurrency,
        toCurrency: copy.fromCurrency,
        fromInputValue: copy.toInputValue,
        toInputValue: copy.fromInputValue,
      };
      return {...state, ...updates};
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export default currencyReducer;
