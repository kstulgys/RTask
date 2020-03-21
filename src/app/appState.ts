/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from 'app/store';
import {getCurrencies, getCurrentRate, getDataPoints, updatePockets, UpdatePocketsProps} from 'api/currenciesAPI';
import {
  getSelected,
  getCanSubmit,
  isValidInput,
  getCurrenciesFromStorage,
  getInputValueTo,
  getInputValueFrom,
  getPocketValueTo,
  getPocketValueFrom,
} from 'utils/helpers';
import {Currencies, CurrencyState, Currency, DataPoints} from 'app/types';

export const initialState: CurrencyState = {
  isLoading: true,
  isSubmitting: false,
  pocketValueFrom: 0,
  pocketValueTo: 0,
  canSubmit: false,
  selectedFrom: null,
  selectedTo: null,
  currencies: [],
  dataPoints: [],
  currentRate: null,
  inputValueFrom: '',
  inputValueTo: '',
  error: null,
  timesSubmitted: 0,
};

interface GetCurrenciesSuccessPayload {
  currencies: Currencies;
  currentRate: number;
  dataPoints: {x: number; y: number}[];
  selectedFrom: Currency | undefined;
  selectedTo: Currency | undefined;
}

const appReducer = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // get currencies
    getCurrenciesSuccess(state, action: PayloadAction<GetCurrenciesSuccessPayload>) {
      const {currencies, currentRate, dataPoints, selectedFrom, selectedTo} = action.payload;
      if (!selectedFrom || !selectedTo) return;
      state.currencies = currencies;
      state.selectedFrom = selectedFrom;
      state.selectedTo = selectedTo;
      state.currentRate = currentRate;
      state.dataPoints = dataPoints;
      state.isLoading = false;
      state.error = null;
      state.pocketValueFrom = +selectedFrom.value;
      state.pocketValueTo = +selectedTo.value;
      state.inputValueFrom = '';
      state.inputValueTo = '';
    },
    getCurrenciesFail(state) {
      state.isLoading = false;
      state.error = {message: `Something went wrong.`, type: 'warning'};
    },
    // get current rate
    getCurrentRateStart(state) {
      state.currentRate = null;
    },
    getCurrentRateSuccess(state, action: PayloadAction<{currentRate: number; dataPoints: DataPoints}>) {
      const {dataPoints, currentRate} = action.payload;
      state.currentRate = currentRate;
      state.dataPoints = dataPoints;
      state.error = null;
    },
    getCurrentRateFail(state) {
      if (!state.selectedTo) return;
      state.currentRate = null;
      state.error = {message: `Could not get ${state.selectedTo.name} current rate.`, type: 'warning'};
    },
    // get data points
    getDataPointsSuccess(state, action: PayloadAction<{x: number; y: number}[]>) {
      state.dataPoints = action.payload;
    },
    getDataPointsFail(state) {
      if (!state.selectedTo) return;
      state.dataPoints = [];
      state.error = {message: `Could not get ${state.selectedTo.name} history data.`, type: 'warning'};
    },
    // handle update
    handleStateUpdate(state) {
      if (!state.selectedTo || !state.currentRate) return;
      state.inputValueTo = getInputValueTo(state.inputValueFrom, state.currentRate);
      state.pocketValueTo = getPocketValueTo(state.selectedTo.value, state.inputValueTo);
    },
    // handle change
    handleInputChangeFrom(state, action: PayloadAction<string>) {
      if (!state.selectedFrom || !state.selectedTo || !state.currentRate || !isValidInput(action.payload)) return;
      state.inputValueTo = getInputValueTo(action.payload, state.currentRate);
      state.pocketValueFrom = getPocketValueFrom(state.selectedFrom.value, action.payload);
      state.pocketValueTo = getPocketValueTo(state.selectedTo.value, state.inputValueTo);
      state.canSubmit = getCanSubmit({pocketValueFrom: state.pocketValueFrom, inputValueFrom: +action.payload});
      state.inputValueFrom = action.payload;
    },
    handleInputChangeTo(state, action: PayloadAction<string>) {
      if (!state.selectedTo || !state.selectedFrom || !state.currentRate || !isValidInput(action.payload)) return;
      state.inputValueTo = action.payload;
      state.inputValueFrom = getInputValueFrom(state.inputValueTo, state.currentRate);
      state.pocketValueTo = getPocketValueTo(state.selectedTo.value, action.payload);
      state.pocketValueFrom = getPocketValueFrom(state.selectedFrom.value, state.inputValueFrom);
      state.canSubmit = getCanSubmit({pocketValueFrom: state.pocketValueFrom, inputValueFrom: +state.inputValueFrom});
    },
    // handle swap
    handleCurrenciesSwapp(state, action: PayloadAction<number>) {
      if (!state.selectedFrom || !state.selectedTo) return;
      const selectedTo = state.selectedFrom;
      const selectedFrom = state.selectedTo;
      state.selectedTo = selectedTo;
      state.selectedFrom = selectedFrom;
      state.inputValueFrom = state.inputValueTo;
      state.pocketValueFrom = getPocketValueFrom(state.selectedFrom.value, state.inputValueFrom);
      state.currentRate = action.payload;
      state.canSubmit = getCanSubmit({pocketValueFrom: state.pocketValueFrom, inputValueFrom: +state.inputValueFrom});
    },
    handleSelectFrom(state, action: PayloadAction<Currency>) {
      if (!state.selectedTo) return;
      state.selectedFrom = action.payload;
      state.pocketValueFrom = getPocketValueFrom(state.selectedFrom.value, state.inputValueFrom);
      state.canSubmit = getCanSubmit({
        pocketValueFrom: state.pocketValueFrom,
        inputValueFrom: +state.inputValueFrom,
      });
    },
    handleSelectTo(state, action: PayloadAction<Currency>) {
      state.selectedTo = action.payload;
      state.pocketValueTo = getPocketValueTo(state.selectedTo.value, state.inputValueTo);
    },
    // handle submit
    handleCurrenciesSubmitStart(state) {
      if (!state.canSubmit) return;
      state.isSubmitting = true;
    },
    handleCurrenciesSubmitSuccess(state) {
      state.error = {message: `Success.`, type: 'success'};
      state.timesSubmitted = state.timesSubmitted + 1;
      state.isSubmitting = false;
      state.canSubmit = false;
    },
    handleCurrenciesSubmitFail(state) {
      state.error = {message: `Something went wrong. Try again later.`, type: 'warning'};
    },
  },
});

export const {
  getCurrenciesSuccess,
  getCurrenciesFail,
  getCurrentRateSuccess,
  handleInputChangeTo,
  handleInputChangeFrom,
  handleStateUpdate,
  getDataPointsSuccess,
  handleCurrenciesSwapp,
  getCurrentRateFail,
  getDataPointsFail,
  handleCurrenciesSubmitStart,
  handleCurrenciesSubmitSuccess,
  handleCurrenciesSubmitFail,
  handleSelectFrom,
  handleSelectTo,
} = appReducer.actions;
export default appReducer.reducer;

export const fetchCurrencies = (): AppThunk => async dispatch => {
  const defaultFrom = 'GBP';
  const defaultTo = 'USD';

  try {
    const {currencyFrom, currencyTo} = getCurrenciesFromStorage();
    const currencies = await getCurrencies();
    const currentRate = await getCurrentRate({
      selectedFrom: currencyFrom ? currencyFrom : defaultFrom,
      selectedTo: currencyTo ? currencyTo : defaultTo,
    });
    const dataPoints = await getDataPoints({
      selectedFrom: currencyFrom ? currencyFrom : defaultFrom,
      selectedTo: currencyTo ? currencyTo : defaultTo,
    });
    const selectedFrom = getSelected(currencyFrom ? currencyFrom : defaultFrom, currencies);
    const selectedTo = getSelected(currencyTo ? currencyTo : defaultTo, currencies);
    dispatch(getCurrenciesSuccess({currencies, currentRate, dataPoints, selectedFrom, selectedTo}));
  } catch (error) {
    dispatch(getCurrenciesFail());
  }
};

export const fetchCurrentRate = (selectedFrom: string, selectedTo: string): AppThunk => async dispatch => {
  try {
    const currentRate = await getCurrentRate({selectedFrom, selectedTo});
    const dataPoints = await getDataPoints({selectedTo, selectedFrom});
    dispatch(getCurrentRateSuccess({currentRate, dataPoints}));
  } catch (error) {
    dispatch(getCurrentRateFail());
  }
};

export const fetchDataPoints = (selectedFrom: string, selectedTo: string): AppThunk => async dispatch => {
  try {
    const datapoints = await getDataPoints({selectedTo, selectedFrom});
    dispatch(getDataPointsSuccess(datapoints));
  } catch (error) {
    dispatch(getDataPointsFail());
  }
};

export const updateSelectedTo = (): AppThunk => dispatch => {
  dispatch(handleStateUpdate());
};

export const onInputChangeFrom = (value: string): AppThunk => dispatch => {
  dispatch(handleInputChangeFrom(value));
};

export const onInputChangeTo = (value: string): AppThunk => dispatch => {
  dispatch(handleInputChangeTo(value));
};

export const selectFrom = (selectedFrom: Currency): AppThunk => dispatch => {
  dispatch(handleSelectFrom(selectedFrom));
};

export const selectTo = (selected: Currency): AppThunk => dispatch => {
  dispatch(handleSelectTo(selected));
};

export const swapCurrencies = ({
  selectedFrom,
  selectedTo,
}: {
  selectedFrom: string;
  selectedTo: string;
}): AppThunk => async dispatch => {
  try {
    const currentRate = await getCurrentRate({selectedFrom, selectedTo});
    dispatch(handleCurrenciesSwapp(currentRate));
  } catch (error) {
    dispatch(getCurrentRateFail());
  }
};

export const submitValues = ({selectedFrom, selectedTo}: UpdatePocketsProps): AppThunk => async dispatch => {
  dispatch(handleCurrenciesSubmitStart());
  try {
    await updatePockets({selectedFrom, selectedTo});
    dispatch(handleCurrenciesSubmitSuccess());
  } catch (error) {
    dispatch(handleCurrenciesSubmitFail());
  }
};
