// import * as React from 'react';
// import actions from 'context/actionTypes';
// import {CurrencyDispatch, Currency} from 'context/types';

// interface Props {
//   dispatch: CurrencyDispatch;
//   selectedFrom: Currency | null;
//   selectedTo: Currency | null;
//   inputValueFrom: number;
//   inputValueTo: number;
// }

// export function useUpdatePockets({dispatch, inputValueFrom, inputValueTo, selectedFrom, selectedTo}: Props): void {
//   React.useEffect(() => {
//     if (selectedFrom && selectedTo) {
//       const selectedFromPocketValue = +(selectedFrom.value - inputValueFrom).toFixed(2);
//       const selectedToPocketValue = +(selectedTo.value + inputValueTo).toFixed(2);
//       const canSubmit = Math.sign(selectedFromPocketValue) !== -1 && !!inputValueFrom;
//       const payload = {canSubmit, selectedFromPocketValue, selectedToPocketValue};
//       console.log({payload});
//       dispatch({
//         type: actions.UPDATE_SELECTED_FROM_POCKET_VALUE,
//         payload: {canSubmit, selectedFromPocketValue},
//       });
//       dispatch({
//         type: actions.UPDATE_SELECTED_TO_POCKET_VALUE,
//         payload: selectedToPocketValue,
//       });
//     }
//   }, [inputValueFrom, inputValueTo, selectedFrom, selectedTo]);
// }

export default null;
