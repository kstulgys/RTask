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
    throw Error(error.response.data);
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

async function getCurrentRate({selectedFrom, selectedTo}: GetCurrentRate): Promise<string> {
  const {data} = await axios(`${baseUrl}/latest?symbols=${selectedTo.name}&base=${selectedFrom.name}`);
  return data.rates[selectedTo.name].toFixed(4);
}

interface GetHistoryData {
  toCurrency: {name: string; value: number};
  fromCurrency: {name: string; value: number};
  daysAgo: 10 | 7 | 30 | 90 | 180 | 360 | 1800;
}

async function getHistoryData({daysAgo, toCurrency, fromCurrency}: GetHistoryData): Promise<{x: number; y: number}[]> {
  const {data} = await axios.get<{rates: {[key: string]: {[key: string]: number}}}>(
    `${baseUrl}/history?start_at=${getStartAtDay(daysAgo)}&end_at=${getEndAtDay()}&symbols=${toCurrency.name}&base=${
      fromCurrency.name
    }`,
  );
  const formatted = formatHistoryData({data, toCurrency});
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

export {getCurrencies, getCurrentRate, getHistoryData, updatePockets};
