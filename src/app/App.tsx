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
import {useNotification} from 'utils/hooks'
import useStore from 'app/store'

export default function CurrencyExchange() {
  const state = useStore()

  console.log({state})

  const currencies = useStore(state => state.currencies)
  console.log({currencies})

  useFetchCurrencies()
  useCurrencyToUpdates()
  useHandleUpdates()
  // useNotification()

  if (currencies.isLoading) {
    return <Loader />
  }

  return (
    <ContainerScreen>
      <ErrorBoundary
        render={() => (
          <Text fontSize="3xl" color="revo.gray" textAlign="center">
            Something went wrong. Please try again later.
          </Text>
        )}
      >
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
      </ErrorBoundary>
    </ContainerScreen>
  )
}

interface ContainerProps {
  [key: string]: any
}

function ContainerScreen({children, ...props}: ContainerProps): JSX.Element {
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
      <Flex width={['full', 'full', 'full', '60%']} flexDirection="column" mx="auto" mt={[0, 16]} px="4">
        {children}
      </Flex>
    </Flex>
  )
}

function ContainerInputs(props: ContainerProps): JSX.Element {
  return <Flex flexDir="column" width={['full', 'full', '50%']} {...props} />
}

function useCurrencyToUpdates() {
  const handleSelectedToUpdate = useStore(state => state.actions.handleSelectedToUpdate)
  const currentRate = useStore(state => state.currentRate.value)
  const selectedFrom = useStore(state => state.selectedFrom)
  React.useEffect(() => {
    if (!selectedFrom || !currentRate.value) return
    handleSelectedToUpdate()
  }, [currentRate, selectedFrom])
}

function useFetchCurrencies() {
  const fetchCurrencies = useStore(state => state.asyncActions.fetchCurrencies)
  React.useEffect(() => {
    fetchCurrencies()
  }, [])
}

function useHandleUpdates() {
  const fetchDataPoints = useStore(state => state.asyncActions.fetchDataPoints)
  const fetchCurrentRate = useStore(state => state.asyncActions.fetchCurrentRate)
  const selectedTo = useStore(state => state.selectedTo)
  const selectedFrom = useStore(state => state.selectedFrom)
  React.useEffect(() => {
    if (!selectedFrom || !selectedTo) return
    // get new dataPoints
    fetchDataPoints({selectedFrom: selectedFrom.name, selectedTo: selectedTo.name})
    // get new currentRate
    fetchCurrentRate({selectedFrom: selectedFrom.name, selectedTo: selectedTo.name})
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
      fetchCurrentRate({selectedFrom: currencyFrom, selectedTo: currencyTo})
    }
    // unsubscribe from previous rate polling
    return () => clearInterval(timer)
  }, [selectedFrom, selectedTo])
}
