const actions = {
  FETCH_CURRENCIES_START: 'FETCH_CURRENCIES_START',
  FETCH_CURRENCIES_SUCCESS: 'FETCH_CURRENCIES_SUCCESS',
  FETCH_CURRENCIES_FAIL: 'FETCH_CURRENCIES_FAIL',

  SET_FROM_CURRENCY: 'SET_FROM_CURRENCY',
  SET_TO_CURRENCY: 'SET_TO_CURRENCY',

  SELECT_FROM_CURRENCY: 'SELECT_FROM_CURRENCY',
  SELECT_TO_CURRENCY: 'SELECT_TO_CURRENCY',

  FETCH_RATE_START: 'FETCH_RATE_START',
  FETCH_RATE_SUCCESS: 'FETCH_RATE_SUCCESS',
  FETCH_RATE_FAIL: 'FETCH_RATE_FAIL',

  SET_FILTERED_FROM_CURRENCIES: 'SET_FILTERED_FROM_CURRENCIES',
  SET_FILTERED_TO_CURRENCIES: 'SET_FILTERED_TO_CURRENCIES',

  FROM_INPUT_CHANGED: 'FROM_INPUT_CHANGED',
  TO_INPUT_CHANGED: 'TO_INPUT_CHANGED',

  SWAP_INPUTS: 'SWAP_INPUTS',

  SUBMIT_INPUT_VALUES: 'SUBMIT_INPUT_VALUES',

  UPDATE_SELECTED_POCKETS_VALUES: 'UPDATE_SELECTED_POCKETS_VALUES',

  UPDATE_POCKETS_START: 'UPDATE_POCKETS_START',
  UPDATE_POCKETS_SUCCESS: 'UPDATE_POCKETS_SUCCESS',
  UPDATE_POCKETS_FAIL: 'UPDATE_POCKETS_FAIL',
};

export default actions;
