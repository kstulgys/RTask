import * as React from 'react'
import {Box, Flex} from '@chakra-ui/core'
import {motion} from 'framer-motion'
import theme from 'theme'

export default function BorderAnimated({open}: {open: boolean}): JSX.Element {
  return (
    <Box position="relative">
      <motion.div
        style={{
          height: 2,
          width: '0px',
          left: '0px',
          top: '0px',
          position: 'absolute',
        }}
        initial="close"
        animate={open ? 'open' : 'close'}
        // theme.colors.revo.blue
        variants={{
          open: {
            zIndex: 9999,
            background: theme.colors['revo']['blue'],
            width: '100%',
            transition: {
              duration: 0.2,
            },
          },
          close: {
            background: '#fff',
            width: '0px',
          },
        }}
      />
      <Flex mt="3" height="2px" bg="revo.lightGray" />
    </Box>
  )
}
