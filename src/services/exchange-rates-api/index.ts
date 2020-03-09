import axios from "axios";
import {subDays, format} from "date-fns";
// get all currencies
// get base currency history
// get current rate

const baseUrl = `https://api.exchangeratesapi.io/latest`;

async function getCurrenciesName() {
  const {data} = await axios.get<{rates: any; base: any}>(`${baseUrl}`);
  const names = [...Object.keys(data.rates), data.base];
  return names;
}

async function getCurrentRate({fromCurrency, toCurrency}: any) {
  console.log("ellapsed");
  const {data} = await axios(`${baseUrl}?symbols=${toCurrency}&base=${fromCurrency}`);
  return data.rates[toCurrency].toFixed(4);
}

// const DaysAgo = 10 | 7 | 30 | 90 | 180 | 360 | 1800;

interface DaysAgo {
  daysAgo: 10 | 7 | 30 | 90 | 180 | 360 | 1800;
}

interface FromToCurrencies {
  toCurrency: string;
  fromCurrency: string;
}

type IProps = DaysAgo & FromToCurrencies;

async function getHistoryData({daysAgo, toCurrency, fromCurrency}: IProps) {
  const {data} = await axios.get<{rates: {[key: string]: {[key: string]: number}}}>(
    `https://api.exchangeratesapi.io/history?start_at=${getStartAtDay(
      daysAgo
    )}&end_at=${getEndAtDay()}&symbols=${toCurrency}&base=${fromCurrency}`
  );

  const result = Object.entries(data.rates).map(([date, rate], i) => {
    return {x: getTimestamp(date), y: rate[toCurrency]};
  });

  const sorted = result.sort((a, b) => {
    return a.x - b.x;
  });

  return sorted;
}

function getEndAtDay() {
  return format(new Date(), "yyyy-MM-dd");
}

function getStartAtDay(param: number) {
  const day = subDays(new Date(), param);
  return format(new Date(day), "yyyy-MM-dd");
}

function getTimestamp(date: string) {
  let array = date.split("-");
  let res: string = array[0] + "/" + array[1] + "/" + array[2];
  let time = new Date(res).getTime();
  return time;
}

export {getCurrenciesName, getCurrentRate, getHistoryData};

// interface TimeFrame {
//     value:
//       | {key: "10D"; days: 10}
//       | {key: "1W"; days: 7}
//       | {key: "1M"; days: 30}
//       | {key: "3M"; days: 90}
//       | {key: "6M"; days: 180}
//       | {key: "1Y"; days: 360}
//       | {key: "5Y"; days: 1800};
//   }
