/* eslint-disable @typescript-eslint/no-use-before-define */
import axios from 'axios';
import {formatHistoryData, getEndAtDay, getStartAtDay} from 'lib/utils';

const baseUrl = 'https://api.exchangeratesapi.io';

type Currency = {name: string; value: number};
type Currencies = Currency[];
type Rates = {[key: string]: number};

async function getCurrencies(): Promise<Currencies> {
  try {
    const {data} = await axios.get<{rates: Rates; base: string}>(`${baseUrl}/latest`);
    const myPockets = await getMyPockets();
    const names = [...Object.keys(data.rates), data.base];
    const formatted: Currencies = [];

    names.forEach(name => {
      if (myPockets[name]) {
        formatted.push({name, value: myPockets[name]});
      } else {
        formatted.push({name, value: 0});
      }
    });

    return formatted.sort((a, b) => b.value - a.value);
  } catch (error) {
    throw Error(error.toString());
  }
}

async function getMyPockets(): Promise<{[key: string]: number}> {
  const {data} = await axios.get<{[key: string]: number}>('/api/getPockets');
  return data;
}

interface GetCurrentRate {
  selectedFrom: Currency;
  selectedTo: Currency;
}

async function getCurrentRate({selectedFrom, selectedTo}: GetCurrentRate): Promise<number> {
  const {data} = await axios(`${baseUrl}/latest?symbols=${selectedTo.name}&base=${selectedFrom.name}`);
  return +data.rates[selectedTo.name].toFixed(4);
}

interface GetHistoryData {
  selectedTo: Currency;
  selectedFrom: Currency;
  daysAgo: 10 | 7 | 30 | 90 | 180 | 360 | 1800;
}

async function getDataPoints({daysAgo, selectedTo, selectedFrom}: GetHistoryData): Promise<{x: number; y: number}[]> {
  const {data} = await axios.get<{rates: {[key: string]: {[key: string]: number}}}>(
    `${baseUrl}/history?start_at=${getStartAtDay(daysAgo)}&end_at=${getEndAtDay()}&symbols=${selectedTo.name}&base=${
      selectedFrom.name
    }`,
  );
  const formatted = formatHistoryData({data, selectedTo});
  return formatted;
}

interface UpdatePocketsProps {
  from: {currency: string; amount: number};
  to: {currency: string; amount: number};
}

async function updatePockets({from, to}: UpdatePocketsProps): Promise<[]> {
  const {data} = await axios.post('/api/updatePockets', {
    from,
    to,
  });

  return data;
}

export {getCurrencies, getCurrentRate, getDataPoints, updatePockets};
