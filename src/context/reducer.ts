import {ActionTypes} from './actionTypes';
import {CurrencyState, Action} from './types';

function appReducer(state: CurrencyState, action: Action): CurrencyState {
  console.log(action.type);
  switch (action.type) {
    case ActionTypes.SET_LOADING: {
      return {...state, ...action.payload};
    }
    case ActionTypes.SET_INITIAL_DATA: {
      return {...state, ...action.payload};
    }
    case ActionTypes.CURRENCY_FROM_SELECTED: {
      return {...state, ...action.payload};
    }
    case ActionTypes.CURRENCY_TO_SELECTED: {
      return {...state, ...action.payload};
    }
    case ActionTypes.INPUT_VALUE_FROM_CHANGED: {
      return {...state, ...action.payload};
    }
    case ActionTypes.INPUT_VALUE_TO_CHANGED: {
      return {...state, ...action.payload};
    }
    case ActionTypes.CURRENCIES_SWAPPED: {
      return {...state, ...action.payload};
    }
    case ActionTypes.SUBMIT_VALUES_START: {
      return {...state, ...action.payload};
    }
    case ActionTypes.SUBMIT_VALUES_SUCCESS: {
      return {...state, ...action.payload};
    }
    case ActionTypes.SUBMIT_VALUES_FAIL: {
      return {...state, ...action.payload};
    }
    case ActionTypes.FETCH_CURRENCY_RATE: {
      return {...state, ...action.payload};
    }
    case ActionTypes.CURRENCY_RATE_CHANGED: {
      return {...state, ...action.payload};
    }
    case ActionTypes.STATUS_CLEANUP: {
      return {...state, ...action.payload};
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export default appReducer;
