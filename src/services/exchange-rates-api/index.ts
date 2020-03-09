import axios from "axios";
import {subDays, format} from "date-fns";
// get all currencies
// get base currency history
// get current rate

const baseUrl = `https://api.exchangeratesapi.io/latest`;

const currencies = [
  {name: "GBP", flag: "🇬🇧", value: "50,325.65"},
  {name: "EUR", flag: "🇪🇺", value: "20,835.01"},
  {name: "USD", flag: "🇺🇸", value: "69,532.72"}
];

function randomAmount(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min) + 0.54;
}

const flags: any = {
  GBP: "🇬🇧",
  EUR: "🇪🇺",
  USD: "🇺🇸"
};

async function getCurrenciesName() {
  const {data} = await axios.get<{rates: any; base: any}>(`${baseUrl}`);
  const names = [...Object.keys(data.rates), data.base];
  const formatted = names.map((name) => ({
    name,
    flag: flags[name] || flags["GBP"],
    value: randomAmount(500, 50000)
  }));
  return formatted;
}

async function getCurrentRate({fromCurrency, toCurrency}: any) {
  console.log("ellapsed");
  const {data} = await axios(`${baseUrl}?symbols=${toCurrency.name}&base=${fromCurrency.name}`);
  return data.rates[toCurrency.name].toFixed(4);
}

interface DaysAgo {
  daysAgo: 10 | 7 | 30 | 90 | 180 | 360 | 1800;
}

interface FromToCurrencies {
  toCurrency: {name: string; value: number; flag: string};
  fromCurrency: {name: string; value: number; flag: string};
}

type IProps = DaysAgo & FromToCurrencies;

async function getHistoryData({daysAgo, toCurrency, fromCurrency}: IProps) {
  const {data} = await axios.get<{rates: {[key: string]: {[key: string]: number}}}>(
    `https://api.exchangeratesapi.io/history?start_at=${getStartAtDay(
      daysAgo
    )}&end_at=${getEndAtDay()}&symbols=${toCurrency.name}&base=${fromCurrency.name}`
  );

  const result = Object.entries(data.rates).map(([date, rate], i) => {
    return {x: getTimestamp(date), y: rate[toCurrency.name]};
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
