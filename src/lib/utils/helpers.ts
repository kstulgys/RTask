/* eslint-disable @typescript-eslint/explicit-function-return-type */
// ACTIONS

import {getCurrentRate, getDataPoints, getCurrencies, updatePockets} from 'services/exchangerates-api';
import {CurrencyDispatch, CurrencyState, Currencies} from 'context/types';
import actions from 'context/actions';
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
    type: actions.SET_LOADING,
    payload: true,
  });

  try {
    const currencies = await getCurrencies();
    const selectedFrom = getSelected('GBP', currencies);
    const selectedTo = getSelected('USD', currencies);
    if (selectedFrom && selectedTo) {
      const currentRate = await getCurrentRate({selectedFrom, selectedTo});
      const dataPoints = await getDataPoints({daysAgo: 30, selectedTo, selectedFrom});
      const selectedToPocketValue = selectedTo.value;
      const selectedFromPocketValue = selectedFrom.value;

      console.log('got hetreeee');
      dispatch({
        type: actions.SET_INITIAL_DATA,
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
    } else {
      dispatch({
        type: actions.SET_LOADING,
        payload: {
          isLoading: false,
          error: 'Something went wrong. Please try again later.',
        },
      });
    }
  } catch (error) {
    console.log(error);
    dispatch({
      type: actions.SET_LOADING,
      payload: {
        isLoading: false,
        error: 'Something went wrong. Please try again later.',
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
  if (state.selectedFrom && state.selectedTo) {
    const selectedFromPocketValue = +(state.selectedFrom.value - +inputValue).toFixed(2);
    const inputValueTo = +(+inputValue * state.currentRate).toFixed(2);
    const selectedToPocketValue = +(state.selectedTo.value + inputValueTo).toFixed(2);
    const canSubmit = getCanSubmit({selectedFromPocketValue});

    dispatch({
      type: actions.INPUT_VALUE_FROM_CHANGED,
      payload: {
        inputValueFrom: +inputValue,
        selectedFromPocketValue,
        canSubmit,
        inputValueTo,
        selectedToPocketValue,
      },
    });
  }
}

// INPUT_TO_VALUE_CHANGED
// update inputToValue ✅
// update To pocket value ✅
// update inputFromValue ✅
// update From pocket value ✅
// update canSubmit ✅

function handleInputValueToChange(dispatch: CurrencyDispatch, state: CurrencyState, inputValue: string) {
  if (state.selectedFrom && state.selectedTo) {
    const inputValueFrom = +(+inputValue / state.currentRate).toFixed(2);
    const selectedToPocketValue = +(inputValueFrom + state.selectedTo.value).toFixed(2);
    const selectedFromPocketValue = +(state.selectedFrom.value - inputValueFrom).toFixed(2);
    const canSubmit = getCanSubmit({selectedFromPocketValue});

    dispatch({
      type: actions.INPUT_VALUE_TO_CHANGED,
      payload: {
        inputValueTo: +inputValue,
        selectedToPocketValue,
        inputValueFrom,
        selectedFromPocketValue,
        canSubmit,
      },
    });
  }
}

// CURRENCY_RATE_CHANGED
// update inputToValue ✅
// update To pocket value ✅
// update chart data ✅

async function handleCurencyRateChange(dispatch: CurrencyDispatch, state: CurrencyState) {
  if (state.selectedTo && state.selectedFrom) {
    const inputValueTo = +(state.inputValueTo * state.currentRate).toFixed(2);
    const selectedToPocketValue = +(state.selectedTo.value + inputValueTo).toFixed(2);
    const dataPoints = await getDataPoints({
      daysAgo: 30,
      selectedTo: state.selectedTo,
      selectedFrom: state.selectedFrom,
    });

    dispatch({
      type: actions.CURRENCY_RATE_CHANGED,
      payload: {
        inputValueTo,
        selectedToPocketValue,
        dataPoints,
      },
    });
  }
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
    if (selectedFrom && selectedTo) {
      const selectedFromPocketValue = +(selectedFrom.value - inputValueFrom).toFixed(2);
      const currentRate = await getCurrentRate({selectedFrom, selectedTo});
      const inputValueTo = +(currentRate * inputValueFrom).toFixed(2);
      const selectedToPocketValue = +(inputValueTo + selectedTo.value).toFixed(2);
      const canSubmit = getCanSubmit({selectedFromPocketValue});

      dispatch({
        type: actions.CURRENCIES_SWAPPED,
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
}

// SUBMIT_VALUES_SUCCESS
// update inputFromValue = 0 ✅
// update inputToValue = 0 ✅
// update canSubmit = false ✅

async function submitValues(dispatch: CurrencyDispatch, state: CurrencyState) {
  if (state.selectedFrom && state.selectedTo) {
    dispatch({
      type: actions.SUBMIT_VALUES_START,
      payload: {isSubmitting: true},
    });
    try {
      const from = {currency: state.selectedFrom.name, amount: state.inputValueFrom};
      const to = {currency: state.selectedTo.name, amount: state.inputValueTo};
      await updatePockets({from, to});

      dispatch({
        type: actions.SUBMIT_VALUES_SUCCESS,
        payload: {
          inputFromValue: 0,
          inputToValue: 0,
          isSubmitting: false,
          canSubmit: false,
        },
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: actions.SUBMIT_VALUES_FAIL,
        payload: {
          isSubmitting: false,
          error: 'Something went wrong',
        },
      });
    }
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
  if (state.selectedFrom && state.selectedTo) {
    const selectedFrom = getSelected(name, state.currencies);
    if (selectedFrom) {
      const currentRate = await getCurrentRate({selectedFrom, selectedTo: state.selectedTo});
      const selectedFromPocketValue = +(selectedFrom.value - state.inputValueFrom).toFixed(2);
      const inputValueTo = +(currentRate * state.inputValueFrom).toFixed(2);
      const selectedToPocketValue = +(inputValueTo + state.selectedTo.value).toFixed(2);
      const dataPoints = await getDataPoints({
        daysAgo: 30,
        selectedTo: state.selectedTo,
        selectedFrom: state.selectedFrom,
      });

      dispatch({
        type: actions.CURRENCY_FROM_SELECTED,
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
  }
}

// CURRENCY_TO_SELECTED
// get currencyRate ✅
// update selectedTo ✅
// update inputValueTo ✅
// update selectedToPocketValue  ✅
// update get dataPoints ✅

async function selectToCurrency(dispatch: CurrencyDispatch, state: CurrencyState, name: string) {
  if (state.selectedFrom && state.selectedTo) {
    const selectedTo = getSelected(name, state.currencies);
    if (selectedTo) {
      const currentRate = await getCurrentRate({selectedFrom: state.selectedFrom, selectedTo});
      const inputValueTo = +(currentRate * state.inputValueFrom).toFixed(2);
      const selectedToPocketValue = +(inputValueTo + state.selectedTo.value).toFixed(2);
      const dataPoints = await getDataPoints({
        daysAgo: 30,
        selectedTo: state.selectedTo,
        selectedFrom: state.selectedFrom,
      });

      dispatch({
        type: actions.CURRENCY_TO_SELECTED,
        payload: {
          currentRate,
          selectedTo,
          inputValueTo,
          selectedToPocketValue,
          dataPoints,
        },
      });
    }
  }
}

function getSelected(name: string, currencies: Currencies) {
  return currencies.find(c => c.name === name);
}

function getFiltered(searchTerm: string, currencies: Currencies) {
  return currencies.filter(c => c.name.includes(searchTerm.toUpperCase()));
}

function getCanSubmit({selectedFromPocketValue}: {selectedFromPocketValue: number}) {
  return Math.sign(selectedFromPocketValue) !== -1;
}

function getPocketValue(totalValue: number, inputValue: number) {
  return +(totalValue - inputValue).toFixed(2);
}

export {setInitialData};
