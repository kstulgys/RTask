import {initialState} from './appState'
import reducer, {stateSelector, fetchCurrencies} from 'app/appState'
import {getDefaultMiddleware, configureStore} from '@reduxjs/toolkit'
import {rootReducer} from 'app/store'
import {getCurrencies, getCurrentRate, getDataPoints} from 'api/currenciesAPI'
// import configureMockStore from 'redux-mock-store'
// import thunk from 'redux-thunk'
// const mockStore = configureMockStore([thunk])

jest.mock('../api/currenciesAPI')

describe('app slice', () => {
  describe('reducer, actions and selectors', () => {
    it('should return the initial state on first run', () => {
      // Arrange
      const nextState = initialState
      // Act
      const result = reducer(undefined, {})
      // Assert
      expect(result).toEqual(nextState)
    })

    it('updates state on fetchCurrencies succeeds', async () => {
      // Arrange
      const currencies = [
        {name: 'GBP', value: 10000.99},
        {name: 'USD', value: 20000.33},
        {name: 'AUD', value: 30000.99},
        {name: 'LTU', value: 40000.33},
      ]

      const payload = {
        currencies,
        currentRate: 1.234,
        dataPoints: [],
        selectedFrom: currencies[0],
        selectedTo: currencies[1],
      }

      // const store = mockStore({app: initialState})
      const store = configureStore({
        reducer: rootReducer,
        preloadedState: {app: {...initialState}},
        middleware: [...getDefaultMiddleware()],
      })

      getCurrencies.mockResolvedValueOnce(payload.currencies)
      getCurrentRate.mockResolvedValueOnce(payload.currentRate)
      getDataPoints.mockResolvedValueOnce(payload.dataPoints)

      // Act
      await store.dispatch(fetchCurrencies())

      // Assert
      expect(getCurrencies).toBeCalledTimes(1)
      expect(getCurrentRate).toBeCalledTimes(1)
      expect(getDataPoints).toBeCalledTimes(1)

      expect(stateSelector(store.getState()).currencies.value).toBe(payload.currencies)
      expect(stateSelector(store.getState()).currencies.isLoading).toBe(false)
      expect(stateSelector(store.getState()).currentRate.value).toBe(payload.currentRate)
      expect(stateSelector(store.getState()).dataPoints.value).toBe(payload.dataPoints)
      expect(stateSelector(store.getState()).selectedFrom).toBe(payload.selectedFrom)
      expect(stateSelector(store.getState()).selectedTo).toBe(payload.selectedTo)
    })
  })
})
