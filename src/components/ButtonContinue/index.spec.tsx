import * as React from 'react'
import {render, cleanup, fireEvent, act, wait, waitForElement, queryByTestId} from 'utils/testing'
// import {render, cleanup} from '@testing-library/react'
import user from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import {ButtonContinue} from '.'
import useStore from 'app/store'
// import { useSelector, useDispatch } from 'react-redux';

// const mockDispatch = jest.fn();
// jest.mock('zustand', () => ({
//   useSelector: jest.fn(),
//   useDispatch: () => mockDispatch
// }));
// import {filterList, fPocket} from 'utils/helpers'
// import {getCurrencies} from 'api/currenciesAPI';
// jest.mock('../../app/store', () =>
//   jest.fn(fn => {
//     canSubmit: true
//   }),
// )
const state = {
  canSubmit: false,
  submitValues: {
    isSubmitting: false,
  },
  actions: {
    handleSubmitValues: () => null,
  },
}

jest.mock('../../app/store', () => {
  return jest.fn().mockImplementation(() => ([val]: any) => {
    return {[val]: {...state}}
  })
})

beforeEach(cleanup)

describe('ButtonContinue', () => {
  it('has submit/continue button"', () => {
    const {getByText} = render(<ButtonContinue />)
    const button = getByText(/continue/i)
    expect(button).toBeInTheDocument()
    expect(useStore).toBeCalledTimes(3)
  })
})

describe('button enabled/disabled', () => {
  it('button is disabled', () => {
    const {getByText} = render(<ButtonContinue />)
    const button = getByText(/continue/i)
    // const button = allBtn[0] as HTMLInputElement
    expect(button.disabled).toBeTruthy()
  })
  // it('button is enabled', () => {
  //   const {getAllByText} = render(<App />, {canSubmit: true})
  //   const allBtn = getAllByText(/continue/i)
  //   const button = allBtn[0] as HTMLInputElement
  //   expect(button.disabled).toBeFalsy()
  // })
})

//   it('has no loader when data is loaded', async () => {
//     const {queryByTestId, debug} = render(<App />)
//     expect(queryByTestId(/loader/i)).toBeNull()
//   })
