import * as React from 'react'
import { useToast } from '@chakra-ui/core'
import useStore from 'store'

export function useNotification(): any {
  const { currencies, currentRate, submitValues } = useStore(state => state)

  const toast = useToast()
  const messages = [currencies, currentRate, submitValues]

  React.useEffect(() => {
    messages.forEach(({ message }) => {
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
  }, [currencies, currentRate, submitValues])
}
