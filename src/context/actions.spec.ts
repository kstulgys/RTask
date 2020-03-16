import {
  handleInputValueFromChange,
  handleInputValueToChange,
  handleCurencyRateChange,
  handleCurrenciesSwapp,
  selectFromCurrency,
  selectToCurrency,
  handleValuesSubmit,
  setInitialData,
} from './actions';

// jest.mock('./actions', () => {
//   setInitialData: jest.fn();
// });

jest.mock('./actions');

const dispatch = jest.fn();

it('setInitialData is called', () => {
  setInitialData(dispatch);
  expect(setInitialData).toBeCalledWith(dispatch);
});
