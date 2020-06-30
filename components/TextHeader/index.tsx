import * as React from 'react'
import { Box, Text, useColorMode } from '@chakra-ui/core'

function Header({ text }: { text: string }): JSX.Element {
  const { colorMode } = useColorMode()
  const color = {
    light: 'revo.gray',
    dark: 'revo.lightGray',
  }
  return (
    <Box mb="20">
      <Text as="h1" textAlign="center" fontSize="2xl" color={color[colorMode]}>
        {text}
      </Text>
    </Box>
  )
}

export const TextHeader = React.memo(Header)
