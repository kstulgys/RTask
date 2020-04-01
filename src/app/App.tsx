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
import {fetchCurrencies, fetchCurrentRate, updateSelectedTo, fetchDataPoints, stateSelector} from 'app/appState'
import {useNotification} from 'utils/hooks'

export default function CurrencyExchange() {
  const {currencies} = useSelector(stateSelector)
  useFetchCurrencies()
  useNotification()
  useHandleUpdates()
  useCurrencyToUpdates()

  if (currencies.isLoading) {
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

function useCurrencyToUpdates() {
  const dispatch = useDispatch()
  const {selectedFrom, currentRate} = useSelector(stateSelector)
  React.useEffect(() => {
    if (!selectedFrom || !currentRate.value) return
    dispatch(updateSelectedTo())
  }, [currentRate.value, selectedFrom])
}

function useFetchCurrencies() {
  const dispatch = useDispatch()
  React.useEffect(() => {
    dispatch(fetchCurrencies())
  }, [])
}

function useHandleUpdates() {
  const dispatch = useDispatch()
  const {selectedFrom, selectedTo} = useSelector(stateSelector)
  React.useEffect(() => {
    if (!selectedFrom || !selectedTo) return
    // get new dataPoints
    dispatch(fetchDataPoints({selectedFrom: selectedFrom.name, selectedTo: selectedTo.name}))
    // get new currentRate
    dispatch(fetchCurrentRate({selectedFrom: selectedFrom.name, selectedTo: selectedTo.name}))
    // save currency names to local storage
    window.localStorage.setItem(
      'currencies',
      JSON.stringify({
        currencyFrom: selectedFrom.name,
        currencyTo: selectedTo.name,
      }),
    )

    // start new currentRate polling
    let timer: any = null
    timer = setInterval(() => {
      if (!selectedFrom || !selectedTo) return
      startPolling(selectedFrom.name, selectedTo.name)
    }, 10000)
    function startPolling(currencyFrom: string, currencyTo: string) {
      dispatch(fetchCurrentRate({selectedFrom: currencyFrom, selectedTo: currencyTo}))
    }
    // unsubscribe from previous rate polling
    return () => clearInterval(timer)
  }, [selectedFrom, selectedTo])
}
