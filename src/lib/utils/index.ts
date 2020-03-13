import {subDays, format} from 'date-fns';

function randomAmount(min: number, max: number): number {
  const precision = 100;
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

export {randomAmount, formatHistoryData, getEndAtDay, getStartAtDay};
