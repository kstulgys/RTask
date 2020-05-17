import * as React from 'react'
import {Flex, Spinner} from '@chakra-ui/core'

export function Loader() {
  return (
    <Flex height="100vh" data-testid="loader">
      <Spinner size="xl" mx="auto" mt="30vh" color="revo.blue" />;
    </Flex>
  )
}
