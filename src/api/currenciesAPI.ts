/* eslint-disable @typescript-eslint/no-use-before-define */
import axios from 'axios';
import {formatHistoryData, getEndAtDay, getStartAtDay} from 'utils/helpers';
import {Currency, Currencies} from 'app/types';
const baseUrl = 'https://api.exchangeratesapi.io';

type Rates = {[key: string]: number};

async function getCurrencies(): Promise<Currencies> {
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

  return formatted.sort((a, b) => +b.value - +a.value);
}

async function getMyPockets(): Promise<{[key: string]: number}> {
  const {data} = await axios.get<{[key: string]: number}>('/api/getPockets');
  return data;
}

interface GetCurrentRateProps {
  selectedFrom: string;
  selectedTo: string;
}

async function getCurrentRate({selectedFrom, selectedTo}: GetCurrentRateProps): Promise<number> {
  const {data} = await axios(`${baseUrl}/latest?symbols=${selectedTo}&base=${selectedFrom}`);
  return +data.rates[selectedTo].toFixed(4);
}

interface GetHistoryData {
  selectedTo: string;
  selectedFrom: string;
  daysAgo?: 10 | 7 | 30 | 90 | 180 | 360 | 1800;
}

async function getDataPoints({
  daysAgo = 30,
  selectedTo,
  selectedFrom,
}: GetHistoryData): Promise<{x: number; y: number}[]> {
  const {data} = await axios.get<{rates: {[key: string]: {[key: string]: number}}}>(
    `${baseUrl}/history?start_at=${getStartAtDay(
      daysAgo,
    )}&end_at=${getEndAtDay()}&symbols=${selectedTo}&base=${selectedFrom}`,
  );
  const formatted = formatHistoryData({data, selectedTo});
  return formatted;
}

export interface UpdatePocketsProps {
  selectedFrom: Currency;
  selectedTo: Currency;
}

async function updatePockets({selectedFrom, selectedTo}: UpdatePocketsProps): Promise<[]> {
  const {data} = await axios.post('/api/updatePockets', {
    selectedFrom,
    selectedTo,
  });

  return data;
}

export {getCurrencies, getCurrentRate, getDataPoints, updatePockets};
