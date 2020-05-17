/* eslint-disable @typescript-eslint/no-use-before-define */
import axios from 'axios'
import { formatHistoryData, getEndAtDay, getStartAtDay, waait } from 'utils/helpers'
import { Currency, Currencies, DataPoints } from 'store/types'
import { getPockets } from './backendAPI'
const baseUrl = 'https://api.exchangeratesapi.io'

type Rates = { [key: string]: number }

async function getCurrencies(): Promise<Currencies> {
  const { data } = await axios.get<{ rates: Rates; base: string }>(`${baseUrl}/latest`)
  const myPockets = await getPockets()
  const names = [...Object.keys(data.rates), data.base]
  const formatted: Currencies = names
    .reduce((acc: { name: string; value: number }[], name: string) => {
      return myPockets[name] ? [...acc, { name, value: +myPockets[name] }] : [...acc, { name, value: 0 }]
    }, [])
    .sort((a, b) => b.value - a.value)
  return formatted
}

interface GetCurrentRateProps {
  selectedFrom: string
  selectedTo: string
}

async function getCurrentRate({ selectedFrom, selectedTo }: GetCurrentRateProps): Promise<number> {
  const { data } = await axios(`${baseUrl}/latest?symbols=${selectedTo}&base=${selectedFrom}`)
  return +data.rates[selectedTo].toFixed(4)
}

interface GetHistoryData {
  selectedTo: string
  selectedFrom: string
  daysAgo?: 10 | 7 | 30 | 90 | 180 | 360 | 1800
}

async function getDataPoints({ daysAgo = 30, selectedTo, selectedFrom }: GetHistoryData): Promise<DataPoints> {
  const { data } = await axios.get<{ rates: { [key: string]: { [key: string]: number } } }>(
    `${baseUrl}/history?start_at=${getStartAtDay(daysAgo)}&end_at=${getEndAtDay()}&symbols=${selectedTo}&base=${selectedFrom}`
  )
  const formatted = formatHistoryData({ data, selectedTo })
  return formatted
}

export interface UpdatePocketsProps {
  selectedFrom: Currency
  selectedTo: Currency
}

export { getCurrencies, getCurrentRate, getDataPoints }
