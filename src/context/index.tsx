import * as React from 'react';
import {getCurrencies, getCurrentRate, updatePockets} from '../services/exchangerates-api';
import {Currency, Currencies, CurrencyState, CurrencyDispatch, CurrencyProviderProps, Action} from './types';
import actions from './actions';
import reducer from './reducer';
import {FromOrTo, Label} from 'screens/types';
import {
  useSetInitialState,
  useSetInitialCurrencies,
  useCurrencyRatePolling,
  useUpdatePockets,
  useDataPoints,
  useOnRateChanged,
} from 'lib/hooks';
import {setInitialData} from 'lib/utils/helpers';

const initialState: CurrencyState = {
  isSubmitting: false,
  selectedFromPocketValue: 0,
  selectedToPocketValue: 0,
  canSubmit: false,
  isLoading: true,
  filteredFrom: [],
  filteredTo: [],
  selectedFrom: null,
  selectedTo: null,
  currencies: [],
  dataPoints: [],
  historyDaysAgo: 30,
  currentRate: 0,
  inputValueFrom: 0,
  inputValueTo: 0,
  error: null,
};

const CurrencyStateContext = React.createContext<CurrencyState>(initialState);
const CurrencyDispatchContext = React.createContext<React.Dispatch<Action>>({} as React.Dispatch<Action>);

function CurrencyProvider({children}: CurrencyProviderProps): JSX.Element {
  const [state, dispatch] = React.useReducer<React.Reducer<CurrencyState, Action>>(reducer, initialState);
  const {selectedFrom, selectedTo, currencies, inputValueFrom, inputValueTo, currentRate} = state;

  React.useEffect(() => {
    setInitialData(dispatch);
  }, []);

  // useUpdatePockets({dispatch, inputValueFrom, inputValueTo, selectedFrom, selectedTo});
  // useCurrencyRatePolling({dispatch, selectedFrom, selectedTo});
  // useDataPoints({dispatch, selectedFrom, selectedTo});
  // useOnRateChanged({dispatch, currentRate, inputValueFrom, selectedTo});
  // // Set initial data
  // useSetInitialCurrencies({dispatch, currencies});
  // useSetInitialState(dispatch);

  return (
    <CurrencyStateContext.Provider value={state}>
      <CurrencyDispatchContext.Provider value={dispatch}>{children}</CurrencyDispatchContext.Provider>
    </CurrencyStateContext.Provider>
  );
}

function useCurrencyState() {
  const state = React.useContext(CurrencyStateContext);
  const dispatch = useCurrencyDispatch();
  const methods = useMethods(state, dispatch);
  if (methods === undefined) {
    throw new Error('useCurrencyState must be used within a CurrencyProvider');
  }
  return {...state, ...methods};
}

function useCurrencyDispatch() {
  const dispatch = React.useContext(CurrencyDispatchContext);
  if (dispatch === undefined) {
    throw new Error('useCurrencyDispatch must be used within a CurrencyProvider');
  }
  return dispatch;
}

function useMethods(state: CurrencyState, dispatch: CurrencyDispatch): any {
  function currencySelect({type, name}: {type: FromOrTo; name: string}): void {
    const currencyFound = state.currencies.find(c => c.name === name);
    const actionType = type === Label.from ? actions.SELECT_FROM_CURRENCY : actions.SELECT_TO_CURRENCY;

    if (actionType && !!currencyFound) {
      dispatch({
        type: actionType,
        payload: currencyFound,
      });
    }
  }

  function filterCurrencies({type, searchTerm}: {type: string; searchTerm: string}): void {
    const payload = state.currencies.filter(c => c.name.includes(searchTerm.toUpperCase()));
    const actionType = type === Label.from ? actions.SET_FILTERED_FROM_CURRENCIES : actions.SET_FILTERED_TO_CURRENCIES;
    dispatch({
      type: actionType,
      payload,
    });
  }

  function changeInputValue({input, type}: {input: string; type: FromOrTo}): void {
    const reachedDecimals = input[input.length - 4] === '.' || input[input.length - 4] === ',';
    if (reachedDecimals) return;
    const actionType = type === Label.from ? actions.FROM_INPUT_CHANGED : actions.TO_INPUT_CHANGED;
    const swappedActionType = type === Label.from ? actions.TO_INPUT_CHANGED : actions.FROM_INPUT_CHANGED;
    const operationOnToValue = (input: number): number => +(input * state.currentRate).toFixed(2);
    const operationOnFromValue = (input: number): number => +(input / state.currentRate).toFixed(2);
    const operation = type === Label.from ? operationOnToValue : operationOnFromValue;
    const computedValue = operation(+input);

    dispatch({
      type: actionType,
      payload: +input,
    });

    dispatch({
      type: swappedActionType,
      payload: computedValue,
    });
  }

  function swapInputs(): void {
    // const operationOnToValue = (input: number): number => +(input * state.currentRate).toFixed(2);
    // get new rate
    // if (state.selectedTo && state.selectedFrom) {
    //   currencySelect({type: Label.from, name: state.selectedTo.name});
    //   currencySelect({type: Label.to, name: state.selectedFrom.name});
    // }
    // to value becomes from
    // dispatch({
    //   type: actions.FROM_INPUT_CHANGED,
    //   payload: state.inputValueTo,
    // });
    // do recalculation
    dispatch({
      type: actions.SWAP_INPUTS,
    });
    // changeInputValue({input: state.inputValueFrom + '', type: Label.from});
  }

  async function submitPockets() {
    if (state.selectedFrom && state.selectedTo) {
      const from = {currency: state.selectedFrom.name, amount: state.inputValueFrom};
      const to = {currency: state.selectedTo.name, amount: state.inputValueTo};

      dispatch({
        type: actions.UPDATE_POCKETS_START,
      });
      try {
        await waait();
        await updatePockets({from, to});
        dispatch({
          type: actions.UPDATE_POCKETS_SUCCESS,
        });
      } catch (error) {
        console.log('Failed to update  pockets');
        dispatch({
          type: actions.UPDATE_POCKETS_FAIL,
          payload: 'Failed to update  pockets',
        });
      }
    }
  }

  return {
    submitPockets,
    filterCurrencies,
    currencySelect,
    changeInputValue,
    swapInputs,
  };
}

function waait() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, 2000);
  });
}

export {CurrencyProvider, useCurrencyState};
