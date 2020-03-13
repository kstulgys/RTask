/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {getCurrentRate, getDataPoints, getCurrencies, updatePockets} from 'services/exchangerates-api';
import {CurrencyDispatch, CurrencyState} from 'context/types';
import {ActionTypes} from 'context/actionTypes';
import {getSelected, getCanSubmit, waait, getPocketValue, getInputValue} from 'lib/utils';

async function setInitialData(dispatch: CurrencyDispatch) {
  dispatch({
    type: ActionTypes.SET_LOADING,
    payload: {isLoading: true},
  });

  try {
    const currencies = await getCurrencies();
    const selectedFrom = getSelected('GBP', currencies);
    const selectedTo = getSelected('USD', currencies);
    if (!selectedFrom || !selectedTo) {
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

function handleInputValueFromChange(dispatch: CurrencyDispatch, state: CurrencyState, inputValue: string) {
  if (!state.selectedTo || !state.selectedFrom) return;
  const selectedFromPocketValue = getPocketValue('From', state.selectedFrom.value, inputValue);
  const inputValueTo = getInputValue('To', state.currentRate, inputValue);
  const selectedToPocketValue = getPocketValue('To', state.selectedTo.value, inputValueTo);
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

function handleInputValueToChange(dispatch: CurrencyDispatch, state: CurrencyState, inputValue: string) {
  if (!state.selectedTo || !state.selectedFrom) return;
  const inputValueFrom = getInputValue('From', state.currentRate, inputValue);
  const selectedToPocketValue = getPocketValue('To', state.selectedTo.value, inputValue);
  const selectedFromPocketValue = getPocketValue('From', state.selectedFrom.value, inputValue);
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

async function handleCurencyRateChange(dispatch: CurrencyDispatch, state: CurrencyState) {
  if (!state.selectedTo || !state.selectedFrom) return;
  const inputValueTo = getInputValue('To', state.currentRate, state.inputValueFrom);
  const selectedToPocketValue = getPocketValue('To', state.selectedTo.value, inputValueTo);

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

async function handleCurrenciesSwapp(dispatch: CurrencyDispatch, state: CurrencyState) {
  if (state.selectedFrom && state.selectedTo) {
    const copy = {...state};
    const selectedFrom = copy.selectedTo;
    const selectedTo = copy.selectedFrom;
    const inputValueFrom = copy.inputValueTo;
    if (!selectedFrom || !selectedTo) return;
    const selectedFromPocketValue = getPocketValue('From', selectedFrom.value, inputValueFrom);
    const currentRate = await getCurrentRate({selectedFrom, selectedTo});
    const inputValueTo = getInputValue('To', currentRate, inputValueFrom);
    const selectedToPocketValue = getPocketValue('To', state.selectedTo.value, inputValueTo);
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

async function selectFromCurrency(dispatch: CurrencyDispatch, state: CurrencyState, name: string) {
  const selectedFrom = getSelected(name, state.currencies);
  if (!state.selectedFrom || !state.selectedTo || !selectedFrom) return;
  const currentRate = await getCurrentRate({selectedFrom, selectedTo: state.selectedTo});
  const selectedFromPocketValue = getPocketValue('From', selectedFrom.value, state.inputValueFrom);
  const inputValueTo = getInputValue('To', currentRate, state.inputValueFrom);
  const selectedToPocketValue = getPocketValue('To', state.selectedTo.value, inputValueTo);

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

async function selectToCurrency(dispatch: CurrencyDispatch, state: CurrencyState, name: string) {
  const selectedTo = getSelected(name, state.currencies);
  if (!state.selectedFrom || !state.selectedTo || !selectedTo) return;
  const currentRate = await getCurrentRate({selectedFrom: state.selectedFrom, selectedTo});
  const inputValueTo = getInputValue('To', currentRate, state.inputValueFrom);
  const selectedToPocketValue = getPocketValue('To', state.selectedTo.value, inputValueTo);

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
