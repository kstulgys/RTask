/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react'
import {Flex, Text, useColorMode} from '@chakra-ui/core'
import {
  CurrencyChangeChart,
  Dropdown,
  CurrencyMetadata,
  InputAmount,
  TextHeader,
  ButtonContinue,
  IconSwapInputs,
  Loader,
  ErrorBoundary,
  ToggleTheme,
} from 'components'
import {useSelector, useDispatch} from 'react-redux'
// import {fetchCurrencies, fetchCurrentRate, updateSelectedTo, fetchDataPoints, stateSelector} from 'app/appSlice'
import {RootState, currenciesSelector, currentRateSelector, dataPointsSelector, selectCurrencySelector} from 'app/store'
import {useNotification} from 'utils/hooks'
import {fetchCurrencies} from 'app/features/currencies/currenciesSlice'
import {fetchCurrentRate} from 'app/features/currentRate/currentRateSlice'
import {selectFrom, selectTo} from 'app/features/selectCurrency/selectCurrencySlice'
import {fetchDataPoints} from 'app/features/dataPoints/dataPointsSlice'
import {setInitialPocketValueTo, setInitialPocketValueFrom} from 'app/features/inputChange/inputChangeSlice'
import {getCurrenciesFromStorage, getSelected} from 'utils/helpers'

export default function CurrencyExchange() {
  // const {isLoading} = useSelector((state: RootState) => state.app)
  const {isLoading: isLoadingCurrencies} = useSelector(currenciesSelector)
  const {isLoading: isLoadingCurrentRate} = useSelector(currentRateSelector)
  const state = useSelector(state => state)
  useStateSync()

  console.log({state})
  // useFetchCurrencies()
  // useNotification()
  // useHandleUpdates()
  // useCurrencyToUpdates()

  if (isLoadingCurrencies) {
    return <Loader />
  }

  return (
    <ContainerScreen>
      <ContainerApp>
        <AppErrorBoundary>
          <TextHeader text="Exchange money" />
          <Flex flexDirection={['column', 'column', 'row']} alignItems="start">
            <ContainerInputs>
              <Dropdown label="From" />
              <InputAmount label="From" autoFocus={true} />
              <ButtonContinue display={['none', 'none', 'block']} />
            </ContainerInputs>
            <IconSwapInputs />
            <ContainerInputs>
              <Dropdown label="To" />
              <InputAmount label="To" />
              <ButtonContinue display={['block', 'block', 'none']} mb="12" mt="2" />
              <CurrencyMetadata />
            </ContainerInputs>
          </Flex>
          <CurrencyChangeChart mt="6" />
        </AppErrorBoundary>
      </ContainerApp>
    </ContainerScreen>
  )
}

function AppErrorBoundary(props: any) {
  return (
    <ErrorBoundary
      render={() => (
        <Text fontSize="3xl" color="revo.gray" textAlign="center">
          Something went wrong. Please try again later.
        </Text>
      )}
      {...props}
    />
  )
}

interface ContainerProps {
  [key: string]: any
}

function ContainerScreen(props: ContainerProps): JSX.Element {
  const {colorMode} = useColorMode()
  const bg = {
    light: 'white',
    dark: 'gray.800',
  }

  return (
    <Flex
      as="main"
      minHeight="100vh"
      bg={bg[colorMode]}
      width="full"
      flexDirection="column"
      position="relative"
      {...props}
    >
      <ToggleTheme />
      {props.children}
    </Flex>
  )
}

function ContainerApp(props: ContainerProps): JSX.Element {
  return (
    <Flex width={['full', 'full', 'full', '60%']} flexDirection="column" mx="auto" mt={[0, 16]} px="4" {...props} />
  )
}
function ContainerInputs(props: ContainerProps): JSX.Element {
  return <Flex flexDir="column" width={['full', 'full', '50%']} {...props} />
}

function useStateSync() {
  const {currencies} = useSelector(currenciesSelector)
  const {selectedFrom, selectedTo} = useSelector(selectCurrencySelector)
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(fetchCurrencies())
  }, [])

  React.useEffect(() => {
    if (!currencies.length) return
    const {currencyFrom, currencyTo} = getCurrenciesFromStorage()
    const defaultFrom = 'GBP'
    const defaultTo = 'USD'
    const selectedFrom = getSelected(currencyFrom ? currencyFrom : defaultFrom, currencies)
    const selectedTo = getSelected(currencyTo ? currencyTo : defaultTo, currencies)
    if (!selectedFrom || !selectedTo) return
    dispatch(selectFrom(selectedFrom))
    dispatch(selectTo(selectedTo))
  }, [currencies])

  React.useEffect(() => {
    if (!selectedFrom || !selectedTo) return
    dispatch(fetchCurrentRate({selectedFrom: selectedFrom.name, selectedTo: selectedTo.name}))
    dispatch(fetchDataPoints({selectedFrom: selectedFrom.name, selectedTo: selectedTo.name}))
    dispatch(setInitialPocketValueTo(selectedTo.value.toString()))
    dispatch(setInitialPocketValueFrom(selectedFrom.value.toString()))
  }, [currencies, selectedFrom, selectedTo])
}

// function useCurrencyToUpdates() {
//   const dispatch = useDispatch()
//   const {selectedFrom, currentRate} = useSelector(stateSelector)
//   React.useEffect(() => {
//     if (!selectedFrom || !currentRate) return
//     dispatch(updateSelectedTo())
//   }, [currentRate, selectedFrom])
// }

// function useFetchCurrencies() {
//   const dispatch = useDispatch()
//   const {timesSubmitted} = useSelector(stateSelector)
//   React.useEffect(() => {
//     dispatch(fetchCurrencies())
//   }, [timesSubmitted])
// }

// function useHandleUpdates() {
//   const dispatch = useDispatch()
//   const {selectedFrom, selectedTo} = useSelector(stateSelector)
//   React.useEffect(() => {
//     if (!selectedFrom || !selectedTo) return
//     // get new dataPoints
//     dispatch(fetchDataPoints({selectedFrom: selectedFrom.name, selectedTo: selectedTo.name}))
//     // get new currentRate
//     dispatch(fetchCurrentRate({selectedFrom: selectedFrom.name, selectedTo: selectedTo.name}))
//     // save currency names to local storage
//     window.localStorage.setItem(
//       'currencies',
//       JSON.stringify({
//         currencyFrom: selectedFrom.name,
//         currencyTo: selectedTo.name,
//       }),
//     )

//     // start new currentRate polling
//     function startPolling(currencyFrom: string, currencyTo: string) {
//       dispatch(fetchCurrentRate({selectedFrom: currencyFrom, selectedTo: currencyTo}))
//     }
//     let timer: any = null
//     timer = setInterval(() => {
//       if (!selectedFrom || !selectedTo) return
//       startPolling(selectedFrom.name, selectedTo.name)
//     }, 10000)
//     // unsubscribe from previous rate polling
//     return () => clearInterval(timer)
//   }, [selectedFrom, selectedTo])
// }
