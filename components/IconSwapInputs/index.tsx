/* eslint-disable react/display-name */
import * as React from 'react'
import { IconButton, Box } from '@chakra-ui/core'
import { FiRepeat } from 'react-icons/fi'
import { motion } from 'framer-motion'
import useStore from 'store'

export function IconSwapInputs() {
  const selectedTo = useStore(state => state.selectedTo)
  const selectedFrom = useStore(state => state.selectedFrom)
  const handleSwapCurrencies = useStore(state => state.actions.handleSwapCurrencies)

  const handleSwap = () => {
    if (!selectedFrom || !selectedTo) return
    handleSwapCurrencies()
  }

  return (
    <Box height="auto" mx={['auto', 'auto', 12]} mt={[0, 0, 6]} mb={[8, 12, 0]}>
      <Rotate key={selectedFrom?.name}>
        <IconButton
          data-testid="button-swap"
          aria-label="swap currencies"
          onClick={handleSwap}
          as={FiRepeat}
          color="revo.blue"
          bg="none"
          _hover={{ bg: 'none' }}
          cursor="pointer"
          _active={{
            bg: 'none',
          }}
        />
      </Rotate>
    </Box>
  )
}

function Rotate(props: any) {
  return (
    <motion.div
      animate={{
        scale: 1.1,
        rotate: 180,
      }}
      {...props}
    />
  )
}
