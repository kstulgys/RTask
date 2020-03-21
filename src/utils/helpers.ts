import {subDays, format} from 'date-fns';
import {Currencies, Currency, DataPoints} from 'app/types';
import numeral from 'numeral';

type FomOrTo = 'From' | 'To';

function numberBetween(min: number, max: number, precision = 100): number {
  return Math.floor(Math.random() * ((max - min) * precision - 1 * precision) + 1 * precision) / (1 * precision);
}

interface FormatHistoryData {
  data: {rates: {[key: string]: {[key: string]: number}}};
  selectedTo: string;
}

function getTimestamp(date: string): number {
  const array = date.split('-');
  const res: string = array[0] + '/' + array[1] + '/' + array[2];
  const time = new Date(res).getTime();
  return time;
}

function formatHistoryData({data, selectedTo}: FormatHistoryData): {x: number; y: number}[] {
  const result = Object.entries(data.rates).map(([date, rate]) => {
    return {x: getTimestamp(date), y: rate[selectedTo]};
  });

  const sorted = result.sort((a, b) => {
    return a.x - b.x;
  });
  return sorted;
}

function getEndAtDay(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function getStartAtDay(param: number): string {
  const day = subDays(new Date(), param);
  return format(new Date(day), 'yyyy-MM-dd');
}

function getSelected(name: string, currencies: Currencies) {
  return currencies.find(c => c.name === name);
}

function filterList(searchTerm: string, currencies: Currencies) {
  return currencies.filter(c => c.name.includes(searchTerm.toUpperCase()));
}

function getCanSubmit({pocketValueFrom, inputValueFrom}: {pocketValueFrom: number; inputValueFrom: number}) {
  return Math.sign(pocketValueFrom) !== -1 && !!inputValueFrom;
}

function waait() {
  const time = numberBetween(1000, 3500, 1);
  return new Promise((res, rej) => setTimeout(() => res(), time));
}

function getPocketValue(type: FomOrTo, currentValue: number, input: string | number) {
  const valueNumber = +input;
  if (type === 'To') {
    return +(currentValue + valueNumber).toFixed(2);
  }
  return +(currentValue - valueNumber).toFixed(2);
}

function getInputValue(type: FomOrTo, currentRate: number, input: string | number) {
  const valueNumber = +input;
  if (type === 'To') {
    return +(currentRate * valueNumber).toFixed(2);
  }
  return +(valueNumber / currentRate).toFixed(2);
}

function isValidInput(value: string) {
  const isNumber = typeof value === 'string' && typeof +value === 'number' && isFinite(+value);
  const exceedsDecimalPlace = value[value.length - 4] === '.' || value[value.length - 4] === ',';
  const isPositive = +value >= 0;
  const isFirstZero = value.length === 2 && value[0] === '0';
  return !exceedsDecimalPlace && isNumber && isPositive && !isFirstZero;
}

function getFiltered(array: Currencies, selectedFrom: Currency | null, selectedTo: Currency | null) {
  return array.filter(c => c.name !== selectedFrom?.name && c.name !== selectedTo?.name);
}

const fPocket = (value: number) => numeral(value).format('00,000.00');

function getCurrenciesFromStorage(): any {
  const result = window.localStorage.getItem('currencies');
  if (!result) return {currencyFrom: null, currencyTo: null};
  const {currencyFrom, currencyTo} = JSON.parse(result);
  return {currencyFrom, currencyTo};
}
const getInputValueTo = (inputValueFrom: string, currentRate: number) => {
  return !inputValueFrom ? '' : (+inputValueFrom * currentRate).toFixed(2);
};
const getInputValueFrom = (inputValueTo: string, currentRate: number) => (+inputValueTo / currentRate).toFixed(2);
const getPocketValueTo = (selectedToValue: number, inputValueTo: string) =>
  +(selectedToValue + +inputValueTo).toFixed(2);
const getPocketValueFrom = (selectedValueFrom: number, inputValueTo: string) =>
  +(selectedValueFrom - +inputValueTo).toFixed(2);

export {
  getInputValueTo,
  getInputValueFrom,
  getPocketValueTo,
  getPocketValueFrom,
  getCurrenciesFromStorage,
  fPocket,
  getFiltered,
  isValidInput,
  getPocketValue,
  getInputValue,
  waait,
  numberBetween,
  formatHistoryData,
  getEndAtDay,
  getStartAtDay,
  getSelected,
  filterList,
  getCanSubmit,
  getTimestamp,
};
