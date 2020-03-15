/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {getCurrentRate, getDataPoints, getCurrencies, updatePockets} from 'services/exchangerates-api';
import {getSelected, getCanSubmit, waait, getPocketValue, getInputValue, isInputValue} from 'lib/utils';
import {CurrencyDispatch, CurrencyState, StatusTypes} from 'context/types';
import {ActionTypes} from 'context/actionTypes';

export type InitialDataPayload = Omit<CurrencyState, 'isSubmitting' | 'canSubmit' | 'inputValueFrom' | 'inputValueTo'>;
export type InputValueChangePayload = Pick<
  CurrencyState,
  'inputValueFrom' | 'pocketValueFrom' | 'canSubmit' | 'inputValueTo' | 'pocketValueTo'
>;
export type CurrencyRateChangePayload = Pick<
  CurrencyState,
  'inputValueTo' | 'pocketValueTo' | 'canSubmit' | 'dataPoints'
>;
export type CurrenciesSwappedPayload = Omit<
  CurrencyState,
  'isLoading' | 'status' | 'dataPoints' | 'currencies' | 'isLoading' | 'isSubmitting'
>;
export type SubmitValuesPayload = Pick<
  CurrencyState,
  'inputValueTo' | 'inputValueFrom' | 'selectedFrom' | 'selectedTo' | 'isSubmitting' | 'canSubmit' | 'status'
>;
export type CurrencyFromSelectedPayload = Pick<
  CurrencyState,
  'currentRate' | 'selectedFrom' | 'pocketValueFrom' | 'inputValueTo' | 'pocketValueTo' | 'dataPoints'
>;
export type CurrencyToSelectedPayload = Pick<
  CurrencyState,
  'currentRate' | 'selectedTo' | 'inputValueTo' | 'pocketValueTo' | 'dataPoints'
>;

interface CurrenciesFromStorage {
  from: string | null;
  to: string | null;
}

function getCurrenciesFromStorage(): CurrenciesFromStorage {
  const result = window.localStorage.getItem('currencies');
  if (!!result) {
    const {from, to} = JSON.parse(result);
    return {from, to};
  }
  return {from: null, to: null};
}
function setCurrenciesToStorage({from, to}: {from: string; to: string}) {
  window.localStorage.setItem('currencies', JSON.stringify({from, to}));
}

async function setInitialData(dispatch: CurrencyDispatch) {
  dispatch({
    type: ActionTypes.SET_INITIAL_DATA_START,
    payload: {isLoading: true},
  });

  try {
    const {from, to} = await getCurrenciesFromStorage();
    const currencies = await getCurrencies();
    const selectedFrom = getSelected(from ? from : 'GBP', currencies);
    const selectedTo = getSelected(to ? to : 'USD', currencies);
    if (!selectedFrom || !selectedTo) {
      dispatch({
        type: ActionTypes.SET_INITIAL_DATA_FAIL,
        payload: {
          isLoading: false,
          status: StatusTypes.error,
        },
      });
      return;
    }
    const currentRate = await getCurrentRate({selectedFrom, selectedTo});
    const dataPoints = await getDataPoints({daysAgo: 30, selectedTo, selectedFrom});
    const pocketValueTo = selectedTo.value;
    const pocketValueFrom = selectedFrom.value;
    const payload: InitialDataPayload = {
      pocketValueTo,
      pocketValueFrom,
      isLoading: false,
      currencies,
      selectedFrom,
      selectedTo,
      currentRate,
      dataPoints,
      status: StatusTypes.idle,
    };
    dispatch({
      type: ActionTypes.SET_INITIAL_DATA_SUCCESS,
      payload,
    });
  } catch (error) {
    console.log(error.toString());
    dispatch({
      type: ActionTypes.SET_INITIAL_DATA_FAIL,
      payload: {
        isLoading: false,
        status: StatusTypes.error,
      },
    });
  }
}

function handleInputValueFromChange(dispatch: CurrencyDispatch, state: CurrencyState, inputValue: string) {
  if (!state.selectedTo || !state.selectedFrom || !isInputValue(inputValue)) return;
  const inputValueTo = getInputValue('To', state.currentRate, inputValue);
  const pocketValueTo = getPocketValue('To', state.selectedTo.value, inputValueTo);
  const pocketValueFrom = getPocketValue('From', state.selectedFrom.value, inputValue);
  const canSubmit = getCanSubmit({pocketValueFrom, inputValueFrom: +inputValue});
  const payload: InputValueChangePayload = {
    inputValueFrom: +inputValue,
    pocketValueFrom,
    inputValueTo,
    pocketValueTo,
    canSubmit,
  };
  dispatch({
    type: ActionTypes.INPUT_VALUE_FROM_CHANGED,
    payload,
  });
}

function handleInputValueToChange(dispatch: CurrencyDispatch, state: CurrencyState, inputValue: string) {
  if (!state.selectedTo || !state.selectedFrom || !isInputValue(inputValue)) return;
  const pocketValueFrom = getPocketValue('From', state.selectedFrom.value, inputValue);
  const inputValueFrom = getInputValue('From', state.currentRate, inputValue);
  const pocketValueTo = getPocketValue('To', state.selectedTo.value, inputValue);
  const canSubmit = getCanSubmit({pocketValueFrom, inputValueFrom});
  const payload: InputValueChangePayload = {
    inputValueTo: +inputValue,
    pocketValueTo,
    inputValueFrom,
    pocketValueFrom,
    canSubmit,
  };
  dispatch({
    type: ActionTypes.INPUT_VALUE_TO_CHANGED,
    payload,
  });
}

async function handleCurencyRateChange(dispatch: CurrencyDispatch, state: CurrencyState) {
  if (!state.selectedTo || !state.selectedFrom) return;
  const inputValueTo = getInputValue('To', state.currentRate, state.inputValueFrom);
  const pocketValueTo = getPocketValue('To', state.selectedTo.value, inputValueTo);
  const canSubmit = getCanSubmit({pocketValueFrom: state.pocketValueFrom, inputValueFrom: state.inputValueFrom});
  // TODO: handle error
  const dataPoints = await getDataPoints({
    daysAgo: 30,
    selectedTo: state.selectedTo,
    selectedFrom: state.selectedFrom,
  });
  const payload: CurrencyRateChangePayload = {
    inputValueTo,
    pocketValueTo,
    dataPoints,
    canSubmit,
  };
  dispatch({
    type: ActionTypes.CURRENCY_RATE_CHANGED,
    payload,
  });
}

async function handleCurrenciesSwapp(dispatch: CurrencyDispatch, state: CurrencyState) {
  if (state.selectedFrom && state.selectedTo) {
    const copy = {...state};
    const selectedFrom = copy.selectedTo;
    const selectedTo = copy.selectedFrom;
    const inputValueFrom = copy.inputValueTo;
    if (!selectedFrom || !selectedTo) return;
    setCurrenciesToStorage({from: selectedFrom.name, to: selectedTo.name});
    const pocketValueFrom = getPocketValue('From', selectedFrom.value, inputValueFrom);
    const currentRate = await getCurrentRate({selectedFrom, selectedTo});
    const inputValueTo = getInputValue('To', currentRate, inputValueFrom);
    const pocketValueTo = getPocketValue('To', state.selectedTo.value, inputValueTo);
    const canSubmit = getCanSubmit({pocketValueFrom, inputValueFrom});
    const payload: CurrenciesSwappedPayload = {
      selectedFrom,
      selectedTo,
      inputValueFrom,
      pocketValueFrom,
      currentRate,
      inputValueTo,
      pocketValueTo,
      canSubmit,
    };
    dispatch({
      type: ActionTypes.CURRENCIES_SWAPPED,
      payload,
    });
  }
}

async function handleValuesSubmit(dispatch: CurrencyDispatch, state: CurrencyState) {
  const canSubmit = getCanSubmit({pocketValueFrom: state.pocketValueFrom, inputValueFrom: state.inputValueFrom});
  if (!state.selectedFrom || !state.selectedTo || !canSubmit) return;
  dispatch({
    type: ActionTypes.SUBMIT_VALUES_START,
    payload: {isSubmitting: true},
  });
  try {
    const from = {currency: state.selectedFrom.name, amount: state.inputValueFrom};
    const to = {currency: state.selectedTo.name, amount: state.inputValueTo};
    await updatePockets({from, to});
    await waait();
    const payload: SubmitValuesPayload = {
      inputValueTo: 0,
      inputValueFrom: 0,
      selectedFrom: {...state.selectedFrom, value: state.pocketValueFrom},
      selectedTo: {...state.selectedTo, value: state.pocketValueTo},
      isSubmitting: false,
      canSubmit: false,
      status: StatusTypes.success,
    };
    dispatch({
      type: ActionTypes.SUBMIT_VALUES_SUCCESS,
      payload,
    });
  } catch (error) {
    dispatch({
      type: ActionTypes.SUBMIT_VALUES_FAIL,
      payload: {
        isSubmitting: false,
        status: StatusTypes.error,
      },
    });
  }
}

async function selectFromCurrency(dispatch: CurrencyDispatch, state: CurrencyState, name: string) {
  const selectedFrom = getSelected(name, state.currencies);
  if (!state.selectedTo || !selectedFrom) return;
  setCurrenciesToStorage({from: selectedFrom.name, to: state.selectedTo.name});
  // TODO: handle error
  const currentRate = await getCurrentRate({selectedFrom, selectedTo: state.selectedTo});
  const pocketValueFrom = getPocketValue('From', selectedFrom.value, state.inputValueFrom);
  const inputValueTo = getInputValue('To', currentRate, state.inputValueFrom);
  const pocketValueTo = getPocketValue('To', state.selectedTo.value, inputValueTo);
  const dataPoints = await getDataPoints({
    daysAgo: 30,
    selectedTo: state.selectedTo,
    selectedFrom: selectedFrom,
  });
  const payload: CurrencyFromSelectedPayload = {
    currentRate,
    selectedFrom,
    pocketValueFrom,
    inputValueTo,
    pocketValueTo,
    dataPoints,
  };
  dispatch({
    type: ActionTypes.CURRENCY_FROM_SELECTED,
    payload,
  });
}

async function selectToCurrency(dispatch: CurrencyDispatch, state: CurrencyState, name: string) {
  const selectedTo = getSelected(name, state.currencies);
  if (!state.selectedFrom || !state.selectedTo || !selectedTo) return;
  setCurrenciesToStorage({from: state.selectedFrom.name, to: selectedTo.name});
  // TODO: handle error
  const currentRate = await getCurrentRate({selectedFrom: state.selectedFrom, selectedTo});
  const inputValueTo = getInputValue('To', currentRate, state.inputValueFrom);
  const pocketValueTo = getPocketValue('To', state.selectedTo.value, inputValueTo);
  const dataPoints = await getDataPoints({
    daysAgo: 30,
    selectedTo: selectedTo,
    selectedFrom: state.selectedFrom,
  });
  const payload: CurrencyToSelectedPayload = {
    currentRate,
    selectedTo,
    pocketValueTo,
    inputValueTo,
    dataPoints,
  };
  dispatch({
    type: ActionTypes.CURRENCY_TO_SELECTED,
    payload,
  });
}

export {
  handleInputValueFromChange,
  handleInputValueToChange,
  handleCurencyRateChange,
  handleCurrenciesSwapp,
  selectFromCurrency,
  selectToCurrency,
  setInitialData,
  handleValuesSubmit,
};
