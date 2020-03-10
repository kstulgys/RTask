import axios from 'axios';
import {randomAmount, formatHistoryData, getEndAtDay, getStartAtDay} from '../../lib/utils';

const baseUrl = 'https://api.exchangeratesapi.io';

type Currency = {name: string; value: number};
type Currencies = Currency[];
type Rates = {[key: string]: {[key: string]: number}};

async function getCurrencies(): Promise<Currencies> {
  try {
    const {data} = await axios.get<{rates: Rates; base: string}>(`${baseUrl}/latest`);
    const names = [...Object.keys(data.rates), data.base];
    const myPockets = await getMyPockets();
    const formatted: Currencies = [];

    names.forEach(name => {
      if (myPockets[name]) {
        formatted.unshift({name, value: myPockets[name]});
      } else {
        formatted.push({name, value: 0});
      }
    });
    return formatted;
  } catch (error) {
    throw error.message;
  }
}

async function getMyPockets(): Promise<{[key: string]: number}> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return new Promise((res, _) => {
    setTimeout(
      () =>
        res({
          GBP: randomAmount(100, 50000),
          EUR: randomAmount(100, 50000),
          USD: randomAmount(100, 50000),
        }),
      500,
    );
  });
}

interface GetCurrentRate {
  fromCurrency: Currency;
  toCurrency: Currency;
}

async function getCurrentRate({fromCurrency, toCurrency}: GetCurrentRate): Promise<string> {
  const {data} = await axios(`${baseUrl}/latest?symbols=${toCurrency.name}&base=${fromCurrency.name}`);
  return data.rates[toCurrency.name].toFixed(4);
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

export {getCurrencies, getCurrentRate, getHistoryData};

interface GetHistoryData {
  toCurrency: {name: string; value: number};
  fromCurrency: {name: string; value: number};
  daysAgo: 10 | 7 | 30 | 90 | 180 | 360 | 1800;
}
