import {subDays, format} from 'date-fns';
import {Currencies} from 'context/types';
type FomOrTo = 'From' | 'To';

function randomNumber(min: number, max: number, precision = 100): number {
  return Math.floor(Math.random() * ((max - min) * precision - 1 * precision) + 1 * precision) / (1 * precision);
}

interface FormatHistoryData {
  data: {rates: {[key: string]: {[key: string]: number}}};
  selectedTo: {name: string; value: number};
}

function getTimestamp(date: string): number {
  const array = date.split('-');
  const res: string = array[0] + '/' + array[1] + '/' + array[2];
  const time = new Date(res).getTime();
  return time;
}

function formatHistoryData({data, selectedTo}: FormatHistoryData): {x: number; y: number}[] {
  const result = Object.entries(data.rates).map(([date, rate]) => {
    return {x: getTimestamp(date), y: rate[selectedTo.name]};
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

function getFiltered(searchTerm: string, currencies: Currencies) {
  return currencies.filter(c => c.name.includes(searchTerm.toUpperCase()));
}

function getCanSubmit({
  selectedFromPocketValue,
  inputValueFrom,
}: {
  selectedFromPocketValue: number;
  inputValueFrom: number;
}) {
  return Math.sign(selectedFromPocketValue) !== -1 && !!inputValueFrom;
}

function waait() {
  const time = randomNumber(1000, 3500, 1);
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

export {
  getPocketValue,
  getInputValue,
  waait,
  randomNumber,
  formatHistoryData,
  getEndAtDay,
  getStartAtDay,
  getSelected,
  getFiltered,
  getCanSubmit,
};
