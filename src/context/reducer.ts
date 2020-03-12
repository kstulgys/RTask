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
      return {...state, selectedFrom: action.payload, selectedFromPocketValue: action.payload.value};
    }
    case actions.SET_TO_CURRENCY: {
      return {...state, selectedTo: action.payload, selectedToPocketValue: action.payload.value};
    }
    case actions.SELECT_FROM_CURRENCY: {
      return {...state, selectedFrom: action.payload};
    }
    case actions.SELECT_TO_CURRENCY: {
      return {...state, selectedTo: action.payload};
    }
    case actions.FETCH_RATE_SUCCESS: {
      return {...state, currentRate: action.payload};
    }
    case actions.SET_FILTERED_FROM_CURRENCIES: {
      return {...state, filteredFrom: action.payload};
    }
    case actions.SET_FILTERED_TO_CURRENCIES: {
      return {...state, filteredTo: action.payload};
    }
    case actions.FROM_INPUT_CHANGED: {
      if (state.selectedFrom) {
        return {...state, inputValueFrom: action.payload};
      }
    }
    case actions.TO_INPUT_CHANGED: {
      return {...state, inputValueTo: action.payload};
    }

    case actions.UPDATE_SELECTED_POCKETS_VALUES: {
      if (state.selectedFrom && state.selectedTo) {
        const {selectedFromPocketValue, selectedToPocketValue, canSubmit} = action.payload;
        return {
          ...state,
          canSubmit,
          selectedFromPocketValue,
          selectedToPocketValue,
        };
      }
      return state;
    }

    case actions.SWAP_INPUTS: {
      const copy = {...state};
      const updates = {
        selectedFrom: copy.selectedTo,
        selectedTo: copy.selectedFrom,
        inputValueFrom: copy.inputValueTo,
        inputValueTo: copy.inputValueFrom,
      };
      return {...state, ...updates};
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export default currencyReducer;
