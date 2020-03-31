import {configureStore, Action, combineReducers} from '@reduxjs/toolkit'
import {ThunkAction} from 'redux-thunk'
import appReducer from 'app/appState'

export const rootReducer = combineReducers({
  app: appReducer,
})

const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>
export default store
