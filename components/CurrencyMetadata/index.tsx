import * as React from 'react'
import { Box, Flex, Text, useColorMode, StatHelpText, StatArrow } from '@chakra-ui/core'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from 'store'

export function CurrencyMetadata({ ...props }: { [key: string]: string }) {
  return (
    <Flex {...props}>
      <CurrentRate minWidth="20" mr={[10, 12]} />
      <TodaysChange width="full" />
    </Flex>
  )
}

export function TodaysChange(props: any) {
  const dataPoints = useStore(state => state.dataPoints.value)
  if (dataPoints.length < 2) return null
  const change: number = dataPoints[dataPoints.length - 1].y - dataPoints[dataPoints.length - 2].y
  const percent = (change * 100) / dataPoints[dataPoints.length - 1].y
  const sign = Math.sign(change)

  return (
    <Box {...props}>
      <Text fontSize="xs" color="revo.gray" fontWeight="medium">
        {`Today's change`}
      </Text>
      <StatHelpText fontWeight="medium" fontSize="xl" color={sign === -1 ? 'red.400' : 'green.400'}>
        <StatArrow type={sign === -1 ? 'decrease' : 'increase'} />
        <AnimateChange change={percent}>
          <span data-testid="current-change">
            {Math.abs(change).toFixed(4)} ({percent.toFixed(2)} %)
          </span>
        </AnimateChange>
      </StatHelpText>
    </Box>
  )
}

export function CurrentRate(props: any) {
  const currentRate = useStore(state => state.currentRate.value)
  const { colorMode } = useColorMode()
  const color = {
    light: 'gray.800',
    dark: 'revo.lightGray',
  }

  if (!currentRate) return null

  return (
    <Box {...props}>
      <Text fontSize="xs" color="revo.gray" fontWeight="medium">
        Current rate
      </Text>
      <Text color={color[colorMode]} fontWeight="medium" fontSize="xl">
        <AnimateChange change={currentRate}>
          <span data-testid="current-rate">{currentRate}</span>
        </AnimateChange>
      </Text>
    </Box>
  )
}

function AnimateChange({ children, change }: any) {
  return (
    <AnimatePresence>
      <motion.span key={change} initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} style={{ position: 'absolute' }}>
        {children}
      </motion.span>
    </AnimatePresence>
  )
}
