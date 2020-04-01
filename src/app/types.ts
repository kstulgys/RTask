export type Currency = {name: string; value: number}
export type Currencies = Currency[]
export type DataPoint = {x: number; y: number}
export type DataPoints = DataPoint[]

export type Error = {message: string; type: 'success' | 'warning'} | null

export type CurrencyState = {
  isSubmitting: boolean
  pocketValueFrom: string
  pocketValueTo: string
  canSubmit: boolean
  // isLoading: boolean
  selectedFrom: Currency | undefined
  selectedTo: Currency | undefined
  // currencies: Currencies
  // dataPoints: DataPoints
  // currentRate: number | undefined
  inputValueFrom: string
  inputValueTo: string
  error: Error
  timesSubmitted: number
}
