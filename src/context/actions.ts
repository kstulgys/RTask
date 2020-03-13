/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {getCurrentRate, getDataPoints, getCurrencies, updatePockets} from 'services/exchangerates-api';
import {CurrencyDispatch, CurrencyState} from 'context/types';
import {ActionTypes} from 'context/actionTypes';
import {getSelected, getCanSubmit, waait} from 'lib/utils';
// SET_INITIAL_DATA
// getCurrencies ✅
// set From and To {name,value}{name,value} ✅
// get currentRate ✅
// get dataPoints ✅
// get isLoading ✅
// ----
// get filteredFrom ✅
// get filteredTo ✅

async function setInitialData(dispatch: CurrencyDispatch) {
  dispatch({
    type: ActionTypes.SET_LOADING,
    payload: {isLoading: true},
  });

  try {
    const currencies = await getCurrencies();
    const selectedFrom = getSelected('GBP', currencies);
    const selectedTo = getSelected('USD', currencies);
    if (!selectedFrom || !selectedTo || !currencies) {
      dispatch({
        type: ActionTypes.SET_LOADING,
        payload: {
          isLoading: false,
          status: 'error',
        },
      });
      return;
    }
    const currentRate = await getCurrentRate({selectedFrom, selectedTo});
    const dataPoints = await getDataPoints({daysAgo: 30, selectedTo, selectedFrom});
    const selectedToPocketValue = selectedTo.value;
    const selectedFromPocketValue = selectedFrom.value;

    dispatch({
      type: ActionTypes.SET_INITIAL_DATA,
      payload: {
        selectedToPocketValue,
        selectedFromPocketValue,
        isLoading: false,
        currencies,
        selectedFrom,
        selectedTo,
        currentRate,
        dataPoints,
      },
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: ActionTypes.SET_LOADING,
      payload: {
        isLoading: false,
        status: 'error',
      },
    });
  }
}

// INPUT_FROM_VALUE_CHANGED
// update inputFromValue ✅
// update From pocket value ✅
// update inputToValue ✅
// update To pocket value ✅
// update canSubmit ✅

function handleInputValueFromChange(dispatch: CurrencyDispatch, state: CurrencyState, inputValue: string) {
  if (!state.selectedTo || !state.selectedFrom) return;
  const selectedFromPocketValue = +(state.selectedFrom.value - Number(inputValue)).toFixed(2);
  const inputValueTo = +(+inputValue * state.currentRate).toFixed(2);
  const selectedToPocketValue = +(state.selectedTo.value + inputValueTo).toFixed(2);
  const canSubmit = getCanSubmit({selectedFromPocketValue, inputValueFrom: +inputValue});

  dispatch({
    type: ActionTypes.INPUT_VALUE_FROM_CHANGED,
    payload: {
      inputValueFrom: +inputValue,
      selectedFromPocketValue,
      canSubmit,
      inputValueTo,
      selectedToPocketValue,
    },
  });
}

// INPUT_TO_VALUE_CHANGED
// update inputToValue ✅
// update To pocket value ✅
// update inputFromValue ✅
// update From pocket value ✅
// update canSubmit ✅

function handleInputValueToChange(dispatch: CurrencyDispatch, state: CurrencyState, inputValue: string) {
  if (!state.selectedTo || !state.selectedFrom) return;
  const inputValueFrom = +(+inputValue / state.currentRate).toFixed(2);
  const selectedToPocketValue = +(+inputValue + state.selectedTo.value).toFixed(2);
  const selectedFromPocketValue = +(state.selectedFrom.value - inputValueFrom).toFixed(2);
  const canSubmit = getCanSubmit({selectedFromPocketValue, inputValueFrom});

  dispatch({
    type: ActionTypes.INPUT_VALUE_TO_CHANGED,
    payload: {
      inputValueTo: +inputValue,
      selectedToPocketValue,
      inputValueFrom,
      selectedFromPocketValue,
      canSubmit,
    },
  });
}

// CURRENCY_RATE_CHANGED
// update inputToValue ✅
// update To pocket value ✅
// update chart data ✅

async function handleCurencyRateChange(dispatch: CurrencyDispatch, state: CurrencyState) {
  if (!state.selectedTo || !state.selectedFrom) return;
  const inputValueTo = +(state.inputValueFrom * state.currentRate).toFixed(2);
  const selectedToPocketValue = +(state.selectedTo.value + inputValueTo).toFixed(2);
  const dataPoints = await getDataPoints({
    daysAgo: 30,
    selectedTo: state.selectedTo,
    selectedFrom: state.selectedFrom,
  });

  dispatch({
    type: ActionTypes.CURRENCY_RATE_CHANGED,
    payload: {
      inputValueTo,
      selectedToPocketValue,
      dataPoints,
    },
  });
}

// CURRENCIES_SWAPPED
// update selectedFrom = selectedTo {name,value} ✅
// update selectedTo = selectedFrom {name,value}✅
// --- IF !!inputValueTo ---
// update inputValueFrom = inputValueTo ✅
// update selectedFromPocketValue (was + now - inputValueFrom) ✅
// ---
// get currentRate ✅
// update inputValueTo ✅
// update canSubmit ✅
// update selectedToPocketValue (was - now + inputValueTo) ✅

async function handleCurrenciesSwapp(dispatch: CurrencyDispatch, state: CurrencyState) {
  if (state.selectedFrom && state.selectedTo) {
    const copy = {...state};
    const selectedFrom = copy.selectedTo;
    const selectedTo = copy.selectedFrom;
    const inputValueFrom = copy.inputValueTo;
    if (!selectedFrom || !selectedTo) return;
    const selectedFromPocketValue = +(selectedFrom.value - inputValueFrom).toFixed(2);
    const currentRate = await getCurrentRate({selectedFrom, selectedTo});
    const inputValueTo = +(currentRate * inputValueFrom).toFixed(2);
    const selectedToPocketValue = +(inputValueTo + selectedTo.value).toFixed(2);
    const canSubmit = getCanSubmit({selectedFromPocketValue, inputValueFrom});

    dispatch({
      type: ActionTypes.CURRENCIES_SWAPPED,
      payload: {
        selectedFrom,
        selectedTo,
        inputValueFrom,
        selectedFromPocketValue,
        currentRate,
        inputValueTo,
        selectedToPocketValue,
        canSubmit,
      },
    });
  }
}

// SUBMIT_VALUES_SUCCESS
// update inputFromValue = 0 ✅
// update inputToValue = 0 ✅
// update canSubmit = false ✅

async function handleValuesSubmit(dispatch: CurrencyDispatch, state: CurrencyState) {
  if (!state.selectedFrom || !state.selectedTo) return;
  dispatch({
    type: ActionTypes.SUBMIT_VALUES_START,
    payload: {isSubmitting: true},
  });
  try {
    const from = {currency: state.selectedFrom.name, amount: state.inputValueFrom};
    const to = {currency: state.selectedTo.name, amount: state.inputValueTo};
    await updatePockets({from, to});

    await waait();
    dispatch({
      type: ActionTypes.SUBMIT_VALUES_SUCCESS,
      payload: {
        inputValueTo: 0,
        inputValueFrom: 0,
        selectedFrom: {...state.selectedFrom, value: state.selectedFromPocketValue},
        selectedTo: {...state.selectedTo, value: state.selectedToPocketValue},
        isSubmitting: false,
        canSubmit: false,
        status: 'success',
      },
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: ActionTypes.SUBMIT_VALUES_FAIL,
      payload: {
        isSubmitting: false,
        status: 'error',
      },
    });
  }
}

// CURRENCY_FROM_SELECTED
// get currencyRate ✅
// update currencyFrom ✅
// update from pocket ✅
// update inputValueTo ✅
// update selectedToPocketValue ✅
// update get dataPoints ✅

async function selectFromCurrency(dispatch: CurrencyDispatch, state: CurrencyState, name: string) {
  const selectedFrom = getSelected(name, state.currencies);
  if (!state.selectedFrom || !state.selectedTo || !selectedFrom) return;
  const currentRate = await getCurrentRate({selectedFrom, selectedTo: state.selectedTo});
  const selectedFromPocketValue = +(selectedFrom.value - state.inputValueFrom).toFixed(2);
  const inputValueTo = +(currentRate * state.inputValueFrom).toFixed(2);
  const selectedToPocketValue = +(inputValueTo + state.selectedTo.value).toFixed(2);
  const dataPoints = await getDataPoints({
    daysAgo: 30,
    selectedTo: state.selectedTo,
    selectedFrom: selectedFrom,
  });

  dispatch({
    type: ActionTypes.CURRENCY_FROM_SELECTED,
    payload: {
      currentRate,
      selectedFrom,
      selectedFromPocketValue,
      inputValueTo,
      selectedToPocketValue,
      dataPoints,
    },
  });
}

// CURRENCY_TO_SELECTED
// get currencyRate ✅
// update selectedTo ✅
// update inputValueTo ✅
// update selectedToPocketValue  ✅
// update get dataPoints ✅

async function selectToCurrency(dispatch: CurrencyDispatch, state: CurrencyState, name: string) {
  const selectedTo = getSelected(name, state.currencies);
  if (!state.selectedFrom || !state.selectedTo || !selectedTo) return;
  const currentRate = await getCurrentRate({selectedFrom: state.selectedFrom, selectedTo});
  const inputValueTo = +(currentRate * state.inputValueFrom).toFixed(2);
  const selectedToPocketValue = +(inputValueTo + selectedTo.value).toFixed(2);
  const dataPoints = await getDataPoints({
    daysAgo: 30,
    selectedTo: selectedTo,
    selectedFrom: state.selectedFrom,
  });

  dispatch({
    type: ActionTypes.CURRENCY_TO_SELECTED,
    payload: {
      currentRate,
      selectedTo,
      inputValueTo,
      selectedToPocketValue,
      dataPoints,
    },
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
