import * as React from 'react'
import { Flex, Text, Stack } from '@chakra-ui/core'
import { Dropdown, CurrencyMetadata, InputAmount, TextHeader, ButtonContinue, IconSwapInputs, Loader, ErrorBoundary, ToggleTheme } from 'components'
import { useNotification } from 'utils/hooks'
import useStore from 'store'
import { Layout } from 'components/Layout'

export default function IndexPage() {
  const currencies = useStore(state => state.currencies)
  const { fetchCurrencies } = useStore(state => state.asyncActions)
  React.useEffect(() => {
    fetchCurrencies()
  }, [])

  // Setup listeners
  useCurrencyRatePolling()
  useUpdateOnNewRate()
  useNotification()

  if (currencies.isLoading) return <Loader />

  return (
    <Layout title="Currency Exchange Application">
      <ErrorBoundary
        render={() => (
          <Text fontSize="3xl" color="revo.gray" textAlign="center">
            Something went wrong. Please try again later.
          </Text>
        )}
      >
        <Stack maxW="6xl" width="full" m="auto" p="5">
          <TextHeader text="Exchange money" />
          <Stack flexDir={['column', 'column', 'row']}>
            <Flex flexDir="column" width={['full', 'full', '50%']}>
              <Dropdown label="From" />
              <InputAmount label="From" />
              <ButtonContinue display={['none', 'none', 'block']} />
            </Flex>
            <IconSwapInputs />
            <Flex flexDir="column" width={['full', 'full', '50%']}>
              <Dropdown label="To" />
              <InputAmount label="To" />
              <ButtonContinue display={['block', 'block', 'none']} mb="12" mt="2" />
              <CurrencyMetadata />
            </Flex>
          </Stack>
        </Stack>
      </ErrorBoundary>
    </Layout>
  )
}

function useUpdateOnNewRate() {
  const { fetchDataPoints, fetchCurrentRate } = useStore(state => state.asyncActions)
  const { selectedTo, selectedFrom, currentRate } = useStore(state => state)
  const { handleSelectedToUpdate } = useStore(state => state.actions)

  React.useEffect(() => {
    if (!selectedFrom || !selectedTo) return
    // get new dataPoints
    fetchDataPoints({ selectedFrom: selectedFrom.name, selectedTo: selectedTo.name })
    // get new currentRate
    fetchCurrentRate({ selectedFrom: selectedFrom.name, selectedTo: selectedTo.name })
    // update inputValueTo and pocketValueFrom
    handleSelectedToUpdate()
  }, [currentRate.value])
}

function useCurrencyRatePolling() {
  const { selectedTo, selectedFrom } = useStore(state => state)
  const { fetchCurrentRate, fetchDataPoints } = useStore(state => state.asyncActions)

  React.useEffect(() => {
    if (!selectedFrom || !selectedTo) return
    const { name: selectedFromName } = selectedFrom
    const { name: selectedToName } = selectedTo

    // get new dataPoints
    fetchDataPoints({ selectedFrom: selectedFromName, selectedTo: selectedToName })
    // get new currentRate
    fetchCurrentRate({ selectedFrom: selectedFromName, selectedTo: selectedToName })
    // start new currentRate polling
    let timer: any = null
    timer = setInterval(() => {
      if (!selectedFrom || !selectedTo) return
      fetchCurrentRate({ selectedFrom: selectedFromName, selectedTo: selectedToName })
    }, 10000)

    // unsubscribe from previous rate polling
    return () => clearInterval(timer)
  }, [selectedFrom, selectedTo])
}
