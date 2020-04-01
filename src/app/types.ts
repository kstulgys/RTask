export type Currency = {name: string; value: number}
export type Currencies = Currency[]
export type DataPoint = {x: number; y: number}
export type DataPoints = DataPoint[]

export type Message = {text?: string; type?: 'success' | 'warning'} | null

export type CurrencyState = {
  isSubmitting: boolean
  pocketValueFrom: string
  pocketValueTo: string
  inputValueFrom: string
  inputValueTo: string
  canSubmit: boolean
  selectedFrom: Currency | undefined
  selectedTo: Currency | undefined
  currencies: {
    isLoading: boolean
    value: Currencies
    message: Message
  }
  dataPoints: {
    isLoading: boolean
    value: DataPoints
    message: Message
  }
  currentRate: {
    isLoading: boolean
    value: number
    message: Message
  }
  message: Message
}
