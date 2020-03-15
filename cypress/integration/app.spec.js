/// <reference types="Cypress" />
import numeral from 'numeral'

function fotmatValueToNormal(value){
  return numeral(value).format('000.00')
}

function fotmatValueToSpecial(value){
  return numeral(value).format('00,000.00')
}

describe('Currency exchange app', () => {
  const user = cy
  beforeEach(()=> {
    user.visit('/');
  })

  it('when typing in "FROM" input the pocket value, input value "TO" and pocket value "TO" changes as expected', () => {
    user.get('[data-testid="pocket-from"]').invoke('text').then((pocketValue) => {
      let inputValueFrom = '1234.45'
      user.findByTestId('input-from').type(inputValueFrom)
      const expectedValue = +(+fotmatValueToNormal(pocketValue)- Number(inputValueFrom)).toFixed(2)
      let result = fotmatValueToSpecial(expectedValue)
      // pocket value "FROM" decreses
      user.get('[data-testid="pocket-from"]').invoke('text').should((nextPocketValue) => {
        expect(nextPocketValue).to.eq(result)
      })
      // input value "TO" increases
      user.get('[data-testid="input-to"]').invoke('val').then((inputValueTo) => {
        user.get('[data-testid="current-rate"]').invoke('text').then((currentRate) => {
          const expected = (+currentRate * Number(inputValueFrom)).toFixed(2)
          expect(inputValueTo).to.eq(expected)
        })
      })
      // pocket value "TO" increases
      user.get('[data-testid="pocket-to"]').invoke('text').then((pocketValueTo) => {
        user.get('[data-testid="input-to"]').invoke('text').then((inputValueTo) => {
          const expected = (+fotmatValueToNormal(pocketValueTo) + Number(inputValueTo)).toFixed(2)
          expect(pocketValueTo).to.eq(fotmatValueToSpecial(expected))
        })
      })
    })
  });
});
