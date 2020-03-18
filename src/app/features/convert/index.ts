// /* eslint-disable @typescript-eslint/explicit-function-return-type */
// /* eslint-disable @typescript-eslint/no-use-before-define */
// import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// import {AppThunk} from 'app/store';
// import {getCurrencies, getCurrentRate, getDataPoints} from 'api/currenciesAPI';
// import {getSelected} from 'lib/utils/helpers';
// import {Currencies, CurrencyState} from 'app/types';

// const convert = createSlice({
//   name: 'convert',
//   initialState: null,
//   reducers: {
//     handleInputChangeFrom(main, action: PayloadAction<string>) {
//       const state = main.main
//       if (!state.selectedFrom || !state.selectedTo || !state.currentRate) return;
//       const input = +action.payload;
//       const inputValueTo = +(input * state.currentRate).toFixed(2);
//       state.inputValueFrom = input;
//       state.inputValueTo = inputValueTo;
//       state.pocketValueFrom = +(state.selectedFrom.value - input).toFixed(2);
//       state.pocketValueTo = +(state.selectedTo.value + inputValueTo).toFixed(2);
//     },
//     handleInputChangeTo(state, action: PayloadAction<string>) {
//       if (!state.selectedTo || !state.selectedFrom || !state.currentRate) return;
//       const input = +action.payload;
//       const inputValueFrom = +(input / state.currentRate).toFixed(2);
//       state.inputValueTo = input;
//       state.pocketValueTo = +(state.selectedTo.value + input).toFixed(2);
//       state.pocketValueFrom = +(state.selectedFrom.value - inputValueFrom).toFixed(2);
//       state.inputValueFrom = inputValueFrom;
//     },
//   },
// });

// export const {getCurrenciesSuccess, getCurrenciesFail} = convert.actions;
// export default convert.reducer;

// export const fetchCurrencies = (): AppThunk => async dispatch => {
//   try {
//     const currencies = await getCurrencies();
//     const currentRate = await getCurrentRate({selectedFrom: 'GBP', selectedTo: 'USD'});
//     const dataPoints = await getDataPoints({selectedFrom: 'GBP', selectedTo: 'USD'});
//     dispatch(getCurrenciesSuccess({currencies, currentRate, dataPoints}));
//   } catch (error) {
//     dispatch(getCurrenciesFail());
//   }
// };

export default null;
