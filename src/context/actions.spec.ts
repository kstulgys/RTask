import {
  handleInputValueFromChange,
  handleInputValueToChange,
  handleCurencyRateChange,
  handleCurrenciesSwapp,
  selectFromCurrency,
  selectToCurrency,
  handleValuesSubmit,
  SubmitValuesPayload,
  InitialDataPayload,
  setInitialData,
} from './actions';
import appReducer from './reducer';
import {initialState} from 'context';
import {StatusTypes} from './types';
import {ActionTypes} from './actionTypes';
import '@testing-library/jest-dom/extend-expect';
import {build, fake} from '@jackfranklin/test-data-bot';
import {numberBetween} from 'lib/utils/helpers';

jest.mock('./actions');

const dispatch = jest.fn();

const date1 = new Date();
const date2 = new Date();
const numberTo = numberBetween(5000, 50000);
const numberFrom = numberBetween(5000, 50000);
const payload: InitialDataPayload = {
  pocketValueFrom: numberFrom,
  pocketValueTo: numberTo,
  isLoading: false,
  currencies: [],
  selectedFrom: {name: 'GBP', value: numberFrom},
  selectedTo: {name: 'USD', value: numberTo},
  currentRate: 1.111,
  dataPoints: [
    {x: date1.getTime(), y: 2},
    {x: date2.getTime(), y: 2},
  ],
  status: StatusTypes.idle,
};

describe('SET_INITIAL_DATA_SUCCESS', () => {
  it('SET_INITIAL_DATA_SUCCESS and state update siccess', () => {
    setInitialData(dispatch);
    expect(setInitialData).toBeCalledWith(dispatch);
    const newState = appReducer(initialState, {type: ActionTypes.SET_INITIAL_DATA_SUCCESS, payload});
    expect({...initialState, ...newState}).toEqual(newState);
  });

  it('SET_INITIAL_DATA_FAIL and state update fail', () => {
    const doesNotExistOnState = {
      hello: 'world',
      world: 'hello',
    };
    setInitialData(dispatch);
    expect(setInitialData).toBeCalledWith(dispatch);
    const newState = appReducer(initialState, {type: ActionTypes.SET_INITIAL_DATA_SUCCESS, payload});
    expect({...initialState, ...newState, ...doesNotExistOnState}).not.toEqual(newState);
  });
});
