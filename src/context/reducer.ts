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

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

// // const newState = {
// //   ...state,
// //   ...updatePocketsReducer(state, action),
// //   ...fetchCurrenciesReducer(state, action),
// //   ...setInitialCurrenciesReducer(state, action),
// //   ...currencySelectReducer(state, action),
// //   ...setFilteredCurrenciesReducer(state, action),
// //   ...inputChangedReducer(state, action),
// //   ...fetchCurrencyRateReducer(state, action),
// //   ...updatePocketValueReducer(state, action),
// //   ...swapInputsReducer(state, action),
// //   ...setDataPointsReducer(state, action),
// // };

// // if (newState) {
// //   return newState;
// // } else {
// //   throw new Error(`Unhandled action type: ${action.type}`);
// // }

// function updatePocketsReducer(state: CurrencyState, action: Action): CurrencyState | undefined {
//   switch (action.type) {
//     case actionTypes.UPDATE_POCKETS_START: {
//       return {...state, isSubmitting: true};
//     }
//     case actionTypes.UPDATE_POCKETS_SUCCESS: {
//       if (state.selectedFrom && state.selectedTo) {
//         return {
//           ...state,
//           isSubmitting: false,
//           inputValueFrom: 0,
//           inputValueTo: 0,
//           selectedFrom: {name: state.selectedFrom.name, value: state.selectedFromPocketValue},
//           selectedTo: {name: state.selectedTo.name, value: state.selectedToPocketValue},
//         };
//       }
//     }
//     case actionTypes.UPDATE_POCKETS_SUCCESS: {
//       return {...state, isSubmitting: false, error: action.payload};
//     }
//   }
// }

// function fetchCurrenciesReducer(state: CurrencyState, action: Action): CurrencyState | undefined {
//   switch (action.type) {
//     case actionTypes.FETCH_CURRENCIES_START: {
//       return {...state, isLoading: true};
//     }
//     case actionTypes.FETCH_CURRENCIES_SUCCESS: {
//       const newState = {...state, currencies: action.payload, isLoading: false};
//       return newState;
//     }
//     case actionTypes.FETCH_CURRENCIES_FAIL: {
//       return {...state, isLoading: false, error: action.payload};
//     }
//   }
// }

// function setInitialCurrenciesReducer(state: CurrencyState, action: Action): CurrencyState | undefined {
//   switch (action.type) {
//     case actionTypes.SET_FROM_CURRENCY: {
//       return {...state, selectedFrom: action.payload, selectedFromPocketValue: action.payload.value};
//     }
//     case actionTypes.SET_TO_CURRENCY: {
//       return {...state, selectedTo: action.payload, selectedToPocketValue: action.payload.value};
//     }
//   }
// }

// function currencySelectReducer(state: CurrencyState, action: Action): CurrencyState | undefined {
//   switch (action.type) {
//     case actionTypes.SELECT_FROM_CURRENCY: {
//       return {...state, selectedFrom: action.payload};
//     }
//     case actionTypes.SELECT_TO_CURRENCY: {
//       return {...state, selectedTo: action.payload};
//     }
//   }
// }

// function setFilteredCurrenciesReducer(state: CurrencyState, action: Action): CurrencyState | undefined {
//   switch (action.type) {
//     case actionTypes.SET_FILTERED_FROM_CURRENCIES: {
//       return {...state, filteredFrom: action.payload};
//     }
//     case actionTypes.SET_FILTERED_TO_CURRENCIES: {
//       return {...state, filteredTo: action.payload};
//     }
//   }
// }

// function inputChangedReducer(state: CurrencyState, action: Action): CurrencyState | undefined {
//   switch (action.type) {
//     case actionTypes.FROM_INPUT_CHANGED: {
//       if (state.selectedFrom) {
//         return {...state, inputValueFrom: action.payload};
//       }
//     }
//     case actionTypes.TO_INPUT_CHANGED: {
//       return {...state, inputValueTo: action.payload};
//     }
//   }
// }

// function fetchCurrencyRateReducer(state: CurrencyState, action: Action): CurrencyState | undefined {
//   switch (action.type) {
//     case actionTypes.FETCH_RATE_SUCCESS: {
//       return {...state, currentRate: action.payload};
//     }
//   }
// }

// function updatePocketValueReducer(state: CurrencyState, action: Action): CurrencyState | undefined {
//   switch (action.type) {
//     case actionTypes.UPDATE_SELECTED_TO_POCKET_VALUE: {
//       return {
//         ...state,
//         selectedToPocketValue: action.payload,
//       };
//     }
//     case actionTypes.UPDATE_SELECTED_FROM_POCKET_VALUE: {
//       const {selectedFromPocketValue, canSubmit} = action.payload;
//       return {
//         ...state,
//         canSubmit,
//         selectedFromPocketValue,
//       };
//     }
//   }
// }

// function swapInputsReducer(state: CurrencyState, action: Action): CurrencyState | undefined {
//   switch (action.type) {
//     case actionTypes.SWAP_INPUTS: {
//       const copy = {...state};
//       const updates = {
//         selectedFrom: copy.selectedTo,
//         selectedTo: copy.selectedFrom,
//         inputValueFrom: copy.inputValueTo,
//         selectedFromPocketValue: copy.selectedToPocketValue,
//       };
//       return {...state, ...updates};
//     }
//   }
// }

// function setDataPointsReducer(state: CurrencyState, action: Action): CurrencyState | undefined {
//   switch (action.type) {
//     case actionTypes.SET_DATA_POINTS: {
//       return {...state, dataPoints: action.payload};
//     }
//   }
// }

export default appReducer;
