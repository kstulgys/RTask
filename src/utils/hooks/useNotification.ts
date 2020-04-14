import * as React from 'react'
import {useToast} from '@chakra-ui/core'
import useStore from 'app/store'

export function useNotification(): any {
  const currenciesMessage = useStore(state => state.currencies.message)
  const dataPointsMessage = useStore(state => state.dataPoints.message)
  const currentRateMessage = useStore(state => state.currentRate.message)
  const submitValuesMessage = useStore(state => state.submitValues.message)
  const toast = useToast()
  const messages = [currenciesMessage, dataPointsMessage, currentRateMessage, submitValuesMessage]

  React.useEffect(() => {
    messages.forEach(message => {
      if (!message) return

      toast({
        title: message.text,
        description: message.type,
        status: message.type,
        position: 'top',
        duration: 4000,
        isClosable: true,
      })
    })
  }, [currenciesMessage, dataPointsMessage, currentRateMessage, submitValuesMessage])
}
