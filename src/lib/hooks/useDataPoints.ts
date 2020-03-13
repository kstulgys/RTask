// import * as React from 'react';
// import actions from 'context/actionTypes';
// import {getDataPoints} from 'services/exchangerates-api';
// import {CurrencyDispatch, Currency} from 'context/types';

// interface Props {
//   dispatch: CurrencyDispatch;
//   selectedFrom: Currency | null;
//   selectedTo: Currency | null;
// }

// export function useDataPoints({dispatch, selectedFrom, selectedTo}: Props): void {
//   React.useEffect(() => {
//     if (selectedTo && selectedFrom) {
//       getDataPoints({daysAgo: 30, selectedTo, selectedFrom}).then(payload => {
//         dispatch({
//           type: actions.SET_DATA_POINTS,
//           payload,
//         });
//       });
//     }
//   }, [selectedFrom, selectedTo]);
// }
export default null;
