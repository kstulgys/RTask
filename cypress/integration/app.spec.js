/* eslint-disable @typescript-eslint/no-use-before-define */
/// <reference types="Cypress" />
import numeral from 'numeral'

describe('Currency exchange app', () => {
  const user = cy
  beforeEach(() => {
    user.visit('/')
  })

  it('When typing in currency "FROM" input - the pocket value "FROM", input value "TO" and pocket value "TO" changes as expected', () => {
    user
      .findByTestId('pocket-from')
      .invoke('text')
      .then(pocketValueFrom => {
        const inputValueFrom = '1234.45'
        // pocket value "FROM" change
        user.findByTestId('input-from').type(inputValueFrom)
        const expectedValue = (+formatValueToNormal(pocketValueFrom) - Number(inputValueFrom)).toFixed(2)
        // pocket value "FROM" changes
        user
          .findByTestId('pocket-from')
          .invoke('text')
          .then(nextPocketValue => {
            expect(nextPocketValue).to.eq(formatValueToSpecial(expectedValue))
          })
        // input value "TO" changes automaticaly
        user
          .findByTestId('input-to')
          .invoke('val')
          .then(inputValueTo => {
            user
              .findByTestId('current-rate')
              .invoke('text')
              .then(currentRate => {
                const expected = (+currentRate * Number(inputValueFrom)).toFixed(2)
                expect(inputValueTo).to.eq(expected)
              })
          })
        // pocket value "TO" increases
        user
          .findByTestId('pocket-to')
          .invoke('text')
          .then(pocketValueTo => {
            user
              .findByTestId('input-to')
              .invoke('text')
              .then(inputValueTo => {
                const expected = (+formatValueToNormal(pocketValueTo) + Number(inputValueTo)).toFixed(2)
                expect(pocketValueTo).to.eq(formatValueToSpecial(expected))
              })
          })
      })
  })

  it('When typing in currency "To" input - the pocket value "To", input value "FROM" and pocket value "FROM" changes as expected', () => {
    user
      .findByTestId('pocket-from')
      .invoke('text')
      .then(pocketValueFromOld => {
        console.log({pocketValueFromOld})
        user
          .findByTestId('pocket-to')
          .invoke('text')
          .then(pocketValueTo => {
            const _inputValueTo = '2385.49'
            // pocket value "To" change
            user.findByTestId('input-to').type(_inputValueTo)
            const expectedValue = (+formatValueToNormal(pocketValueTo) + Number(_inputValueTo)).toFixed(2)
            // pocket value "To" changes
            user
              .findByTestId('pocket-to')
              .invoke('text')
              .then(nextPocketValue => {
                expect(nextPocketValue).to.eq(formatValueToSpecial(expectedValue))
              })
            // input value "From" changes automaticaly
            user
              .findByTestId('input-to')
              .invoke('val')
              .then(inputValueTo => {
                user
                  .findByTestId('current-rate')
                  .invoke('text')
                  .then(currentRate => {
                    user
                      .findByTestId('input-from')
                      .invoke('val')
                      .then(inputValueFrom => {
                        console.log({inputValueFrom})
                        const expected = (+formatValueToNormal(inputValueTo) / Number(currentRate)).toFixed(2)
                        expect(inputValueFrom).to.eq(expected)
                      })
                  })
              })
            // pocket value "FROM" decreases
            user
              .findByTestId('input-from')
              .invoke('val')
              .then(inputValueFrom => {
                user
                  .findByTestId('pocket-from')
                  .invoke('text')
                  .then(pocketValueFromNew => {
                    console.log({pocketValueFromNew})
                    const expected = +(+formatValueToNormal(pocketValueFromOld) - Number(inputValueFrom)).toFixed(2)
                    expect(pocketValueFromNew).to.eq(formatValueToSpecial(expected))
                  })
              })
          })
      })
  })
})

function formatValueToNormal(value) {
  return numeral(value).format('000.00')
}

function formatValueToSpecial(value) {
  return numeral(value).format('00,000.00')
}
