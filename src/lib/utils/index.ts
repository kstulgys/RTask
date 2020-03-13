import {subDays, format} from 'date-fns';
import {Currencies} from 'context/types';

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

function getPocketValue(totalValue: number, inputValue: number) {
  return +(totalValue - inputValue).toFixed(2);
}

function waait() {
  const time = randomNumber(1000, 3500, 1);
  console.log({time});
  return new Promise((res, rej) => setTimeout(() => res(), time));
}

export {
  waait,
  randomNumber,
  formatHistoryData,
  getEndAtDay,
  getStartAtDay,
  getSelected,
  getFiltered,
  getCanSubmit,
  getPocketValue,
};
