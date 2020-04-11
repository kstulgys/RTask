import * as React from 'react'
import {useToast} from '@chakra-ui/core'
import {useSelector} from 'react-redux'
// import {RootState} from 'app/store'

export function useNotification(): any {
  return null
  // const {message} = useSelector((state: RootState) => state.app)

  // const toast = useToast()
  // React.useEffect(() => {
  //   if (!message) return
  //   toast({
  //     title: message.text,
  //     description: message.type,
  //     status: message.type,
  //     position: 'top',
  //     duration: 5000,
  //     isClosable: true,
  //   })
  // }, [message])
}
