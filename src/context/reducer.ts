import actions from './actions';
import {CurrencyState, Action} from './types';

function appReducer(state: CurrencyState, action: Action): CurrencyState {
  switch (action.type) {
    case actions.SET_INITIAL_DATA: {
      // payload: {
      //   currencies,
      //   selectedFrom,
      //   selectedTo,
      //   currentRate,
      //   dataPoints,
      //   isLoading: false,
      // },
      return {...state, ...action.payload};
    }

    default: {
      return state;
    }
  }
}

// const newState = {
//   ...state,
//   ...updatePocketsReducer(state, action),
//   ...fetchCurrenciesReducer(state, action),
//   ...setInitialCurrenciesReducer(state, action),
//   ...currencySelectReducer(state, action),
//   ...setFilteredCurrenciesReducer(state, action),
//   ...inputChangedReducer(state, action),
//   ...fetchCurrencyRateReducer(state, action),
//   ...updatePocketValueReducer(state, action),
//   ...swapInputsReducer(state, action),
//   ...setDataPointsReducer(state, action),
// };

// if (newState) {
//   return newState;
// } else {
//   throw new Error(`Unhandled action type: ${action.type}`);
// }

function updatePocketsReducer(state: CurrencyState, action: Action): CurrencyState | undefined {
  switch (action.type) {
    case actions.UPDATE_POCKETS_START: {
      return {...state, isSubmitting: true};
    }
    case actions.UPDATE_POCKETS_SUCCESS: {
      if (state.selectedFrom && state.selectedTo) {
        return {
          ...state,
          isSubmitting: false,
          inputValueFrom: 0,
          inputValueTo: 0,
          selectedFrom: {name: state.selectedFrom.name, value: state.selectedFromPocketValue},
          selectedTo: {name: state.selectedTo.name, value: state.selectedToPocketValue},
        };
      }
    }
    case actions.UPDATE_POCKETS_SUCCESS: {
      return {...state, isSubmitting: false, error: action.payload};
    }
  }
}

function fetchCurrenciesReducer(state: CurrencyState, action: Action): CurrencyState | undefined {
  switch (action.type) {
    case actions.FETCH_CURRENCIES_START: {
      return {...state, isLoading: true};
    }
    case actions.FETCH_CURRENCIES_SUCCESS: {
      const newState = {...state, currencies: action.payload, isLoading: false};
      return newState;
    }
    case actions.FETCH_CURRENCIES_FAIL: {
      return {...state, isLoading: false, error: action.payload};
    }
  }
}

function setInitialCurrenciesReducer(state: CurrencyState, action: Action): CurrencyState | undefined {
  switch (action.type) {
    case actions.SET_FROM_CURRENCY: {
      return {...state, selectedFrom: action.payload, selectedFromPocketValue: action.payload.value};
    }
    case actions.SET_TO_CURRENCY: {
      return {...state, selectedTo: action.payload, selectedToPocketValue: action.payload.value};
    }
  }
}

function currencySelectReducer(state: CurrencyState, action: Action): CurrencyState | undefined {
  switch (action.type) {
    case actions.SELECT_FROM_CURRENCY: {
      return {...state, selectedFrom: action.payload};
    }
    case actions.SELECT_TO_CURRENCY: {
      return {...state, selectedTo: action.payload};
    }
  }
}

function setFilteredCurrenciesReducer(state: CurrencyState, action: Action): CurrencyState | undefined {
  switch (action.type) {
    case actions.SET_FILTERED_FROM_CURRENCIES: {
      return {...state, filteredFrom: action.payload};
    }
    case actions.SET_FILTERED_TO_CURRENCIES: {
      return {...state, filteredTo: action.payload};
    }
  }
}

function inputChangedReducer(state: CurrencyState, action: Action): CurrencyState | undefined {
  switch (action.type) {
    case actions.FROM_INPUT_CHANGED: {
      if (state.selectedFrom) {
        return {...state, inputValueFrom: action.payload};
      }
    }
    case actions.TO_INPUT_CHANGED: {
      return {...state, inputValueTo: action.payload};
    }
  }
}

function fetchCurrencyRateReducer(state: CurrencyState, action: Action): CurrencyState | undefined {
  switch (action.type) {
    case actions.FETCH_RATE_SUCCESS: {
      return {...state, currentRate: action.payload};
    }
  }
}

function updatePocketValueReducer(state: CurrencyState, action: Action): CurrencyState | undefined {
  switch (action.type) {
    case actions.UPDATE_SELECTED_TO_POCKET_VALUE: {
      return {
        ...state,
        selectedToPocketValue: action.payload,
      };
    }
    case actions.UPDATE_SELECTED_FROM_POCKET_VALUE: {
      const {selectedFromPocketValue, canSubmit} = action.payload;
      return {
        ...state,
        canSubmit,
        selectedFromPocketValue,
      };
    }
  }
}

function swapInputsReducer(state: CurrencyState, action: Action): CurrencyState | undefined {
  switch (action.type) {
    case actions.SWAP_INPUTS: {
      const copy = {...state};
      const updates = {
        selectedFrom: copy.selectedTo,
        selectedTo: copy.selectedFrom,
        inputValueFrom: copy.inputValueTo,
        selectedFromPocketValue: copy.selectedToPocketValue,
      };
      return {...state, ...updates};
    }
  }
}

function setDataPointsReducer(state: CurrencyState, action: Action): CurrencyState | undefined {
  switch (action.type) {
    case actions.SET_DATA_POINTS: {
      return {...state, dataPoints: action.payload};
    }
  }
}

export default appReducer;
