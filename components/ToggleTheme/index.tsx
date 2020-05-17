import * as React from 'react'
import {Box, IconButton, useColorMode} from '@chakra-ui/core'

export function ToggleTheme() {
  const {colorMode, toggleColorMode} = useColorMode()

  return (
    <Box position="absolute" top="0" right="0" m={[2, 4, 10]}>
      <IconButton
        size="lg"
        rounded="full"
        onClick={toggleColorMode}
        variant="outline"
        aria-label="Send email"
        icon={colorMode === 'light' ? 'sun' : 'moon'}
        border="none"
      />
    </Box>
  )
}
